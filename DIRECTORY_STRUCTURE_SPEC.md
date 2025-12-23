# Especificación de Estructura de Directorios - PovenzaElectro

## Estructura Actual del Proyecto

```
src/
├── Components/              # Componentes principales de la aplicación
│   ├── Crear/              # Formularios de creación de entidades
│   │   ├── CrearBandasPrecios.js
│   │   ├── CrearCategorias.js
│   │   ├── CrearClientes.js
│   │   ├── CrearClientesFiltrado.js
│   │   ├── CrearCompras.js
│   │   ├── CrearCreditos.js
│   │   ├── CrearCuota.js
│   │   ├── CrearCuotaCredito.js
│   │   ├── CrearProducto.js
│   │   ├── CrearProveedor.js
│   │   └── CrearVendedor.js
│   │
│   ├── Lists/              # Componentes de listado
│   │   ├── ListadoBandasPrecios.js
│   │   ├── ListadoCompras.js
│   │   └── ListadoCreditos.js
│   │
│   ├── modals/             # Modales de edición
│   │   ├── EditarBandaPreciosModal.js
│   │   ├── EditarCategoriaModal.js
│   │   ├── EditarClienteModal.js
│   │   ├── EditarCuotaCredito.js
│   │   ├── EditarCuotaElectro.js
│   │   ├── EditarProductoMoral.js
│   │   ├── EditarVendedorModal.js
│   │   ├── ModalEditarBandasPrecios.js
│   │   ├── ModalEditarCompras.js
│   │   └── ModalEditarCreditos.js
│   │
│   ├── Reportes/           # Componentes de reportes
│   │   ├── ReporteCobranza.js
│   │   └── ReporteGanancia.js
│   │
│   ├── tablasListado/      # Tablas de datos
│   │   ├── listado_categoria.js
│   │   ├── ListadoArticuloVendedor.js
│   │   ├── listadoClientes.js
│   │   ├── ListadoProducto.js
│   │   ├── listadoSettingBandaPrecios.js
│   │   ├── listadoSettingCuotas.js
│   │   ├── listadoSettingCuotasCredito.js
│   │   ├── listadoVendedores.js
│   │   └── ListadoVentas.js
│   │
│   ├── tiny/               # Componentes pequeños y reutilizables
│   │   ├── BotonAnularCredito.js
│   │   ├── BotonCreditosCuotasPendientes.js
│   │   ├── BotonCuotasPendientes.js
│   │   ├── BotonImprimirCuotas.js
│   │   ├── BotonImprimirCuotasCredito.js
│   │   ├── ConfirmMessage.js
│   │   └── FlashMessage.js
│   │
│   └── [Componentes raíz]  # Componentes principales
│       ├── ActualizacionMasiva.js
│       ├── articulo-presupuesto-Contado.js
│       ├── articulo-presupuesto.js
│       ├── articulos.js
│       ├── Aside.js
│       ├── ButtonSearch.js
│       ├── Clientes-Filtrado-vendedor.js
│       ├── comisionesPorCreditoPendientes.js
│       ├── comisionesPorVentaPendientes.js
│       ├── Content.js
│       ├── creditoApagar.js
│       ├── CreditoCuotasPendientes.js
│       ├── CreditoCuotaVencida.js
│       ├── CreditosCuotasVencidas.js
│       ├── CreditosVencidas.js
│       ├── CuotaAPagar.js
│       ├── cuotasVencidas.js
│       ├── CuotasVencidas.js
│       ├── cuotasVencidasAll.js
│       ├── CuotaVencida.js
│       ├── Footer.js
│       ├── Header.js
│       ├── listadoClienteFiltradoVendedor.js
│       ├── Listadoproveedores.js
│       ├── listadoSettingCuotasCredito.js
│       ├── ListadoVentas.js
│       ├── OtorgarCredito.js
│       ├── RegistrarMovimiento.js
│       ├── TablaPago_FechaxModalidad.js
│       ├── Tablas-Ventas-Fechas.js
│       ├── todas-las-categorias.js
│       └── VentaCuotasPendientes.js
│
├── constants/              # Constantes del sistema
│   ├── creditos.js
│   └── cuotaTypes.js
│
├── framework/              # Componentes base y framework
│   ├── Crear.js
│   ├── List.js
│   ├── Modal.js
│   └── Page.js
│
├── miscellaneus/           # Utilidades y helpers
│   └── aux.js
│
├── pages/                  # Páginas principales
│   ├── print/             # Páginas de impresión
│   │   ├── BotonImprimir.js
│   │   ├── cuotas_imprimir.css
│   │   ├── PageCuotasCreditoImprimir.js
│   │   └── PageCuotasImprimir.js
│   │
│   └── [Páginas]          # Páginas de la aplicación
│       ├── Articulos.js
│       ├── articulosListados.js
│       ├── categorias.js
│       ├── categoriasListado.js
│       ├── Clientes.js
│       ├── creacionCategorias.js
│       ├── Index.js
│       ├── PageActualizacionMasiva.js
│       ├── PageBandasPrecios.js
│       ├── PageComisionesPorCreditoPendientes.js
│       ├── PageComisionesPorVentaPendientes.js
│       ├── PageCompras.js
│       ├── PageCreditoCuotasPendientePorCredito.js
│       ├── PageCreditoCuotasPendientes.js
│       ├── PageCreditoPorCobrar.js
│       ├── PageCreditos.js
│       ├── PageCreditosCuotasPorCobrar.js
│       ├── PageCuotasPorCobrar.js
│       ├── PageCuotasPorCobrarElectro.js
│       ├── pageCuotasVencidas.js
│       ├── PageListadoVendedores.js
│       ├── PageListadoVentas.js
│       ├── PageOtorgarCredito.js
│       ├── pageReporteCobranza.js
│       ├── pageReporteGanancias.js
│       ├── PageVentaCuotasPendientes.js
│       ├── productosLIstado.js
│       ├── Proveedores.js
│       ├── RegistroMovimientoCuenta.js
│       ├── SettingCuotasCreditoListado.js
│       └── SettingCuotasElectroListado.js
│
├── Presupuestos/           # Módulo de presupuestos
│   ├── CrearPresupuesto.js
│   ├── HistorialPresupuesto.js
│   ├── ListaPresupuesto.js
│   ├── presupuestossss.js
│   └── presupuestossssAlContado.js
│
├── service/                # Servicios y API
│   └── apiRest.js
│
└── [Archivos raíz]        # Archivos principales
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── FormularioLogin.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── mobile-sidebar.css
    ├── reportWebVitals.js
    └── setupTests.js
```

## Nuevos Directorios a Crear

### Sistema de Imágenes
```
src/Components/upload/
├── ImageUpload.js          # Componente principal de upload con drag & drop
├── ImageGallery.js         # Galería de imágenes del cliente
├── ImagePreview.js         # Vista previa de imagen individual
├── ImageValidator.js       # Validador de archivos (tipo, tamaño)
└── ImageManager.js         # Gestor de operaciones de imágenes
```

### Dashboard por Rol
```
src/Components/dashboard/
├── DashboardMayorista.js   # Dashboard específico para vendedor mayorista
├── DashboardMinorista.js   # Dashboard específico para vendedor minorista
├── DashboardAdmin.js       # Dashboard para administrador
└── widgets/                # Widgets reutilizables
    ├── MetricCard.js       # Tarjeta de métrica
    ├── ChartWidget.js      # Widget de gráficos
    ├── AlertWidget.js      # Widget de alertas
    └── QuickActions.js     # Acciones rápidas
```

### Autenticación y Permisos
```
src/Components/auth/
├── RoleGuard.js            # HOC para protección por roles
├── PermissionCheck.js      # Componente de verificación de permisos
└── PrivateRoute.js         # Ruta protegida
```

### Utilidades Adicionales
```
src/miscellaneus/
├── aux.js                  # (Existente) Funciones auxiliares
├── validation.js           # Reglas de validación
├── permissions.js          # Lógica de permisos
├── formatters.js           # Formateadores (moneda, fecha, etc.)
└── constants.js            # Constantes generales
```

### Hooks Personalizados
```
src/hooks/
├── useAuth.js              # Hook de autenticación
├── usePermissions.js       # Hook de permisos
├── useImageUpload.js       # Hook para upload de imágenes
├── useClientData.js        # Hook para datos de cliente
└── useSalesFlow.js         # Hook para flujo de ventas
```

### Contextos
```
src/context/
├── AuthContext.js          # Contexto de autenticación
├── UserContext.js          # Contexto de usuario
├── ClientContext.js        # Contexto de clientes
└── CacheContext.js         # Contexto de caché
```

## Convenciones de Nomenclatura

### Componentes
- **PascalCase**: `CrearClientes.js`, `ListadoVentas.js`
- **Descriptivos**: Nombre que indique claramente su función
- **Prefijos comunes**:
  - `Crear*`: Formularios de creación
  - `Listado*`: Componentes de listado
  - `Editar*`: Modales/formularios de edición
  - `Page*`: Páginas completas
  - `Boton*`: Componentes de botón

### Archivos de Utilidades
- **camelCase**: `apiRest.js`, `aux.js`
- **Descriptivos**: `validation.js`, `permissions.js`

### Constantes
- **camelCase para archivos**: `creditos.js`, `cuotaTypes.js`
- **UPPER_SNAKE_CASE para constantes**: `USER_ROLES`, `PAYMENT_TYPES`

## Organización por Funcionalidad

### Gestión de Clientes
```
Components/
├── Crear/CrearClientes.js
├── tablasListado/listadoClientes.js
├── modals/EditarClienteModal.js
├── upload/                         # NUEVO
│   ├── ImageUpload.js
│   └── ImageGallery.js
└── Clientes-Filtrado-vendedor.js
```

### Ventas
```
Components/
├── articulos.js
├── articulo-presupuesto.js
├── articulo-presupuesto-Contado.js
├── tablasListado/ListadoVentas.js
└── Crear/CrearProducto.js

Presupuestos/
├── CrearPresupuesto.js
├── ListaPresupuesto.js
└── HistorialPresupuesto.js
```

### Créditos
```
Components/
├── OtorgarCredito.js
├── Crear/CrearCreditos.js
├── Crear/CrearCuotaCredito.js
├── Lists/ListadoCreditos.js
├── CreditoCuotasPendientes.js
├── CreditosVencidas.js
└── modals/
    ├── ModalEditarCreditos.js
    └── EditarCuotaCredito.js
```

### Layout
```
Components/
├── Header.js
├── Aside.js
├── Content.js
└── Footer.js
```

## Rutas de Importación Recomendadas

### Componentes
```javascript
// Crear
import CrearClientes from '@/Components/Crear/CrearClientes';

// Listados
import ListadoClientes from '@/Components/tablasListado/listadoClientes';

// Modales
import EditarClienteModal from '@/Components/modals/EditarClienteModal';

// Páginas
import PageCreditos from '@/pages/PageCreditos';
```

### Servicios y Utilidades
```javascript
// API
import api from '@/service/apiRest';

// Utilidades
import { formatCurrency, formatDate } from '@/miscellaneus/formatters';

// Constantes
import { USER_ROLES } from '@/constants/roles';
```

### Hooks y Contextos
```javascript
// Hooks
import useAuth from '@/hooks/useAuth';

// Contextos
import { useAuthContext } from '@/context/AuthContext';
```

## Mejores Prácticas

### Organización de Archivos
1. **Un componente por archivo**
2. **Agrupar por funcionalidad** (Crear, Lists, modals)
3. **Separar lógica de presentación**
4. **Reutilizar componentes** del directorio `tiny/`

### Estructura de Componente
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Componente
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleAction = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

// 7. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

// 8. Export
export default ComponentName;
```

### Nombres de Archivos
- **Consistencia**: Mantener el estilo actual del proyecto
- **Descriptivos**: Nombres claros y específicos
- **Sin abreviaturas**: Preferir nombres completos
- **Extensión .js**: Mantener consistencia con archivos existentes

## Migración y Refactorización

### Prioridades
1. **Crear nuevos componentes** en directorios apropiados
2. **No modificar** estructura existente que funciona
3. **Agregar** nuevas funcionalidades en directorios nuevos
4. **Documentar** cambios significativos

### Componentes a Crear
- Sistema de upload de imágenes
- Dashboards por rol
- Guards de autenticación
- Hooks personalizados
- Contextos de estado global