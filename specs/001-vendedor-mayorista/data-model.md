# Data Model: Vendedor Mayorista Role

**Feature**: Vendedor Mayorista Role
**Date**: 2025-12-29
**Purpose**: Define data entities, relationships, and validation rules for wholesale seller functionality

## Overview

This document describes the data model extensions required to support the wholesale seller role. The model builds on existing entities (User, Product, Customer, Sale) with minimal additions to support role-based pricing, customer portfolio isolation, and wholesale sales tracking.

**Note**: This is a frontend-focused data model describing what the frontend expects from the backend API. Actual database schema design is the backend's responsibility.

---

## Entity Definitions

### 1. User (Extended)

Extends existing user entity with role support for wholesale sellers.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique user identifier |
| username | String | Yes | Unique | User login name |
| email | String | Yes | Unique, Email format | User email address |
| password_hash | String | Yes | - | Encrypted password |
| **role** | **Enum/String** | **Yes** | **Values: "administrador", "vendedor_minorista", "vendedor_mayorista"** | **User's role in system** |
| nombre_completo | String | Yes | - | Full name for display |
| activo | Boolean | Yes | Default: true | Whether user account is active |
| fecha_creacion | DateTime | Yes | Auto-set | Account creation timestamp |

#### Validation Rules

- `role` MUST be one of the three allowed values
- `role` cannot be changed without administrator permission
- User MUST have exactly one role (no multi-role support)
- Wholesale sellers (`vendedor_mayorista`) MUST NOT be assigned retail customers

#### Relationships

- One-to-Many with Customer (via `vendedor_asignado_id`)
- One-to-Many with Sale (via `vendedor_id`)

---

### 2. Customer/Cliente (Extended)

Extends existing customer entity to support wholesale customer type and seller assignment.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique customer identifier |
| nombre | String | Yes | Max 200 chars | Customer name |
| dni_cuit | String | No | Unique if provided | Tax ID or national ID |
| telefono | String | No | - | Contact phone number |
| direccion | String | No | - | Physical address |
| email | String | No | Email format | Contact email |
| **tipo_cliente** | **Enum/String** | **Yes** | **Values: "minorista", "mayorista"** | **Customer type: retail or wholesale** |
| **vendedor_asignado_id** | **Integer/UUID** | **Yes** | **Foreign Key → User.id** | **Seller who owns this customer** |
| activo | Boolean | Yes | Default: true | Whether customer is active |
| fecha_creacion | DateTime | Yes | Auto-set | Customer creation timestamp |
| notas | Text | No | - | Internal notes about customer |

#### Validation Rules

- `tipo_cliente` MUST match the role of the creating user:
  - Created by `vendedor_minorista` → `tipo_cliente = "minorista"`
  - Created by `vendedor_mayorista` → `tipo_cliente = "mayorista"`
  - Administrators can create either type
- `vendedor_asignado_id` MUST reference an active user with role `vendedor_minorista` or `vendedor_mayorista`
- `vendedor_asignado_id` CANNOT be changed without administrator approval (enforces portfolio permanence)
- Customer CANNOT be assigned to a seller whose role doesn't match customer type

#### Relationships

- Many-to-One with User (seller assignment)
- One-to-Many with Sale

#### Query Patterns

**Get wholesale customers for a specific seller**:
```
GET /clientes?tipo=mayorista&vendedor_id=123
```

**Get retail customers for a specific seller**:
```
GET /clientes?tipo=minorista&vendedor_id=123
```

**Get all customers (admin only)**:
```
GET /clientes
```

---

### 3. Product/Articulo/Electrodomestico (Extended)

Extends existing product entity to include wholesale pricing.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique product identifier |
| nombre | String | Yes | Max 300 chars | Product name/description |
| categoria_id | Integer/UUID | No | Foreign Key → Category.id | Product category |
| precio | Decimal | Yes | > 0 | **Retail price** (existing field) |
| **precio_mayorista** | **Decimal** | **Yes** | **> 0, ≤ precio** | **Wholesale price** (new field) |
| stock_disponible | Integer | Yes | ≥ 0 | Available stock quantity |
| imagen_url | String | No | Valid URL | Product image URL |
| activo | Boolean | Yes | Default: true | Whether product is active/sellable |
| descripcion | Text | No | - | Detailed product description |

#### Validation Rules

- `precio_mayorista` SHOULD be less than or equal to `precio` (warning if violated, not hard error)
- `precio_mayorista` MUST be greater than zero
- Products without `precio_mayorista` MAY be hidden from wholesale sellers (frontend can filter)
- `stock_disponible` MUST be decremented atomically on sale completion

#### Relationships

- Many-to-One with Category
- Many-to-Many with Sale (via SaleItem/DetalleVenta)

#### Query Patterns

**Get products with wholesale pricing for wholesale sellers**:
```
GET /articulos?precio_mayorista_required=true
```
Returns only products where `precio_mayorista IS NOT NULL AND precio_mayorista > 0`

**Get all products (for retail sellers and admins)**:
```
GET /articulos
```

---

### 4. Sale/Venta (Extended)

Extends existing sale entity to distinguish wholesale sales from retail sales.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique sale identifier |
| cliente_id | Integer/UUID | Yes | Foreign Key → Cliente.id | Customer who purchased |
| vendedor_id | Integer/UUID | Yes | Foreign Key → User.id | Seller who made the sale |
| **tipo_venta** | **Enum/String** | **Yes** | **Values: "minorista_contado", "minorista_credito", "mayorista"** | **Sale type** |
| fecha_venta | DateTime | Yes | Auto-set | Sale completion timestamp |
| monto_total | Decimal | Yes | > 0 | Total sale amount |
| estado | Enum/String | Yes | Values: "completada", "anulada" | Sale status |
| metodo_pago | Enum/String | Yes for mayorista | Values: "efectivo", "transferencia", "cheque" | Payment method (cash sales) |
| observaciones | Text | No | - | Internal notes |

#### Validation Rules

- If `tipo_venta = "mayorista"`:
  - `cliente_id` MUST reference a customer where `tipo_cliente = "mayorista"`
  - `vendedor_id` MUST reference a user where `role = "vendedor_mayorista"`
  - Credit/installment fields (cuotas, fecha_primer_vencimiento, etc.) MUST be NULL
  - `metodo_pago` is REQUIRED
  - `estado` MUST be "completada" immediately (no pending state)

- If `tipo_venta = "minorista_contado"` or `"minorista_credito"`:
  - `cliente_id` MUST reference a customer where `tipo_cliente = "minorista"`
  - `vendedor_id` MUST reference a user where `role = "vendedor_minorista"`

#### Relationships

- Many-to-One with Cliente
- Many-to-One with User (seller)
- One-to-Many with SaleItem/DetalleVenta

---

### 5. SaleItem/DetalleVenta (Extended)

Links sales to products with pricing information.

#### Attributes

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | Integer/UUID | Yes | Primary Key | Unique item identifier |
| venta_id | Integer/UUID | Yes | Foreign Key → Venta.id | Parent sale |
| articulo_id | Integer/UUID | Yes | Foreign Key → Articulo.id | Product sold |
| cantidad | Integer | Yes | > 0 | Quantity sold |
| **precio_unitario** | **Decimal** | **Yes** | **> 0** | **Price used for this item (retail or wholesale)** |
| subtotal | Decimal | Yes | = cantidad * precio_unitario | Line item total |

#### Validation Rules

- `precio_unitario` MUST match the sale type:
  - If parent `venta.tipo_venta = "mayorista"` → `precio_unitario = articulo.precio_mayorista`
  - If parent `venta.tipo_venta` starts with "minorista" → `precio_unitario = articulo.precio`
- `subtotal` MUST equal `cantidad * precio_unitario` (calculated field or validated)
- `cantidad` MUST NOT exceed `articulo.stock_disponible` at time of sale creation

#### Relationships

- Many-to-One with Venta
- Many-to-One with Articulo

---

## Entity Relationships Diagram

```
┌─────────────────────────┐
│         User            │
│  ──────────────────     │
│  id (PK)                │
│  username               │
│  role ◄─────────────────┼─── NEW: "vendedor_mayorista"
│  ...                    │
└──────────┬──────────────┘
           │
           │ vendedor_asignado_id (FK)
           │
           ▼
┌─────────────────────────┐
│       Customer          │
│  ──────────────────     │
│  id (PK)                │
│  nombre                 │
│  tipo_cliente ◄─────────┼─── NEW: "minorista" | "mayorista"
│  vendedor_asignado_id ◄─┼─── NEW: FK to User
│  ...                    │
└──────────┬──────────────┘
           │
           │ cliente_id (FK)
           │
           ▼
┌─────────────────────────┐
│         Sale            │
│  ──────────────────     │
│  id (PK)                │
│  cliente_id (FK)        │
│  vendedor_id (FK)       │
│  tipo_venta ◄───────────┼─── NEW: "mayorista" | "minorista_..."
│  monto_total            │
│  ...                    │
└──────────┬──────────────┘
           │
           │ venta_id (FK)
           │
           ▼
┌─────────────────────────┐
│       SaleItem          │
│  ──────────────────     │
│  id (PK)                │
│  venta_id (FK)          │
│  articulo_id (FK)       │
│  precio_unitario ◄──────┼─── Uses precio or precio_mayorista
│  cantidad               │
│  subtotal               │
└──────────┬──────────────┘
           │
           │ articulo_id (FK)
           │
           ▼
┌─────────────────────────┐
│       Product           │
│  ──────────────────     │
│  id (PK)                │
│  nombre                 │
│  precio                 │
│  precio_mayorista ◄─────┼─── NEW: Wholesale price
│  stock_disponible       │
│  ...                    │
└─────────────────────────┘
```

---

## Data Validation Summary

### Constitutional Compliance

These validation rules enforce the constitutional principles:

**Principle I - Role-Based Authorization**:
- User.role enum enforces three-role hierarchy
- Customer.vendedor_asignado_id prevents cross-seller access
- Sale.vendedor_id + tipo_venta validates seller permissions

**Principle II - Dual Pricing Architecture**:
- Product.precio (retail) and precio_mayorista (wholesale)
- SaleItem.precio_unitario must match sale type
- Prevents price tier mixing in transactions

**Principle III - Client Portfolio Isolation**:
- Customer.vendedor_asignado_id is immutable (admin override only)
- Customer.tipo_cliente matches seller role
- Sale.cliente_id validated against seller's portfolio

**Principle IV - Credit vs Cash Flow Separation**:
- Sale.tipo_venta = "mayorista" prohibits credit fields
- Wholesale sales immediately marked "completada"
- metodo_pago required for cash sales

**Principle V - Stock and Inventory Integrity**:
- SaleItem.cantidad validated against Product.stock_disponible
- Stock decrement atomic with sale creation
- Prevents overselling

---

## Frontend Data Flow

### 1. User Login Flow

```
User enters credentials
    ↓
POST /auth/login → Returns JWT
    ↓
Frontend decodes JWT → Extracts { user_id, role, nombre }
    ↓
Store in localStorage: user_id, role
    ↓
Render menu based on role
```

### 2. Wholesale Sale Creation Flow

```
Wholesale seller logs in (role = "vendedor_mayorista")
    ↓
GET /clientes?tipo=mayorista&vendedor_id={user_id}
    ↓
Display customer list → User selects customer
    ↓
GET /articulos?precio_mayorista_required=true
    ↓
Display products with precio_mayorista → User adds to cart
    ↓
Calculate monto_total = Σ(cantidad × precio_mayorista)
    ↓
POST /ventas-mayorista
{
  cliente_id,
  vendedor_id,
  tipo_venta: "mayorista",
  metodo_pago: "efectivo",
  items: [
    { articulo_id, cantidad, precio_unitario: precio_mayorista }
  ]
}
    ↓
Backend validates:
  - cliente.tipo_cliente = "mayorista"
  - cliente.vendedor_asignado_id = vendedor_id
  - stock disponible ≥ cantidad
  - precio_unitario = articulo.precio_mayorista
    ↓
Backend atomically:
  - Creates venta record
  - Creates detalle_venta records
  - Decrements stock
  - Returns venta_id
    ↓
Frontend displays success message
```

### 3. Customer Creation Flow

```
Wholesale seller clicks "Agregar Cliente"
    ↓
Display customer form
    ↓
User fills: nombre, dni_cuit, telefono, direccion
    ↓
Frontend auto-sets (based on logged-in user):
  - tipo_cliente = "mayorista"
  - vendedor_asignado_id = current_user_id
    ↓
POST /clientes
{
  nombre,
  dni_cuit,
  telefono,
  direccion,
  tipo_cliente: "mayorista",
  vendedor_asignado_id: current_user_id
}
    ↓
Backend validates and creates customer
    ↓
Frontend refreshes customer list
```

---

## State Transitions

### Sale Status State Machine

```
[New Sale Request]
        ↓
    [Validating]
     /        \
[Valid]    [Invalid]
    ↓           ↓
[Creating]  [Rejected]
    ↓
[Completada] ← (Wholesale sales always complete immediately)
    ↓
[Optional: Anulada] ← (If admin cancels sale)
```

For wholesale sales:
- No "pendiente" state (unlike retail credit sales)
- Goes directly from validation to "completada"
- Can only be "anulada" by administrator

---

## Data Integrity Constraints

### Database-Level Constraints (Backend Responsibility)

1. **Foreign Key Constraints**:
   - `customer.vendedor_asignado_id` → `user.id` (ON DELETE RESTRICT)
   - `sale.cliente_id` → `customer.id` (ON DELETE RESTRICT)
   - `sale.vendedor_id` → `user.id` (ON DELETE RESTRICT)
   - `sale_item.venta_id` → `sale.id` (ON DELETE CASCADE)
   - `sale_item.articulo_id` → `product.id` (ON DELETE RESTRICT)

2. **Check Constraints**:
   - `user.role IN ('administrador', 'vendedor_minorista', 'vendedor_mayorista')`
   - `customer.tipo_cliente IN ('minorista', 'mayorista')`
   - `sale.tipo_venta IN ('minorista_contado', 'minorista_credito', 'mayorista')`
   - `product.precio > 0`
   - `product.precio_mayorista > 0`
   - `product.stock_disponible >= 0`
   - `sale.monto_total > 0`
   - `sale_item.cantidad > 0`

3. **Unique Constraints**:
   - `user.username` (UNIQUE)
   - `user.email` (UNIQUE)
   - `customer.dni_cuit` (UNIQUE, NULL allowed)

4. **Triggers** (if supported):
   - After INSERT on `sale_item`: Decrement `product.stock_disponible`
   - After DELETE on `sale_item` (if sale anulada): Increment `product.stock_disponible`

---

## Migration Considerations

### Extending Existing Tables

**Users Table**:
```sql
-- Add role column (if not exists)
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'vendedor_minorista';
ALTER TABLE users ADD CONSTRAINT check_user_role
  CHECK (role IN ('administrador', 'vendedor_minorista', 'vendedor_mayorista'));
```

**Customers Table**:
```sql
-- Add customer type and seller assignment
ALTER TABLE customers ADD COLUMN tipo_cliente VARCHAR(20) DEFAULT 'minorista';
ALTER TABLE customers ADD COLUMN vendedor_asignado_id INTEGER;
ALTER TABLE customers ADD CONSTRAINT fk_vendedor_asignado
  FOREIGN KEY (vendedor_asignado_id) REFERENCES users(id);
ALTER TABLE customers ADD CONSTRAINT check_tipo_cliente
  CHECK (tipo_cliente IN ('minorista', 'mayorista'));
```

**Products Table**:
```sql
-- Add wholesale price
ALTER TABLE products ADD COLUMN precio_mayorista DECIMAL(10,2);
```

**Sales Table**:
```sql
-- Add sale type
ALTER TABLE sales ADD COLUMN tipo_venta VARCHAR(30) DEFAULT 'minorista_contado';
ALTER TABLE sales ADD CONSTRAINT check_tipo_venta
  CHECK (tipo_venta IN ('minorista_contado', 'minorista_credito', 'mayorista'));
```

### Data Backfill

For existing records:
1. **Users**: Leave existing users as `vendedor_minorista` (default)
2. **Customers**: Backfill `tipo_cliente = 'minorista'` and assign to first available retail seller
3. **Products**: `precio_mayorista` can be NULL initially (admins fill in later)
4. **Sales**: Backfill `tipo_venta = 'minorista_contado'` or `'minorista_credito'` based on payment structure

---

## Performance Considerations

### Indexing Recommendations

```sql
-- Customer queries by type and seller
CREATE INDEX idx_customers_tipo_vendedor
  ON customers(tipo_cliente, vendedor_asignado_id);

-- Sale queries by type and date
CREATE INDEX idx_sales_tipo_fecha
  ON sales(tipo_venta, fecha_venta DESC);

-- Product queries with wholesale pricing
CREATE INDEX idx_products_precio_mayorista
  ON products(precio_mayorista) WHERE precio_mayorista IS NOT NULL;

-- User role lookups
CREATE INDEX idx_users_role
  ON users(role);
```

---

## Next Steps

✅ Data model complete
→ Proceed to API contracts design
