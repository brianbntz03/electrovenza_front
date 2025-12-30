# Quickstart Guide: Vendedor Mayorista Implementation

**Feature**: Vendedor Mayorista Role
**Date**: 2025-12-29
**Purpose**: Developer guide for implementing wholesale seller functionality

## Prerequisites

### Required Knowledge
- React 19.1.0 (functional components, hooks)
- React Router DOM 7.0.2 (routing, navigation)
- JWT authentication concepts
- REST API integration patterns
- Spanish language (codebase uses Spanish naming)

### Development Environment
- Node.js 16+ and npm 11+
- Code editor (VS Code recommended)
- Git for version control
- Access to backend API (development or staging)

### Backend Requirements
Before starting frontend development, ensure backend supports:
- [ ] User role `"vendedor_mayorista"` in database
- [ ] Product field `precio_mayorista` (decimal)
- [ ] Customer fields: `tipo_cliente`, `vendedor_asignado_id`
- [ ] Sale field: `tipo_venta` with value `"mayorista"`
- [ ] Endpoints: `/articulos`, `/clientes`, `/ventas-mayorista` (see contracts/)

---

## Project Setup

### 1. Clone and Install

```bash
# Already on branch 001-vendedor-mayorista
git status

# Install dependencies (if not already installed)
npm install

# Start development server
npm start
```

Server starts on http://localhost:3000

### 2. Verify Existing Functionality

Before making changes, verify the retail seller flow works:

1. Login as a retail seller (vendedor_minorista)
2. Navigate to "Buscar Artículos" menu
3. Verify product list loads
4. Verify customer management works
5. Complete a test sale (cash)

This confirms existing components are functioning correctly.

---

## Implementation Workflow

Follow this order to implement the feature systematically:

### Phase 1: Foundation (User Story 3 - P1)

**Goal**: Set up role constants, utilities, and menu infrastructure

#### Step 1.1: Create Role Constants

**File**: `src/constants/roles.js` (NEW)

```javascript
// Role constants for ElectroVenza system
export const ROLES = {
  ADMIN: 'administrador',
  RETAIL_SELLER: 'vendedor_minorista',
  WHOLESALE_SELLER: 'vendedor_mayorista'
};

export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const isWholesaleSeller = (userRole) => userRole === ROLES.WHOLESALE_SELLER;
export const isRetailSeller = (userRole) => userRole === ROLES.RETAIL_SELLER;
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;
```

**Test manually**: Import in any component and log `ROLES.WHOLESALE_SELLER` → should output `"vendedor_mayorista"`

#### Step 1.2: Create Route Guards

**File**: `src/utils/roleGuards.js` (NEW)

```javascript
import { Navigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

/**
 * Higher-order component to protect routes based on user role
 * Usage: <RequireRole allowedRoles={[ROLES.WHOLESALE_SELLER, ROLES.ADMIN]}><YourComponent /></RequireRole>
 */
export const RequireRole = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('user_role');

  if (!userRole) {
    // No role in localStorage - redirect to login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Role not authorized - redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Role authorized - render children
  return children;
};
```

**Test manually**: Wrap any route in Content.js with `<RequireRole allowedRoles={[ROLES.ADMIN]}>` and verify redirect when logged in as vendor.

#### Step 1.3: Add Wholesale Menu to Aside

**File**: `src/Components/Aside.js` (MODIFY)

Add after existing `renderVendedorMenu()` function:

```javascript
const renderVendedorMayoristaMenu = () => (
  <>
    <li className="nav-header"><i>VISTA VENDEDOR MAYORISTA</i></li>

    {/* Ventas Mayorista */}
    <li className="nav-item">
      <NavLink
        to="/venta-mayorista"
        className={({ isActive }) => `nav-link ${isActive ? "active-custom-style" : ""}`}
        onClick={closeMobileSidebar}
      >
        <i className="nav-icon fas fa-shopping-cart" />
        <p>VENTAS MAYORISTA</p>
      </NavLink>
    </li>

    {/* Clientes Mayorista */}
    <li className="nav-item">
      <NavLink
        to="/clientes-mayorista"
        className={({ isActive }) => `nav-link ${isActive ? "active-custom-style" : ""}`}
        onClick={closeMobileSidebar}
      >
        <i className="nav-icon fas fa-users" />
        <p>CLIENTES</p>
      </NavLink>
    </li>

    {/* Cuenta Corriente (Placeholder) */}
    <li className="nav-item">
      <NavLink
        to="/cuenta-corriente-mayorista"
        className={({ isActive }) => `nav-link ${isActive ? "active-custom-style" : ""}`}
        onClick={closeMobileSidebar}
      >
        <i className="nav-icon fas fa-file-invoice-dollar" />
        <p>CUENTA CORRIENTE</p>
      </NavLink>
    </li>
  </>
);
```

In the main render function, add condition:

```javascript
return (
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    {/* ... header ... */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column">
        {userRole === "administrador" && renderAdminMenu()}
        {userRole === "vendedor_minorista" && renderVendedorMenu()}
        {userRole === "vendedor_mayorista" && renderVendedorMayoristaMenu()}
      </ul>
    </nav>
  </aside>
);
```

**Test manually**:
1. Set `localStorage.setItem('user_role', 'vendedor_mayorista')` in browser console
2. Refresh page
3. Verify wholesale menu appears with 3 items

#### Step 1.4: Add Placeholder Pages

**File**: `src/pages/CuentaCorrienteMayorista.js` (NEW)

```javascript
import React from 'react';

export default function CuentaCorrienteMayorista() {
  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>Cuenta Corriente</h1>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-body">
            <p className="text-center text-muted" style={{fontSize: '1.2em', padding: '3em'}}>
              <i className="fas fa-clock fa-3x mb-3"></i>
              <br />
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**File**: `src/pages/UnauthorizedPage.js` (NEW)

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>Acceso Denegado</h1>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-body text-center" style={{padding: '3em'}}>
            <i className="fas fa-lock fa-3x text-danger mb-3"></i>
            <h3>No tiene permiso para acceder a esta página</h3>
            <p className="text-muted">
              Esta función está restringida a ciertos roles de usuario.
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

#### Step 1.5: Add Routes to Content.js

**File**: `src/Components/Content.js` (MODIFY)

Import at top:

```javascript
import { RequireRole } from '../utils/roleGuards';
import { ROLES } from '../constants/roles';
import CuentaCorrienteMayorista from '../pages/CuentaCorrienteMayorista';
import UnauthorizedPage from '../pages/UnauthorizedPage';
// VentaMayorista and ClientesMayorista pages will be added in later phases
```

Add routes inside `<Routes>`:

```javascript
{/* Wholesale Seller Routes */}
<Route
  path="/cuenta-corriente-mayorista"
  element={
    <RequireRole allowedRoles={[ROLES.WHOLESALE_SELLER, ROLES.ADMIN]}>
      <CuentaCorrienteMayorista />
    </RequireRole>
  }
/>

{/* Unauthorized Page */}
<Route path="/unauthorized" element={<UnauthorizedPage />} />
```

**Test**: Login as wholesale seller → Navigate to /cuenta-corriente-mayorista → See placeholder message

---

### Phase 2: Wholesale Sales (User Story 1 - P1)

**Goal**: Implement wholesale sales interface with product selection and transaction completion

#### Step 2.1: Create Product Selector Component

**File**: `src/pages/VentaMayorista/components/ProductSelector.js` (NEW)

```javascript
import React, { useState, useEffect } from 'react';

export default function ProductSelector({ onAddProduct }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/articulos?precio_mayorista_required=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProductos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Seleccionar Productos</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Precio Mayorista</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.stock_disponible}</td>
                    <td>${producto.precio_mayorista?.toLocaleString('es-AR')}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onAddProduct(producto)}
                        disabled={producto.stock_disponible === 0}
                      >
                        <i className="fas fa-plus"></i> Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Note**: Adjust API base URL as needed (might be `${API_BASE_URL}/articulos`)

#### Step 2.2: Create Sales Summary Component

**File**: `src/pages/VentaMayorista/components/SalesSummary.js` (NEW)

```javascript
import React from 'react';

export default function SalesSummary({ items, onRemoveItem, onUpdateQuantity }) {
  const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_mayorista), 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Resumen de Venta</h3>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <p className="text-muted">No hay productos seleccionados</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{width: '80px'}}
                        min="1"
                        max={item.stock_disponible}
                        value={item.cantidad}
                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${item.precio_mayorista.toLocaleString('es-AR')}</td>
                    <td>${(item.cantidad * item.precio_mayorista).toLocaleString('es-AR')}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-right">TOTAL:</th>
                  <th>${total.toLocaleString('es-AR')}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
```

#### Step 2.3: Create Main Sales Page

**File**: `src/pages/VentaMayorista/VentaMayorista.js` (NEW)

See full implementation in tasks.md (too long for quickstart).

Key points:
- Manages state for selected customer, cart items, payment method
- Fetches wholesale customers on mount
- Handles adding/removing products from cart
- Submits sale to `POST /ventas-mayorista`
- Shows success/error messages with SweetAlert2

#### Step 2.4: Add Route

**File**: `src/Components/Content.js` (MODIFY)

```javascript
import VentaMayorista from '../pages/VentaMayorista/VentaMayorista';

// In <Routes>:
<Route
  path="/venta-mayorista"
  element={
    <RequireRole allowedRoles={[ROLES.WHOLESALE_SELLER, ROLES.ADMIN]}>
      <VentaMayorista />
    </RequireRole>
  }
/>
```

**Test**:
1. Login as wholesale seller
2. Navigate to "Ventas Mayorista"
3. Select customer
4. Add products
5. Complete sale

---

### Phase 3: Customer Management (User Story 2 - P2)

**Goal**: Implement wholesale customer portfolio management

#### Step 3.1: Create Customer List Page

**File**: `src/pages/ClientesMayorista/ClientesMayorista.js` (NEW)

Reuse existing customer management components from `src/Components/tablasListado/listadoClientes.js` with modifications:
- Fetch with `?tipo=mayorista&vendedor_id={currentUserId}`
- Auto-set `tipo_cliente="mayorista"` in create form
- Auto-set `vendedor_asignado_id={currentUserId}` in create form
- Disable editing of `tipo_cliente` and `vendedor_asignado_id` fields

#### Step 3.2: Add Route

```javascript
import ClientesMayorista from '../pages/ClientesMayorista/ClientesMayorista';

<Route
  path="/clientes-mayorista"
  element={
    <RequireRole allowedRoles={[ROLES.WHOLESALE_SELLER, ROLES.ADMIN]}>
      <ClientesMayorista />
    </RequireRole>
  }
/>
```

---

## Testing Guide

### Manual Testing Checklist

**Role-Based Access**:
- [ ] Login as wholesale seller shows correct menu (3 items)
- [ ] Login as retail seller does NOT show wholesale menu
- [ ] Wholesale seller cannot access `/buscar-articulos-presupuesto`
- [ ] Retail seller cannot access `/venta-mayorista`
- [ ] Admin can access all routes

**Wholesale Sales**:
- [ ] Product list shows only products with `precio_mayorista`
- [ ] Prices displayed are wholesale prices, not retail
- [ ] Cannot select retail customers in customer dropdown
- [ ] Cannot access credit/installment options (UI hidden)
- [ ] Stock validation prevents overselling
- [ ] Sale completes successfully and appears in sales list
- [ ] Stock decrements after sale

**Customer Management**:
- [ ] Customer list shows only own wholesale customers
- [ ] Creating customer auto-sets tipo_cliente="mayorista"
- [ ] Cannot see or edit customers from other sellers
- [ ] Customer appears in sales customer dropdown after creation

### Integration Tests

Run integration tests:

```bash
npm test -- --testPathPattern=integration
```

Expected tests (to be written):
- `wholesaleSalesFlow.test.js`: Full sale flow
- `roleBasedAccess.test.js`: Menu and route access
- `customerPortfolioIsolation.test.js`: Customer filtering

---

## Troubleshooting

### Common Issues

**Issue**: "Token inválido" error when fetching data
- **Solution**: Check that `auth_token` is in localStorage and not expired
- **Fix**: Re-login to get fresh token

**Issue**: Products show retail prices instead of wholesale
- **Solution**: Verify you're reading `producto.precio_mayorista` not `producto.precio`
- **Fix**: Check ProductSelector component uses correct field

**Issue**: Can see customers from other sellers
- **Solution**: Backend not filtering by vendedor_id
- **Fix**: Check API request includes `?vendedor_id={userId}` parameter

**Issue**: Menu doesn't show for wholesale seller
- **Solution**: Check localStorage has `user_role="vendedor_mayorista"`
- **Fix**: Verify JWT decoding sets role correctly after login

**Issue**: Routes redirect to unauthorized even with correct role
- **Solution**: Check role string matches exactly (no typos)
- **Fix**: Use `ROLES.WHOLESALE_SELLER` constant, not hard-coded string

---

## Code Style Guidelines

### Naming Conventions

- **Spanish for domain concepts**: `venta`, `cliente`, `mayorista`, `vendedor`
- **English for technical terms**: `useState`, `useEffect`, `props`, `component`
- **Components**: PascalCase (`VentaMayorista`, `ProductSelector`)
- **Functions**: camelCase (`fetchProductos`, `onAddProduct`)
- **Constants**: UPPER_SNAKE_CASE (`ROLES`, `API_BASE_URL`)

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Component definition
export default function MyComponent({ prop1, prop2 }) {
  // 3. State declarations
  const [state1, setState1] = useState(initialValue);
  const navigate = useNavigate();

  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 5. Event handlers
  const handleClick = () => {
    // handler logic
  };

  // 6. Render helpers (if needed)
  const renderSection = () => {
    return <div>...</div>;
  };

  // 7. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Comments

```javascript
// Spanish for business logic comments
// Validar que el cliente sea mayorista antes de continuar

// English for technical comments
// TODO: Refactor this to use custom hook
```

---

## Performance Optimization

### Lazy Loading

For better initial load time:

```javascript
// In Content.js
const VentaMayorista = React.lazy(() => import('../pages/VentaMayorista/VentaMayorista'));

// Wrap with Suspense
<Suspense fallback={<div>Cargando...</div>}>
  <Route path="/venta-mayorista" element={<VentaMayorista />} />
</Suspense>
```

### Memoization

For product lists that re-render frequently:

```javascript
import React, { memo } from 'react';

const ProductRow = memo(({ producto, onAdd }) => {
  return <tr>...</tr>;
});
```

---

## Next Steps

After completing implementation:

1. ✅ Complete all manual testing checklist items
2. ✅ Write integration tests
3. ✅ Get code review from team
4. ✅ Test with real backend (not mocks)
5. ✅ Update this guide with any discovered issues
6. ✅ Create pull request following PR template
7. ✅ Deploy to staging for QA testing

---

## Resources

- **Feature Spec**: [spec.md](spec.md)
- **Data Model**: [data-model.md](data-model.md)
- **API Contracts**: [contracts/](contracts/)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **React Docs**: https://react.dev/
- **React Router**: https://reactrouter.com/en/main

---

## Getting Help

- **Questions about requirements**: Review [spec.md](spec.md)
- **Questions about data**: Review [data-model.md](data-model.md)
- **Questions about API**: Review contracts in [contracts/](contracts/)
- **Questions about constitution**: Review [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Technical issues**: Ask team in Slack #dev channel
