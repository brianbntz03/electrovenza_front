# Especificaciones Técnicas Detalladas - PovenzaElectro Frontend

## 1. Gestión de Cartera de Clientes

### 1.1 Componente ClientForm

```javascript
// src/Components/Crear/CrearClientes.js
const ClientForm = {
  props: {
    clientType: 'mayorista' | 'minorista',
    initialData: Object,
    onSubmit: Function,
    isEditing: Boolean
  },
  
  fields: {
    datos_personales: {
      nombre: { type: 'text', required: true, maxLength: 50 },
      apellido: { type: 'text', required: true, maxLength: 50 },
      documento: { type: 'text', required: true, pattern: /^[0-9]{7,8}$/ },
      telefono: { type: 'tel', required: true, pattern: /^[0-9]{10}$/ },
      email: { type: 'email', required: false },
      direccion: { type: 'textarea', required: true, maxLength: 200 }
    },
    
    // Solo para mayoristas
    datos_comerciales: {
      razon_social: { type: 'text', required: true, maxLength: 100 },
      cuit: { type: 'text', required: true, pattern: /^[0-9]{11}$/ },
      condicion_iva: { type: 'select', options: ['RI', 'MT', 'EX'] }
    }
  },
  
  validation: {
    realTime: true,
    onBlur: true,
    onSubmit: true
  }
};
```

### 1.2 Sistema de Imágenes

#### Componente ImageUpload
```javascript
// src/Components/upload/ImageUpload.js
const ImageUploadSpec = {
  constraints: {
    maxFiles: 4,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf']
  },
  
  features: {
    dragDrop: true,
    multipleSelection: true,
    progressIndicator: true,
    preview: true,
    validation: true,
    errorHandling: true
  },
  
  states: {
    idle: 'Arrastra archivos aquí o haz clic para seleccionar',
    dragOver: 'Suelta los archivos aquí',
    uploading: 'Subiendo archivos...',
    success: 'Archivos subidos correctamente',
    error: 'Error al subir archivos'
  },
  
  api: {
    uploadEndpoint: `${process.env.REACT_APP_API_URL}/clients/{clientId}/images`,
    deleteEndpoint: `${process.env.REACT_APP_API_URL}/clients/{clientId}/images/{imageId}`,
    downloadEndpoint: `${process.env.REACT_APP_API_URL}/clients/{clientId}/images/{imageId}/download`
  }
};
```

#### Estructura de Datos de Imagen
```javascript
const ImageSchema = {
  id: 'number',
  cliente_id: 'number',
  nombre_archivo: 'string',
  nombre_original: 'string',
  url: 'string',
  tipo_mime: 'string',
  tamaño: 'number', // bytes
  fecha_upload: 'ISO string',
  uploaded_by: 'number' // vendedor_id
};
```

### 1.3 Lista de Clientes

```javascript
// src/Components/tablasListado/listadoClientes.js
const ClientListSpec = {
  features: {
    pagination: { pageSize: 20, serverSide: true },
    sorting: ['nombre', 'apellido', 'fecha_creacion'],
    filtering: {
      search: 'nombre, apellido, documento',
      tipo: 'mayorista | minorista',
      estado: 'activo | inactivo'
    }
  },
  
  columns: [
    { key: 'nombre_completo', sortable: true },
    { key: 'documento', sortable: true },
    { key: 'telefono', sortable: false },
    { key: 'ultima_compra', sortable: true },
    { key: 'total_compras', sortable: true },
    { key: 'acciones', sortable: false }
  ],
  
  actions: ['ver', 'editar', 'nueva_venta', 'historial']
};
```

## 2. Ventas de Electrodomésticos

### 2.1 Catálogo de Productos

```javascript
// src/Components/articulos.js
const ProductCatalogSpec = {
  props: {
    userRole: 'mayorista' | 'minorista',
    clientId: 'number'
  },
  
  features: {
    priceByRole: {
      mayorista: 'precio_mayorista',
      minorista: 'precio_minorista'
    },
    
    filters: {
      categoria: 'select',
      marca: 'select',
      precio_min: 'number',
      precio_max: 'number',
      disponibilidad: 'boolean'
    },
    
    search: {
      fields: ['nombre', 'modelo', 'marca'],
      minLength: 3
    },
    
    pagination: {
      pageSize: 12,
      layout: 'grid'
    }
  },
  
  productCard: {
    image: 'thumbnail',
    name: 'string',
    model: 'string',
    brand: 'string',
    price: 'formatted currency',
    stock: 'number',
    addToCart: 'button'
  }
};
```

### 2.2 Carrito de Compras

```javascript
// src/Components/articulo-presupuesto.js
const ShoppingCartSpec = {
  state: {
    items: [
      {
        producto_id: 'number',
        nombre: 'string',
        precio_unitario: 'number',
        cantidad: 'number',
        subtotal: 'number'
      }
    ],
    total: 'number',
    cliente_id: 'number',
    forma_pago: 'contado | cuotas'
  },
  
  actions: {
    addItem: '(producto, cantidad) => void',
    updateQuantity: '(itemId, cantidad) => void',
    removeItem: '(itemId) => void',
    clear: '() => void',
    checkout: '() => Promise'
  },
  
  validation: {
    minQuantity: 1,
    maxQuantity: 'stock disponible',
    clientRequired: true
  }
};
```

### 2.3 Proceso de Venta

#### Vendedor Mayorista
```javascript
const MayoristaSaleFlow = {
  steps: [
    {
      name: 'seleccionar_cliente',
      component: 'ClientSelector',
      filter: { tipo: 'mayorista' },
      required: true
    },
    {
      name: 'agregar_productos',
      component: 'ProductCatalog',
      priceType: 'mayorista',
      paymentOptions: ['contado']
    },
    {
      name: 'revisar_orden',
      component: 'OrderReview',
      showTotals: true,
      allowEdit: true
    },
    {
      name: 'confirmar_venta',
      component: 'SaleConfirmation',
      generateInvoice: true
    }
  ],
  
  restrictions: {
    clientType: 'mayorista',
    paymentMethod: 'contado',
    minAmount: 0
  }
};
```

#### Vendedor Minorista
```javascript
const MinoristaSaleFlow = {
  steps: [
    {
      name: 'seleccionar_cliente',
      component: 'ClientSelector',
      filter: { tipo: 'minorista' },
      required: true
    },
    {
      name: 'agregar_productos',
      component: 'ProductCatalog',
      priceType: 'minorista',
      paymentOptions: ['contado', 'cuotas']
    },
    {
      name: 'seleccionar_pago',
      component: 'PaymentSelector',
      conditional: true // Solo si hay productos
    },
    {
      name: 'configurar_cuotas',
      component: 'InstallmentConfig',
      conditional: 'forma_pago === cuotas'
    },
    {
      name: 'revisar_orden',
      component: 'OrderReview',
      showTotals: true,
      showInstallments: true
    },
    {
      name: 'confirmar_venta',
      component: 'SaleConfirmation',
      generateDocuments: true
    }
  ],
  
  restrictions: {
    clientType: 'minorista',
    paymentMethods: ['contado', 'cuotas']
  }
};
```

## 3. Sistema de Créditos (Solo Minoristas)

### 3.1 Evaluación de Crédito

```javascript
// src/Components/OtorgarCredito.js
const CreditEvaluationSpec = {
  inputs: {
    cliente_id: 'number',
    monto_solicitado: 'number',
    plazo_meses: 'number',
    ingresos_declarados: 'number'
  },
  
  evaluation: {
    historial_pagos: {
      weight: 0.4,
      factors: ['pagos_puntuales', 'pagos_tardios', 'defaults']
    },
    
    capacidad_pago: {
      weight: 0.3,
      calculation: 'ingresos * 0.3 >= cuota_mensual'
    },
    
    antiguedad_cliente: {
      weight: 0.2,
      minMonths: 3
    },
    
    monto_historico: {
      weight: 0.1,
      factor: 'promedio_compras_ultimos_6_meses'
    }
  },
  
  result: {
    approved: 'boolean',
    monto_aprobado: 'number',
    plazo_maximo: 'number',
    tasa_interes: 'number',
    observaciones: 'string'
  }
};
```

### 3.2 Configuración de Cuotas

```javascript
// src/Components/Crear/CrearCuotaCredito.js
const InstallmentConfigSpec = {
  inputs: {
    monto_capital: 'number',
    cantidad_cuotas: 'number',
    tasa_interes_mensual: 'number',
    fecha_primer_vencimiento: 'date'
  },
  
  calculation: {
    sistema: 'frances', // Cuota fija
    formula: 'PMT = PV * (r * (1 + r)^n) / ((1 + r)^n - 1)',
    
    cuota_mensual: 'calculated',
    total_intereses: 'calculated',
    total_a_pagar: 'calculated'
  },
  
  cronograma: [
    {
      numero_cuota: 'number',
      fecha_vencimiento: 'date',
      capital: 'number',
      interes: 'number',
      cuota: 'number',
      saldo: 'number'
    }
  ],
  
  validation: {
    minCuotas: 3,
    maxCuotas: 24,
    minMonto: 10000,
    maxMonto: 500000
  }
};
```

### 3.3 Gestión de Cobranzas

```javascript
// src/Components/CreditoCuotasPendientes.js
const CollectionManagementSpec = {
  dashboard: {
    metrics: {
      cartera_total: 'sum(saldo_pendiente)',
      vencidas_hoy: 'count(fecha_vencimiento = today)',
      proximas_vencer: 'count(fecha_vencimiento <= today + 7)',
      en_mora: 'count(dias_mora > 0)'
    },
    
    alerts: [
      { type: 'danger', condition: 'dias_mora > 30' },
      { type: 'warning', condition: 'dias_mora > 15' },
      { type: 'info', condition: 'vence_en_3_dias' }
    ]
  },
  
  filters: {
    estado: ['al_dia', 'vencida', 'en_mora'],
    dias_mora: 'range',
    monto_pendiente: 'range',
    cliente: 'search'
  },
  
  actions: {
    registrar_pago: 'modal',
    generar_recibo: 'pdf',
    enviar_recordatorio: 'email/sms',
    renegociar: 'modal'
  }
};
```

## 4. Interfaces de Usuario

### 4.1 Dashboard por Rol

#### Dashboard Mayorista
```javascript
const MayoristaDashboardSpec = {
  widgets: [
    {
      name: 'ventas_mes',
      type: 'metric',
      query: 'sum(ventas) WHERE mes_actual AND vendedor_id',
      format: 'currency'
    },
    {
      name: 'clientes_activos',
      type: 'metric',
      query: 'count(clientes) WHERE ultima_compra >= 30_dias',
      format: 'number'
    },
    {
      name: 'productos_vendidos',
      type: 'chart',
      chartType: 'bar',
      period: 'last_30_days'
    },
    {
      name: 'metas_objetivos',
      type: 'progress',
      target: 'meta_mensual',
      current: 'ventas_mes_actual'
    }
  ],
  
  quickActions: [
    'nueva_venta',
    'agregar_cliente',
    'ver_cartera',
    'reportes'
  ]
};
```

#### Dashboard Minorista
```javascript
const MinoristaDashboardSpec = {
  widgets: [
    {
      name: 'ventas_creditos',
      type: 'dual_metric',
      metrics: ['ventas_contado', 'creditos_otorgados'],
      format: 'currency'
    },
    {
      name: 'cobranzas_pendientes',
      type: 'metric',
      query: 'sum(saldo_pendiente) WHERE vendedor_id',
      format: 'currency',
      alert: 'vencimientos_hoy'
    },
    {
      name: 'alertas_vencimiento',
      type: 'list',
      query: 'cuotas WHERE fecha_vencimiento <= today + 7',
      limit: 5
    },
    {
      name: 'cartera_creditos',
      type: 'chart',
      chartType: 'donut',
      segments: ['al_dia', 'vencida', 'en_mora']
    }
  ],
  
  quickActions: [
    'nueva_venta',
    'otorgar_credito',
    'registrar_pago',
    'ver_cobranzas'
  ]
};
```

### 4.2 Navegación y Layout

```javascript
// src/Components/Content.js + Header.js + Aside.js
const MainLayoutSpec = {
  structure: {
    header: {
      logo: 'PovenzaElectro',
      userMenu: ['perfil', 'configuracion', 'logout'],
      notifications: 'bell icon with badge'
    },
    
    sidebar: {
      navigation: 'role-based menu',
      collapse: true,
      responsive: true
    },
    
    content: {
      breadcrumb: true,
      pageTitle: true,
      mainContent: 'router-outlet'
    },
    
    footer: {
      copyright: true,
      version: true
    }
  },
  
  responsive: {
    breakpoints: {
      mobile: '< 768px',
      tablet: '768px - 1024px',
      desktop: '> 1024px'
    },
    
    behavior: {
      mobile: 'sidebar overlay',
      tablet: 'sidebar collapsible',
      desktop: 'sidebar fixed'
    }
  }
};
```

## 5. Validaciones y Restricciones

### 5.1 Validaciones de Formularios

```javascript
// src/miscellaneus/validation.js
const ValidationRules = {
  client: {
    nombre: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    },
    
    documento: {
      required: true,
      pattern: /^[0-9]{7,8}$/,
      unique: true // Validación en backend
    },
    
    telefono: {
      required: true,
      pattern: /^[0-9]{10}$/
    },
    
    email: {
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  
  sale: {
    cliente_id: { required: true },
    items: { required: true, minLength: 1 },
    forma_pago: { required: true, enum: ['contado', 'cuotas'] }
  },
  
  credit: {
    monto: { required: true, min: 10000, max: 500000 },
    cuotas: { required: true, min: 3, max: 24 },
    cliente_id: { required: true }
  }
};
```

### 5.2 Restricciones por Rol

```javascript
// src/miscellaneus/permissions.js
const RoleRestrictions = {
  VENDEDOR_MAYORISTA: {
    clients: {
      create: { tipo: 'mayorista' },
      read: { vendedor_id: 'current_user' },
      update: { vendedor_id: 'current_user' }
    },
    
    sales: {
      create: { 
        client_type: 'mayorista',
        payment_method: 'contado'
      }
    },
    
    credits: { denied: true }
  },
  
  VENDEDOR_MINORISTA: {
    clients: {
      create: { tipo: 'minorista' },
      read: { vendedor_id: 'current_user' },
      update: { vendedor_id: 'current_user' }
    },
    
    sales: {
      create: { 
        client_type: 'minorista',
        payment_methods: ['contado', 'cuotas']
      }
    },
    
    credits: {
      create: true,
      read: { vendedor_id: 'current_user' },
      update: { vendedor_id: 'current_user' }
    }
  }
};
```

## 6. Performance y Optimización

### 6.1 Lazy Loading

```javascript
// src/framework/LazyRoutes.js
const LazyRoutesSpec = {
  routes: [
    {
      path: '/dashboard',
      component: 'lazy(() => import("../pages/Dashboard"))'
    },
    {
      path: '/clients',
      component: 'lazy(() => import("../pages/Clients"))'
    },
    {
      path: '/sales',
      component: 'lazy(() => import("../pages/Sales"))'
    },
    {
      path: '/credits',
      component: 'lazy(() => import("../pages/Credits"))'
    }
  ],
  
  fallback: 'LoadingSpinner',
  errorBoundary: 'ErrorFallback'
};
```

### 6.2 Caché y Estado

```javascript
// src/framework/CacheContext.js
const CacheStrategy = {
  clients: {
    ttl: 300000, // 5 minutos
    invalidateOn: ['create', 'update', 'delete']
  },
  
  products: {
    ttl: 600000, // 10 minutos
    invalidateOn: ['price_update', 'stock_update']
  },
  
  sales: {
    ttl: 60000, // 1 minuto
    invalidateOn: ['new_sale']
  }
};
```

Esta especificación técnica detallada proporciona la base para implementar cada funcionalidad del sistema con precisión y consistencia.