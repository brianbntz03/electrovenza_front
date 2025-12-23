# Configuración de API - PovenzaElectro Frontend

## Variables de Entorno

### Configuración Principal
```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api

# .env.development
REACT_APP_API_URL=http://localhost:8000/api

# .env.staging
REACT_APP_API_URL=https://staging-api.povenzaelectro.com/api

# .env.production
REACT_APP_API_URL=https://api.povenzaelectro.com/api
```

## Servicio API Existente

### Archivo Base
```javascript
// src/service/apiRest.js (Existente)
const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Endpoints por Funcionalidad

### Autenticación
```javascript
// src/service/authService.js
import api from './apiRest';

export const authService = {
  login: (credentials) => 
    api.post('/auth/login', credentials),
  
  logout: () => 
    api.post('/auth/logout'),
  
  refreshToken: () => 
    api.post('/auth/refresh'),
  
  getProfile: () => 
    api.get('/auth/profile')
};
```

### Gestión de Clientes
```javascript
// src/service/clientService.js
import api from './apiRest';

export const clientService = {
  // CRUD básico
  getClients: (params = {}) => 
    api.get('/clients', { params }),
  
  getClient: (id) => 
    api.get(`/clients/${id}`),
  
  createClient: (clientData) => 
    api.post('/clients', clientData),
  
  updateClient: (id, clientData) => 
    api.put(`/clients/${id}`, clientData),
  
  deleteClient: (id) => 
    api.delete(`/clients/${id}`),
  
  // Filtros por vendedor
  getClientsByVendedor: (vendedorId, tipo = null) => 
    api.get(`/clients/vendedor/${vendedorId}`, { 
      params: { tipo } 
    }),
  
  // Imágenes
  uploadImage: (clientId, formData) => 
    api.post(`/clients/${clientId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteImage: (clientId, imageId) => 
    api.delete(`/clients/${clientId}/images/${imageId}`),
  
  getImages: (clientId) => 
    api.get(`/clients/${clientId}/images`)
};
```

### Ventas de Electrodomésticos
```javascript
// src/service/salesService.js
import api from './apiRest';

export const salesService = {
  // Productos
  getProducts: (params = {}) => 
    api.get('/products', { params }),
  
  getProductsByRole: (role) => 
    api.get(`/products/role/${role}`),
  
  // Ventas
  createSale: (saleData) => 
    api.post('/sales', saleData),
  
  getSales: (params = {}) => 
    api.get('/sales', { params }),
  
  getSalesByVendedor: (vendedorId, params = {}) => 
    api.get(`/sales/vendedor/${vendedorId}`, { params }),
  
  getSale: (id) => 
    api.get(`/sales/${id}`),
  
  // Presupuestos
  createBudget: (budgetData) => 
    api.post('/budgets', budgetData),
  
  getBudgets: (params = {}) => 
    api.get('/budgets', { params }),
  
  convertBudgetToSale: (budgetId) => 
    api.post(`/budgets/${budgetId}/convert`)
};
```

### Sistema de Créditos
```javascript
// src/service/creditService.js
import api from './apiRest';

export const creditService = {
  // Evaluación de crédito
  evaluateCredit: (evaluationData) => 
    api.post('/credits/evaluate', evaluationData),
  
  // CRUD créditos
  createCredit: (creditData) => 
    api.post('/credits', creditData),
  
  getCredits: (params = {}) => 
    api.get('/credits', { params }),
  
  getCredit: (id) => 
    api.get(`/credits/${id}`),
  
  updateCredit: (id, creditData) => 
    api.put(`/credits/${id}`, creditData),
  
  // Cuotas
  getInstallments: (creditId) => 
    api.get(`/credits/${creditId}/installments`),
  
  payInstallment: (installmentId, paymentData) => 
    api.post(`/installments/${installmentId}/pay`, paymentData),
  
  // Cobranzas
  getPendingPayments: (vendedorId) => 
    api.get(`/credits/pending-payments/vendedor/${vendedorId}`),
  
  getOverduePayments: (vendedorId) => 
    api.get(`/credits/overdue-payments/vendedor/${vendedorId}`),
  
  // Reportes
  getCollectionReport: (params = {}) => 
    api.get('/credits/reports/collection', { params })
};
```

### Configuración del Sistema
```javascript
// src/service/configService.js
import api from './apiRest';

export const configService = {
  // Vendedores
  getVendedores: () => 
    api.get('/vendedores'),
  
  createVendedor: (vendedorData) => 
    api.post('/vendedores', vendedorData),
  
  updateVendedor: (id, vendedorData) => 
    api.put(`/vendedores/${id}`, vendedorData),
  
  // Bandas de precios
  getPriceBands: () => 
    api.get('/price-bands'),
  
  createPriceBand: (bandData) => 
    api.post('/price-bands', bandData),
  
  updatePriceBand: (id, bandData) => 
    api.put(`/price-bands/${id}`, bandData),
  
  // Configuración de cuotas
  getInstallmentSettings: () => 
    api.get('/installment-settings'),
  
  createInstallmentSetting: (settingData) => 
    api.post('/installment-settings', settingData),
  
  updateInstallmentSetting: (id, settingData) => 
    api.put(`/installment-settings/${id}`, settingData),
  
  // Tipos de Movimiento CC
  getTiposMovimientoCC: () => 
    api.get('/tipo-movimiento'),
  
  createTipoMovimientoCC: (data) => 
    api.post('/tipo-movimiento', data),
  
  updateTipoMovimientoCC: (id, data) => 
    api.put(`/tipo-movimiento/${id}`, data),
  
  deleteTipoMovimientoCC: (id) => 
    api.delete(`/tipo-movimiento/${id}`)
};
```

### Reportes
```javascript
// src/service/reportService.js
import api from './apiRest';

export const reportService = {
  // Reportes de ventas
  getSalesReport: (params = {}) => 
    api.get('/reports/sales', { params }),
  
  // Reportes de cobranza
  getCollectionReport: (params = {}) => 
    api.get('/reports/collection', { params }),
  
  // Reportes de ganancias
  getProfitReport: (params = {}) => 
    api.get('/reports/profit', { params }),
  
  // Comisiones
  getCommissionReport: (vendedorId, params = {}) => 
    api.get(`/reports/commissions/vendedor/${vendedorId}`, { params }),
  
  // Exportar reportes
  exportReport: (reportType, params = {}) => 
    api.get(`/reports/${reportType}/export`, { 
      params,
      responseType: 'blob'
    })
};
```

## Manejo de Errores

### Error Handler Global
```javascript
// src/miscellaneus/errorHandler.js
export const handleApiError = (error) => {
  const { response } = error;
  
  if (!response) {
    return {
      message: 'Error de conexión. Verifique su conexión a internet.',
      type: 'network'
    };
  }
  
  switch (response.status) {
    case 400:
      return {
        message: response.data?.message || 'Datos inválidos',
        type: 'validation',
        errors: response.data?.errors
      };
    
    case 401:
      return {
        message: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
        type: 'auth'
      };
    
    case 403:
      return {
        message: 'No tiene permisos para realizar esta acción.',
        type: 'permission'
      };
    
    case 404:
      return {
        message: 'Recurso no encontrado.',
        type: 'notFound'
      };
    
    case 422:
      return {
        message: 'Error de validación',
        type: 'validation',
        errors: response.data?.errors
      };
    
    case 500:
      return {
        message: 'Error interno del servidor. Intente nuevamente.',
        type: 'server'
      };
    
    default:
      return {
        message: 'Error inesperado. Intente nuevamente.',
        type: 'unknown'
      };
  }
};
```

## Configuración de Ambientes

### Development
```javascript
// .env.development
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### Staging
```javascript
// .env.staging
REACT_APP_API_URL=https://staging-api.povenzaelectro.com/api
REACT_APP_ENVIRONMENT=staging
REACT_APP_DEBUG=false
```

### Production
```javascript
// .env.production
REACT_APP_API_URL=https://api.povenzaelectro.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## Interceptores y Middleware

### Request Interceptor
```javascript
// Agregar a src/service/apiRest.js
apiClient.interceptors.request.use(
  (config) => {
    // JWT Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Vendedor ID para filtros automáticos
    const vendedorId = localStorage.getItem('vendedor_id');
    if (vendedorId && !config.params?.vendedor_id) {
      config.params = { ...config.params, vendedor_id: vendedorId };
    }
    
    // Logging en desarrollo
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.log('API Request:', config);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor
```javascript
// Agregar a src/service/apiRest.js
apiClient.interceptors.response.use(
  (response) => {
    // Logging en desarrollo
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.log('API Response:', response);
    }
    
    return response;
  },
  (error) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('vendedor_id');
      window.location.href = '/login';
    }
    
    // Logging de errores
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);
```

## Hooks para API

### useApi Hook
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import { handleApiError } from '../miscellaneus/errorHandler';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, dependencies);
  
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch };
};
```

## Validación de URL de API

### Configuración de Validación
```javascript
// src/miscellaneus/apiValidation.js
export const validateApiUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  
  if (!apiUrl) {
    throw new Error('REACT_APP_API_URL no está definida en las variables de entorno');
  }
  
  try {
    new URL(apiUrl);
  } catch {
    throw new Error('REACT_APP_API_URL no es una URL válida');
  }
  
  return apiUrl;
};

// Validar al iniciar la aplicación
// src/index.js
import { validateApiUrl } from './miscellaneus/apiValidation';

try {
  validateApiUrl();
} catch (error) {
  console.error('Error de configuración:', error.message);
}
```

## Configuración por Rol

### Endpoints Específicos por Rol
```javascript
// src/service/roleBasedApi.js
import api from './apiRest';

export const getRoleBasedEndpoints = (userRole) => {
  const baseEndpoints = {
    clients: '/clients',
    sales: '/sales',
    products: '/products'
  };
  
  switch (userRole) {
    case 'VENDEDOR_MAYORISTA':
      return {
        ...baseEndpoints,
        clients: '/clients?tipo=mayorista',
        products: '/products?price_type=mayorista'
      };
    
    case 'VENDEDOR_MINORISTA':
      return {
        ...baseEndpoints,
        clients: '/clients?tipo=minorista',
        products: '/products?price_type=minorista',
        credits: '/credits'
      };
    
    case 'ADMIN':
      return {
        ...baseEndpoints,
        credits: '/credits',
        vendedores: '/vendedores',
        reports: '/reports',
        tipoMovimientoCC: '/tipo-movimiento'
      };
    
    default:
      return baseEndpoints;
  }
};
```