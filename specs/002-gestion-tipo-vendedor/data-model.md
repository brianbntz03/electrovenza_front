# Data Model: Gestión de Tipo de Vendedor

**Feature**: Gestión de Tipo de Vendedor
**Date**: 2025-12-30
**Purpose**: Define data entities, relationships, and validation rules for seller type management

## Overview

This document describes the data model modifications required to support seller type management by administrators. The model extends the existing User/Seller entity from feature 001-vendedor-mayorista with administrative capabilities to modify the seller type field.

**Note**: This is a frontend-focused data model describing what the frontend expects from the backend API. Actual database schema design is the backend's responsibility.

---

## Entity Definitions

### 1. User/Vendedor (Extended)

Extends existing user entity to support seller type editing by administrators.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique user identifier |
| nombre | String | Yes | Max 200 chars | User's full name |
| email | String | Yes | Unique, Email format | User email address |
| password_hash | String | Yes | - | Encrypted password |
| **role** | **Enum/String** | **Yes** | **Values: "administrador", "vendedor_minorista", "vendedor_mayorista"** | **User's role in system** (EDITABLE by admin) |
| activo | Boolean | Yes | Default: true | Whether user account is active |
| fecha_creacion | DateTime | Yes | Auto-set | Account creation timestamp |

#### Validation Rules

- `role` MUST be one of the three allowed values: "administrador", "vendedor_minorista", "vendedor_mayorista"
- `role` can be changed by administrators at any time
- Default `role` for new sellers: "vendedor_minorista"
- `role` field is immutable for non-admin users (cannot change their own role)

#### Relationships

- One-to-Many with Customer (via `vendedor_asignado_id`)
- One-to-Many with Sale (via `vendedor_id`)

---

## Data Flow

### 1. List Sellers with Type Display

```
Administrator navigates to /gestion/vendedores/
    ↓
GET /users?role_in=vendedor_minorista,vendedor_mayorista
    ↓
Backend returns array of seller records including role field
    ↓
Frontend displays table with columns: Nombre, Email, Tipo, Estado, Acciones
    ↓
Tipo column displays: "Vendedor Minorista" or "Vendedor Mayorista" based on role value
```

### 2. Edit Seller Type Flow

```
Administrator clicks "Editar" for a seller
    ↓
Frontend displays edit form with current seller data
    ↓
Form includes dropdown for Tipo de Vendedor with options:
  - Vendedor Minorista (vendedor_minorista)
  - Vendedor Mayorista (vendedor_mayorista)
    ↓
Administrator changes role selection
    ↓
Administrator clicks "Guardar"
    ↓
Frontend shows confirmation: "¿Está seguro? El vendedor deberá cerrar sesión para ver los cambios."
    ↓
PUT /users/{id}
{
  "nombre": "...",
  "email": "...",
  "role": "vendedor_mayorista"
}
    ↓
Backend validates:
  - Requesting user is administrator
  - role value is one of three allowed values
  - Updates user record
    ↓
Backend returns updated user object
    ↓
Frontend displays success message and refreshes list
```

### 3. Create Seller with Type Selection

```
Administrator navigates to /gestion/crearvendedores
    ↓
Frontend displays create form with fields:
  - Nombre
  - Email
  - Contraseña
  - Tipo de Vendedor (dropdown, default: "Vendedor Minorista")
    ↓
Administrator fills form and selects seller type
    ↓
Administrator clicks "Crear"
    ↓
POST /users
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "encrypted_password",
  "role": "vendedor_mayorista"
}
    ↓
Backend validates and creates user
    ↓
Backend returns created user with id
    ↓
Frontend displays success message and navigates to seller list
```

---

## State Transitions

### Seller Role State Machine

```
[New Seller Created]
        ↓
[role = vendedor_minorista] (default)
        ↓
[Administrator edits role]
        ↓
[role = vendedor_mayorista] ← Administrator can change back
        ↓
[Administrator edits role]
        ↓
[role = vendedor_minorista] ← Can toggle freely
```

**Important notes**:
- No restrictions on role transitions (admin has full control)
- Seller must re-login for menu changes to take effect
- Customers and sales remain associated with seller regardless of role changes

---

## Data Integrity Constraints

### Database-Level Constraints (Backend Responsibility)

1. **Foreign Key Constraints**:
   - Maintain existing constraints from feature 001 (customers, sales)

2. **Check Constraints**:
   - `user.role IN ('administrador', 'vendedor_minorista', 'vendedor_mayorista')` (already exists from feature 001)

3. **Unique Constraints**:
   - `user.email` (UNIQUE) (already exists)

4. **Triggers/Defaults**:
   - Default value for `role`: "vendedor_minorista" when not specified

---

## Migration Considerations

### Data Migration for Existing Sellers

**Required migration script** (backend responsibility):

```sql
-- Set default role for existing sellers with null role
UPDATE users
SET role = 'vendedor_minorista'
WHERE role IS NULL
  AND id IN (SELECT DISTINCT vendedor_id FROM sales WHERE vendedor_id IS NOT NULL);

-- Alternatively, set role for all non-admin users
UPDATE users
SET role = 'vendedor_minorista'
WHERE role IS NULL
  AND id NOT IN (SELECT id FROM users WHERE role = 'administrador');
```

**Frontend assumptions**:
- All sellers will have a valid `role` value after migration
- No need for frontend to handle `null` role values
- Migration runs before feature deployment

---

## API Contract Summary

### Required Endpoints (likely already exist)

1. **GET /users** or **GET /vendedores**
   - Returns array of user objects including `role` field
   - Query params: `role_in=vendedor_minorista,vendedor_mayorista` (optional)

2. **POST /users** or **POST /vendedores**
   - Accepts `role` in request body
   - Returns created user object with `id` and `role`

3. **PUT /users/{id}** or **PUT /vendedores/{id}**
   - Accepts `role` in request body
   - Validates requesting user is administrator
   - Returns updated user object

---

## Frontend State Management

### Component State for Edit Form

```javascript
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  role: 'vendedor_minorista' // default
});

const handleRoleChange = (e) => {
  setFormData({
    ...formData,
    role: e.target.value
  });
};
```

### Role Display Mapping

```javascript
const roleDisplayNames = {
  'vendedor_minorista': 'Vendedor Minorista',
  'vendedor_mayorista': 'Vendedor Mayorista',
  'administrador': 'Administrador'
};
```

---

## Validation Summary

### Frontend Validation

- **Role selection**: Must be one of two options (minorista/mayorista) when creating/editing sellers
- **Email format**: Valid email format
- **Required fields**: nombre, email, role

### Backend Validation

- **Role values**: Must be one of three constitutional roles
- **Authorization**: Only administrators can modify seller roles
- **Email uniqueness**: Email must be unique across all users
- **Immutability**: Non-admin users cannot change their own role

---

## Constitutional Compliance

This data model aligns with Constitutional Principle I - Role-Based Authorization:

✅ **Maintains three-role hierarchy**: No new roles introduced, only allows editing of existing role field
✅ **Admin-only editing**: Only administrators can modify seller roles
✅ **Preserves existing relationships**: Customer and sale relationships maintained when seller type changes
✅ **No data loss**: Historical data (sales, customers) preserved across role transitions

---

## Next Steps

✅ Data model complete
→ Proceed to API contracts design
