# Quickstart Guide: Gestión de Tipo de Vendedor Implementation

**Feature**: Gestión de Tipo de Vendedor
**Date**: 2025-12-30
**Purpose**: Developer guide for implementing seller type management functionality

## Prerequisites

### Required Knowledge
- React 19.1.0 (functional components, hooks)
- React Router DOM 7.0.2 (routing, navigation)
- SweetAlert2 for user notifications
- Understanding of feature 001-vendedor-mayorista (role-based menu system)

### Development Environment
- Node.js 16+ and npm 11+
- Code editor (VS Code recommended)
- Git for version control
- Access to backend API (development or staging)

### Backend Requirements
Before starting frontend development, ensure backend supports:
- [ ] User/Seller model with `role` field (should already exist from feature 001)
- [ ] Role validation: accepts "administrador", "vendedor_minorista", "vendedor_mayorista"
- [ ] Default value: `role = "vendedor_minorista"` for new sellers
- [ ] Data migration: existing sellers with `null` role set to "vendedor_minorista"
- [ ] Endpoints: `GET/POST/PUT /users` or `/vendedores` (see [contracts/api-sellers.yaml](contracts/api-sellers.yaml))

---

## Project Setup

### 1. Clone and Install

```bash
# Switch to feature branch (should already be checked out)
git checkout 002-gestion-tipo-vendedor

# Install dependencies (if not already installed)
npm install

# Start development server
npm start
```

Server starts on http://localhost:3000

### 2. Verify Existing Functionality

Before making changes, verify the existing seller management works:

1. Login as administrator
2. Navigate to `/gestion/vendedores` to see seller list
3. Navigate to `/gestion/crearvendedores` to see create seller form
4. Verify these pages exist and load correctly

This confirms existing components are functioning correctly.

---

## Implementation Workflow

Follow this order to implement the feature systematically:

### Phase 1: Extend Seller List to Display Seller Type (User Story 3 - P3)

**Goal**: Add "Tipo" column to seller list table

#### Step 1.1: Modify PageListadoVendedores

**File**: `src/pages/PageListadoVendedores.js` (MODIFY)

Add a new column to the seller table to display seller type:

1. Find the table header (`<thead>`) and add new column:
```javascript
<th>Tipo</th>
```

2. Find the table body (`<tbody>`) and add new cell in the row:
```javascript
<td>
  <span className={`badge ${seller.role === 'vendedor_mayorista' ? 'badge-info' : 'badge-success'}`}>
    {seller.role === 'vendedor_mayorista' ? 'Vendedor Mayorista' : 'Vendedor Minorista'}
  </span>
</td>
```

**Test**: Reload `/gestion/vendedores` and verify the "Tipo" column appears with appropriate badges.

---

### Phase 2: Add Seller Type Selection to Edit Form (User Story 1 - P1)

**Goal**: Allow administrators to edit seller type

#### Step 2.1: Modify Edit Seller Component

**File**: Find the edit seller form component (likely in `src/Components/Crear/CrearVendedor.js` or inline in `PageListadoVendedores.js`)

Add seller type dropdown field:

```javascript
import { ROLES } from '../constants/roles';

// In the form component:
const [role, setRole] = useState(seller.role || 'vendedor_minorista');

// Add this form group:
<div className="form-group">
  <label>Tipo de Vendedor *</label>
  <select
    className="form-control"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <option value="vendedor_minorista">Vendedor Minorista</option>
    <option value="vendedor_mayorista">Vendedor Mayorista</option>
  </select>
  <small className="form-text text-muted">
    El vendedor deberá cerrar sesión y volver a iniciar para que el cambio surta efecto.
  </small>
</div>
```

#### Step 2.2: Add Confirmation Dialog

Before saving seller type changes, show confirmation:

```javascript
const handleSave = async () => {
  // Show confirmation if role changed
  if (role !== seller.role) {
    const result = await Swal.fire({
      title: '¿Cambiar tipo de vendedor?',
      html: `
        <p>Está cambiando el tipo de vendedor de:</p>
        <p><strong>${seller.role === 'vendedor_minorista' ? 'Vendedor Minorista' : 'Vendedor Mayorista'}</strong></p>
        <p>a:</p>
        <p><strong>${role === 'vendedor_minorista' ? 'Vendedor Minorista' : 'Vendedor Mayorista'}</strong></p>
        <p className="text-muted mt-3">El vendedor deberá cerrar sesión para ver los cambios.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }
  }

  // Proceed with save
  // ... existing save logic with role included in request body
};
```

**Test**: Edit a seller, change their type, verify confirmation dialog, save, and verify the change persists.

---

### Phase 3: Add Seller Type Selection to Create Form (User Story 2 - P2)

**Goal**: Allow administrators to select seller type when creating new seller

#### Step 3.1: Modify CrearVendedor Component

**File**: `src/Components/Crear/CrearVendedor.js` (MODIFY)

Add seller type dropdown to create form:

```javascript
import { ROLES } from '../constants/roles';

// In component state:
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  password: '',
  role: 'vendedor_minorista' // default
});

// Add form group:
<div className="form-group">
  <label>Tipo de Vendedor *</label>
  <select
    className="form-control"
    name="role"
    value={formData.role}
    onChange={handleInputChange}
    required
  >
    <option value="vendedor_minorista">Vendedor Minorista</option>
    <option value="vendedor_mayorista">Vendedor Mayorista</option>
  </select>
  <small className="form-text text-muted">
    Seleccione el tipo de vendedor. Por defecto: Vendedor Minorista.
  </small>
</div>
```

#### Step 3.2: Update Submit Handler

Ensure `role` is included in POST request:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
    });

    if (!response.ok) {
      throw new Error('Error creating seller');
    }

    Swal.fire({
      icon: 'success',
      title: 'Vendedor creado',
      text: `Se creó el vendedor como ${formData.role === 'vendedor_minorista' ? 'Vendedor Minorista' : 'Vendedor Mayorista'}`
    });

    // Redirect to seller list
    navigate('/gestion/vendedores');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
  }
};
```

**Test**: Create a new seller, select "Vendedor Mayorista", verify seller is created with correct type.

---

## Testing Guide

### Manual Testing Checklist

**Seller List Display (User Story 3)**:
- [ ] Navigate to `/gestion/vendedores` as administrator
- [ ] Verify "Tipo" column appears in table
- [ ] Verify sellers show "Vendedor Minorista" or "Vendedor Mayorista" badge
- [ ] Badge colors differ (e.g., blue for mayorista, green for minorista)

**Edit Seller Type (User Story 1)**:
- [ ] Click "Editar" on an existing seller
- [ ] Verify "Tipo de Vendedor" dropdown appears with current value selected
- [ ] Change seller type from minorista to mayorista
- [ ] Verify confirmation dialog appears
- [ ] Confirm and save
- [ ] Verify seller type updated in list
- [ ] Have that seller login and verify their menu changed (after re-login)

**Create Seller with Type (User Story 2)**:
- [ ] Navigate to `/gestion/crearvendedores`
- [ ] Verify "Tipo de Vendedor" dropdown appears
- [ ] Verify default selection is "Vendedor Minorista"
- [ ] Create seller as "Vendedor Mayorista"
- [ ] Verify seller appears in list with correct type
- [ ] Have that seller login and verify they see mayorista menu

**Edge Cases**:
- [ ] Create seller without selecting type (should default to minorista)
- [ ] Change seller type back and forth multiple times (should work without error)
- [ ] Verify only administrators can access `/gestion/vendedores` and `/gestion/crearvendedores`

---

## Troubleshooting

### Common Issues

**Issue**: "Tipo" column doesn't show in seller list
- **Solution**: Verify you modified the correct component file (PageListadoVendedores.js)
- **Fix**: Check that table header and body both have the new column

**Issue**: Dropdown doesn't appear in edit form
- **Solution**: Verify you're editing the correct form component
- **Fix**: Look for the component that handles seller editing (might be inline or separate)

**Issue**: Role doesn't persist after save
- **Solution**: Backend not accepting `role` field
- **Fix**: Verify backend API contract, check request payload includes `role`

**Issue**: Seller menu doesn't update after type change
- **Solution**: Seller hasn't re-logged in
- **Fix**: Seller must close session and login again for localStorage to update

**Issue**: Cannot select seller type when creating
- **Solution**: CrearVendedor component not updated
- **Fix**: Verify you added the dropdown to the correct create form component

---

## Code Style Guidelines

### Naming Conventions

- **Spanish for business concepts**: `vendedor`, `tipo`, `minorista`, `mayorista`
- **English for technical terms**: `role`, `handleChange`, `useState`
- **Components**: PascalCase (`CrearVendedor`, `PageListadoVendedores`)
- **Functions**: camelCase (`handleRoleChange`, `fetchSellers`)
- **Constants**: UPPER_SNAKE_CASE or imported from `ROLES` object

### Component Structure

```javascript
// 1. Imports
import React, { useState } from 'react';
import { ROLES } from '../constants/roles';
import Swal from 'sweetalert2';

// 2. Component definition
export default function MyComponent() {
  // 3. State
  const [role, setRole] = useState('vendedor_minorista');

  // 4. Event handlers
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## Next Steps

After completing implementation:

1. ✅ Complete all manual testing checklist items
2. ✅ Test with real backend (not mocks)
3. ✅ Verify existing seller management functionality still works
4. ✅ Get code review from team
5. ✅ Create pull request
6. ✅ Deploy to staging for QA testing

---

## Resources

- **Feature Spec**: [spec.md](spec.md)
- **Data Model**: [data-model.md](data-model.md)
- **API Contracts**: [contracts/api-sellers.yaml](contracts/api-sellers.yaml)
- **Research**: [research.md](research.md)
- **Constitution**: [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Feature 001 (Dependencies)**: [../../specs/001-vendedor-mayorista/](../../specs/001-vendedor-mayorista/)

---

## Getting Help

- **Questions about requirements**: Review [spec.md](spec.md)
- **Questions about data**: Review [data-model.md](data-model.md)
- **Questions about API**: Review [contracts/api-sellers.yaml](contracts/api-sellers.yaml)
- **Questions about seller roles**: Review feature 001-vendedor-mayorista
