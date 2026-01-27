# electrovenza_front Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-29

## Active Technologies
- JavaScript ES6+ (React 19.1.0) + React 19.1.0, React Router DOM 7.0.2, native fetch API (003-redirect-login-401)
- localStorage (browser) for auth state; no backend storage changes (003-redirect-login-401)

- JavaScript ES6+ (React 19.1.0) + React 19.1.0, React Router DOM 7.0.2, jwt-decode 4.0.0, SweetAlert2 11.6.13, FontAwesome 7.0.1, date-fns 4.1.0 (001-vendedor-mayorista)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript ES6+ (React 19.1.0): Follow standard conventions

## Recent Changes
- 003-redirect-login-401: Added JavaScript ES6+ (React 19.1.0) + React 19.1.0, React Router DOM 7.0.2, native fetch API
- 002-gestion-tipo-vendedor: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

- 001-vendedor-mayorista: Implemented wholesale seller role with role-based menu system, wholesale cash sales functionality, and customer portfolio management

## Feature: Vendedor Mayorista (Wholesale Seller Role)

### Overview
Implemented a new user role for wholesale sellers with dedicated functionality for managing wholesale sales and customers.

### Key Components

**Role Management:**
- `src/constants/roles.js` - Role constants (ADMIN, RETAIL_SELLER, WHOLESALE_SELLER)
- `src/utils/roleGuards.js` - Route protection based on user roles

**Wholesale Sales:**
- `src/pages/VentaMayorista/VentaMayorista.js` - Main wholesale sales page
- `src/pages/VentaMayorista/components/ProductSelector.js` - Product selection with wholesale pricing
- `src/pages/VentaMayorista/components/CustomerSelector.js` - Customer selection dropdown
- `src/pages/VentaMayorista/components/SalesSummary.js` - Sales cart and summary

**Customer Management:**
- `src/pages/ClientesMayorista/ClientesMayorista.js` - Wholesale customer management page

**Services:**
- `src/service/ventasService.js` - Wholesale sales API integration
- `src/service/clientesService.js` - Customer management API integration
- `src/service/articulosService.js` - Product fetching with wholesale pricing

**Routes:**
- `/venta-mayorista` - Wholesale sales (protected: WHOLESALE_SELLER, ADMIN)
- `/clientes-mayorista` - Customer management (protected: WHOLESALE_SELLER, ADMIN)
- `/cuenta-corriente-mayorista` - Account statement placeholder (protected: WHOLESALE_SELLER, ADMIN)
- `/unauthorized` - Unauthorized access page

### User Roles
- **administrador** - Full system access
- **vendedor_minorista** - Retail seller (existing)
- **vendedor_mayorista** - Wholesale seller (new)

### Testing localStorage for Wholesale Seller
To test the wholesale seller functionality in development:
```javascript
localStorage.setItem('user_role', 'vendedor_mayorista');
localStorage.setItem('user_id', '1'); // Your test user ID
```

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
