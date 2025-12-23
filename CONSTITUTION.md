# Constitución del Proyecto: PovenzaElectro Frontend

## 1. Propósito y Misión

### Misión
Desarrollar una aplicación web frontend robusta y escalable para la gestión integral de ventas de electrodomésticos y otorgamiento de créditos, diferenciando claramente entre operaciones mayoristas y minoristas.

### Objetivos Principales
- Facilitar la gestión de carteras de clientes segmentadas
- Optimizar procesos de venta según tipo de vendedor
- Integrar sistema de créditos para ventas minoristas
- Proporcionar herramientas de seguimiento y reportería

## 2. Principios Arquitectónicos

### Separación de Responsabilidades
- **Vendedores Mayoristas**: Exclusivamente ventas al contado a clientes B2B
- **Vendedores Minoristas**: Ventas al contado y a crédito a consumidores finales
- **Administradores**: Supervisión y configuración del sistema

### Segmentación Estricta
- Cada vendedor accede únicamente a su cartera asignada
- Precios diferenciados por tipo de vendedor
- Funcionalidades específicas según rol

### Integridad de Datos
- Validación exhaustiva en frontend y backend
- Audit trail de todas las operaciones críticas
- Gestión segura de documentos e imágenes

## 3. Stack Tecnológico

### Frontend Core
```javascript
{
  "framework": "React 18+",
  "stateManagement": "Context API + useReducer",
  "routing": "React Router v6",
  "uiFramework": "Bootstrap 5 + AdminLTE 3",
  "httpClient": "Axios",
  "authentication": "JWT + localStorage",
  "apiUrl": "process.env.REACT_APP_API_URL"
}
```

### Herramientas de Desarrollo
```javascript
{
  "bundler": "Vite",
  "linting": "ESLint + Prettier",
  "testing": "Jest + React Testing Library",
  "typeChecking": "PropTypes"
}
```

## 4. Estructura de Directorios

```
src/
├── Components/          # Componentes principales
│   ├── Crear/          # Formularios de creación
│   ├── Lists/          # Componentes de listado
│   ├── modals/         # Modales de edición
│   ├── Reportes/       # Componentes de reportes
│   ├── tablasListado/  # Tablas de datos
│   └── tiny/           # Componentes pequeños
├── pages/              # Páginas principales
│   └── print/          # Páginas de impresión
├── Presupuestos/       # Módulo de presupuestos
├── framework/          # Componentes base
├── service/            # Servicios API
├── constants/          # Constantes del sistema
├── miscellaneus/       # Utilidades y helpers
└── [archivos raíz]     # App.js, index.js, etc.
```

## 5. Reglas de Desarrollo

### Convenciones de Código
- **Componentes**: PascalCase (ej: `ClientForm.jsx`)
- **Hooks**: camelCase con prefijo 'use' (ej: `useClientData.js`)
- **Servicios**: camelCase (ej: `clientService.js`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `USER_ROLES.js`)

### Estándares de Componentes
```javascript
// Estructura estándar de componente
import React from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

### Gestión de Estado
- **Local**: useState para estado de componente
- **Compartido**: Context API para estado global
- **Formularios**: Controlled components con validación

## 6. Seguridad y Validaciones

### Autenticación
- JWT tokens con expiración
- Refresh token automático
- Logout automático por inactividad

### Autorización
- Rutas protegidas por rol
- Validación de permisos en cada operación
- Segregación de datos por vendedor

### Validaciones Frontend
```javascript
const validationRules = {
  client: {
    documento: /^[0-9]{7,8}$/,
    telefono: /^[0-9]{10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxCount: 4
  }
};
```

## 7. Sistema de Imágenes

### Especificaciones Técnicas
- **Formatos**: JPEG, PNG, PDF
- **Tamaño máximo**: 5MB por archivo
- **Cantidad máxima**: 4 imágenes por cliente
- **Funcionalidades**: Drag & Drop, preview, eliminación individual

### Componente de Upload
```javascript
const ImageUpload = {
  features: [
    'Drag and drop interface',
    'Multiple file selection',
    'Progress indicators',
    'Image preview thumbnails',
    'File validation',
    'Error handling',
    'Batch operations'
  ]
};
```

## 8. Roles y Permisos

### Matriz de Permisos
```javascript
const permissions = {
  ADMIN: {
    clients: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete'],
    credits: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    users: ['create', 'read', 'update', 'delete'],
    tipoMovimientoCC: ['create', 'read', 'update', 'delete']
  },
  VENDEDOR_MAYORISTA: {
    clients: ['create', 'read', 'update'], // Solo su cartera
    sales: ['create', 'read'], // Solo electrodomésticos al contado
    reports: ['read'] // Solo sus datos
  },
  VENDEDOR_MINORISTA: {
    clients: ['create', 'read', 'update'], // Solo su cartera
    sales: ['create', 'read'], // Electrodomésticos contado/cuotas
    credits: ['create', 'read', 'update'], // Gestión de créditos
    reports: ['read'] // Solo sus datos
  }
};
```

## 9. Performance y Optimización

### Estrategias de Optimización
- **Code Splitting**: Lazy loading por rutas
- **Image Optimization**: Compresión automática en upload
- **Data Fetching**: Paginación y filtros eficientes
- **Caching**: Cache de datos frecuentes en localStorage

### Métricas de Performance
- First Contentful Paint < 2s
- Time to Interactive < 3s
- Bundle size < 500KB (gzipped)

## 10. Testing Strategy

### Niveles de Testing
```javascript
const testingLevels = {
  unit: 'Jest + React Testing Library',
  integration: 'Testing Library + MSW',
  e2e: 'Cypress (futuro)',
  coverage: 'Mínimo 80%'
};
```

### Casos de Prueba Críticos
- Autenticación y autorización
- Upload y gestión de imágenes
- Flujos de venta por tipo de vendedor
- Validaciones de formularios
- Navegación entre roles

## 11. Deployment y CI/CD

### Ambientes
- **Development**: Local development server
- **Staging**: Testing environment
- **Production**: Live application

### Build Process
```javascript
const buildConfig = {
  development: {
    sourceMap: true,
    minification: false,
    bundleAnalyzer: true
  },
  production: {
    sourceMap: false,
    minification: true,
    optimization: true
  }
};
```

## 12. Mantenimiento y Evolución

### Versionado
- Semantic Versioning (SemVer)
- Changelog detallado
- Migration guides para breaking changes

### Documentación
- README actualizado
- Componentes documentados con Storybook
- API documentation
- User guides por rol

## 13. Consideraciones Futuras

### Escalabilidad
- Preparación para múltiples sucursales
- Integración con sistemas externos
- Módulos adicionales (inventario, contabilidad)

### Tecnologías Emergentes
- Evaluación periódica de nuevas herramientas
- Migración gradual cuando sea beneficioso
- Mantener compatibilidad hacia atrás

---

**Fecha de Creación**: $(date)
**Versión**: 1.0.0
**Próxima Revisión**: Trimestral