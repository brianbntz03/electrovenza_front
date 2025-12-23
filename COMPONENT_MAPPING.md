# Mapeo de Componentes - Funcionalidades vs Archivos Existentes

## Gestión de Clientes

### Archivos Existentes
- **Crear Cliente**: `src/Components/Crear/CrearClientes.js`
- **Listar Clientes**: `src/Components/tablasListado/listadoClientes.js`
- **Editar Cliente**: `src/Components/modals/EditarClienteModal.js`
- **Filtrar Clientes**: `src/Components/Crear/CrearClientesFiltrado.js`
- **Clientes por Vendedor**: `src/Components/Clientes-Filtrado-vendedor.js`

### Nuevos Componentes Requeridos
- **Upload de Imágenes**: `src/Components/upload/ImageUpload.js`
- **Galería de Imágenes**: `src/Components/upload/ImageGallery.js`

## Ventas de Electrodomésticos

### Archivos Existentes
- **Artículos/Productos**: `src/Components/articulos.js`
- **Listado Productos**: `src/Components/tablasListado/ListadoProducto.js`
- **Crear Producto**: `src/Components/Crear/CrearProducto.js`
- **Presupuesto**: `src/Components/articulo-presupuesto.js`
- **Presupuesto Contado**: `src/Components/articulo-presupuesto-Contado.js`
- **Listado Ventas**: `src/Components/tablasListado/ListadoVentas.js`

### Páginas Existentes
- **Artículos**: `src/pages/Articulos.js`
- **Listado Artículos**: `src/pages/articulosListados.js`
- **Listado Productos**: `src/pages/productosLIstado.js`
- **Listado Ventas**: `src/pages/PageListadoVentas.js`

## Sistema de Créditos

### Archivos Existentes
- **Otorgar Crédito**: `src/Components/OtorgarCredito.js`
- **Crear Crédito**: `src/Components/Crear/CrearCreditos.js`
- **Crear Cuota Crédito**: `src/Components/Crear/CrearCuotaCredito.js`
- **Listado Créditos**: `src/Components/Lists/ListadoCreditos.js`
- **Editar Crédito**: `src/Components/modals/ModalEditarCreditos.js`
- **Editar Cuota Crédito**: `src/Components/modals/EditarCuotaCredito.js`

### Gestión de Cobranzas
- **Créditos Pendientes**: `src/Components/CreditoCuotasPendientes.js`
- **Cuotas Vencidas**: `src/Components/CreditosVencidas.js`
- **Cuota Vencida**: `src/Components/CreditoCuotaVencida.js`
- **Crédito a Pagar**: `src/Components/creditoApagar.js`

### Páginas de Créditos
- **Página Créditos**: `src/pages/PageCreditos.js`
- **Otorgar Crédito**: `src/pages/PageOtorgarCredito.js`
- **Cuotas Pendientes**: `src/pages/PageCreditoCuotasPendientes.js`
- **Créditos por Cobrar**: `src/pages/PageCreditoPorCobrar.js`

## Vendedores y Configuración

### Archivos Existentes
- **Crear Vendedor**: `src/Components/Crear/CrearVendedor.js`
- **Listado Vendedores**: `src/Components/tablasListado/listadoVendedores.js`
- **Editar Vendedor**: `src/Components/modals/EditarVendedorModal.js`
- **Página Vendedores**: `src/pages/PageListadoVendedores.js`

## Configuración de Precios y Cuotas

### Bandas de Precios
- **Crear Banda**: `src/Components/Crear/CrearBandasPrecios.js`
- **Listado Bandas**: `src/Components/Lists/ListadoBandasPrecios.js`
- **Editar Banda**: `src/Components/modals/EditarBandaPreciosModal.js`
- **Página Bandas**: `src/pages/PageBandasPrecios.js`

### Configuración de Cuotas
- **Crear Cuota**: `src/Components/Crear/CrearCuota.js`
- **Setting Cuotas Electro**: `src/Components/tablasListado/listadoSettingCuotas.js`
- **Setting Cuotas Crédito**: `src/Components/tablasListado/listadoSettingCuotasCredito.js`

## Reportes y Analytics

### Archivos Existentes
- **Reporte Cobranza**: `src/Components/Reportes/ReporteCobranza.js`
- **Reporte Ganancia**: `src/Components/Reportes/ReporteGanancia.js`
- **Página Reporte Cobranza**: `src/pages/pageReporteCobranza.js`
- **Página Reporte Ganancias**: `src/pages/pageReporteGanancias.js`

### Comisiones
- **Comisiones Crédito**: `src/Components/comisionesPorCreditoPendientes.js`
- **Comisiones Venta**: `src/Components/comisionesPorVentaPendientes.js`
- **Página Comisiones Crédito**: `src/pages/PageComisionesPorCreditoPendientes.js`
- **Página Comisiones Venta**: `src/pages/PageComisionesPorVentaPendientes.js`

## Layout y Navegación

### Archivos Existentes
- **Header**: `src/Components/Header.js`
- **Aside/Sidebar**: `src/Components/Aside.js`
- **Content**: `src/Components/Content.js`
- **Footer**: `src/Components/Footer.js`

## Utilidades y Servicios

### Archivos Existentes
- **API Service**: `src/service/apiRest.js`
- **Auxiliares**: `src/miscellaneus/aux.js`
- **Constantes Créditos**: `src/constants/creditos.js`
- **Tipos Cuota**: `src/constants/cuotaTypes.js`

### Framework Base
- **Crear**: `src/framework/Crear.js`
- **List**: `src/framework/List.js`
- **Modal**: `src/framework/Modal.js`
- **Page**: `src/framework/Page.js`

## Componentes Pequeños (Tiny)

### Archivos Existentes
- **Botón Anular Crédito**: `src/Components/tiny/BotonAnularCredito.js`
- **Botón Cuotas Pendientes**: `src/Components/tiny/BotonCuotasPendientes.js`
- **Botón Imprimir**: `src/Components/tiny/BotonImprimirCuotas.js`
- **Mensajes**: `src/Components/tiny/FlashMessage.js`
- **Confirmación**: `src/Components/tiny/ConfirmMessage.js`

## Impresión

### Archivos Existentes
- **Botón Imprimir**: `src/pages/print/BotonImprimir.js`
- **Imprimir Cuotas**: `src/pages/print/PageCuotasImprimir.js`
- **Imprimir Cuotas Crédito**: `src/pages/print/PageCuotasCreditoImprimir.js`
- **Estilos Impresión**: `src/pages/print/cuotas_imprimir.css`

## Presupuestos

### Archivos Existentes
- **Crear Presupuesto**: `src/Presupuestos/CrearPresupuesto.js`
- **Lista Presupuesto**: `src/Presupuestos/ListaPresupuesto.js`
- **Historial**: `src/Presupuestos/HistorialPresupuesto.js`

## Nuevos Componentes a Desarrollar

### Sistema de Imágenes
```
src/Components/upload/
├── ImageUpload.js          # Componente principal de upload
├── ImageGallery.js         # Galería de imágenes
├── ImagePreview.js         # Vista previa de imagen
└── ImageValidator.js       # Validador de archivos
```

### Dashboard por Rol
```
src/Components/dashboard/
├── DashboardMayorista.js   # Dashboard vendedor mayorista
├── DashboardMinorista.js   # Dashboard vendedor minorista
├── DashboardAdmin.js       # Dashboard administrador
└── widgets/                # Widgets reutilizables
    ├── MetricCard.js
    ├── ChartWidget.js
    └── AlertWidget.js
```

### Autenticación y Roles
```
src/Components/auth/
├── LoginForm.js            # Formulario de login (existe FormularioLogin.js)
├── RoleGuard.js            # Protección por roles
└── PermissionCheck.js      # Verificación de permisos
```

## Mapeo de Funcionalidades por Rol

### Vendedor Mayorista
- **Clientes**: CrearClientes.js, listadoClientes.js (filtrado por tipo)
- **Ventas**: articulo-presupuesto-Contado.js (solo contado)
- **Productos**: articulos.js (precios mayorista)

### Vendedor Minorista
- **Clientes**: CrearClientes.js, listadoClientes.js (filtrado por tipo)
- **Ventas**: articulo-presupuesto.js (contado y cuotas)
- **Créditos**: OtorgarCredito.js, CreditoCuotasPendientes.js
- **Productos**: articulos.js (precios minorista)

### Administrador
- **Acceso completo** a todos los componentes
- **Configuración**: CrearVendedor.js, CrearBandasPrecios.js
- **Reportes**: ReporteCobranza.js, ReporteGanancia.js