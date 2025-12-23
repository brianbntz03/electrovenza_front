# Configuración de Variables de Entorno - PovenzaElectro

## Archivo .env Principal

```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
REACT_APP_VERSION=1.0.0
```

## Configuración por Ambiente

### Development (.env.development)
```bash
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

### Staging (.env.staging)
```bash
REACT_APP_API_URL=https://staging-api.povenzaelectro.com/api
REACT_APP_ENVIRONMENT=staging
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=warn
```

### Production (.env.production)
```bash
REACT_APP_API_URL=https://api.povenzaelectro.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

## Uso en el Código

### Servicio API Base
```javascript
// src/service/apiRest.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL no está definida');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;
```

### Validación de Variables
```javascript
// src/miscellaneus/envValidation.js
export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_ENVIRONMENT'
  ];
  
  const missing = requiredVars.filter(
    varName => !process.env[varName]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Variables de entorno faltantes: ${missing.join(', ')}`
    );
  }
  
  // Validar formato de URL
  try {
    new URL(process.env.REACT_APP_API_URL);
  } catch {
    throw new Error('REACT_APP_API_URL no es una URL válida');
  }
};
```

### Configuración de Endpoints
```javascript
// src/constants/endpoints.js
const API_BASE = process.env.REACT_APP_API_URL;

export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH: `${API_BASE}/auth/refresh`,
    PROFILE: `${API_BASE}/auth/profile`
  },
  
  // Clientes
  CLIENTS: {
    BASE: `${API_BASE}/clients`,
    BY_ID: (id) => `${API_BASE}/clients/${id}`,
    BY_VENDEDOR: (vendedorId) => `${API_BASE}/clients/vendedor/${vendedorId}`,
    IMAGES: (clientId) => `${API_BASE}/clients/${clientId}/images`,
    IMAGE_BY_ID: (clientId, imageId) => `${API_BASE}/clients/${clientId}/images/${imageId}`
  },
  
  // Ventas
  SALES: {
    BASE: `${API_BASE}/sales`,
    BY_ID: (id) => `${API_BASE}/sales/${id}`,
    BY_VENDEDOR: (vendedorId) => `${API_BASE}/sales/vendedor/${vendedorId}`
  },
  
  // Productos
  PRODUCTS: {
    BASE: `${API_BASE}/products`,
    BY_ROLE: (role) => `${API_BASE}/products/role/${role}`
  },
  
  // Créditos
  CREDITS: {
    BASE: `${API_BASE}/credits`,
    EVALUATE: `${API_BASE}/credits/evaluate`,
    INSTALLMENTS: (creditId) => `${API_BASE}/credits/${creditId}/installments`,
    PAY_INSTALLMENT: (installmentId) => `${API_BASE}/installments/${installmentId}/pay`
  }
};
```

## Configuración de Build

### package.json Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "start:staging": "env-cmd -f .env.staging react-scripts start",
    "build": "react-scripts build",
    "build:staging": "env-cmd -f .env.staging react-scripts build",
    "build:production": "env-cmd -f .env.production react-scripts build"
  }
}
```

### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build arguments para variables de entorno
ARG REACT_APP_API_URL
ARG REACT_APP_ENVIRONMENT

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Seguridad

### Variables Públicas
```javascript
// Solo variables con prefijo REACT_APP_ son accesibles en el frontend
// Estas variables son públicas y visibles en el bundle final

// ✅ Correcto - Variable pública
const apiUrl = process.env.REACT_APP_API_URL;

// ❌ Incorrecto - No será accesible
const secretKey = process.env.SECRET_KEY; // undefined
```

### Validación en Runtime
```javascript
// src/index.js
import { validateEnvironment } from './miscellaneus/envValidation';

// Validar variables antes de iniciar la app
try {
  validateEnvironment();
} catch (error) {
  console.error('Error de configuración:', error.message);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error de Configuración</h1>
      <p>${error.message}</p>
    </div>
  `;
  throw error;
}
```

## Mejores Prácticas

### 1. Nomenclatura Consistente
```bash
# Prefijo obligatorio para React
REACT_APP_API_URL=...
REACT_APP_ENVIRONMENT=...
REACT_APP_DEBUG=...

# Usar UPPER_SNAKE_CASE
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_SUPPORTED_FORMATS=jpg,png,pdf
```

### 2. Valores por Defecto
```javascript
// src/constants/config.js
export const CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  DEBUG: process.env.REACT_APP_DEBUG === 'true',
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880,
  SUPPORTED_FORMATS: process.env.REACT_APP_SUPPORTED_FORMATS?.split(',') || ['jpg', 'png', 'pdf']
};
```

### 3. Documentación de Variables
```javascript
// src/constants/envSchema.js
export const ENV_SCHEMA = {
  REACT_APP_API_URL: {
    required: true,
    type: 'url',
    description: 'URL base de la API backend'
  },
  REACT_APP_ENVIRONMENT: {
    required: true,
    type: 'string',
    enum: ['development', 'staging', 'production'],
    description: 'Ambiente de ejecución'
  },
  REACT_APP_DEBUG: {
    required: false,
    type: 'boolean',
    default: false,
    description: 'Habilitar logs de debug'
  }
};
```

## Deployment

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      args:
        REACT_APP_API_URL: ${REACT_APP_API_URL}
        REACT_APP_ENVIRONMENT: ${REACT_APP_ENVIRONMENT}
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Deploy
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
          REACT_APP_ENVIRONMENT: production
        run: |
          npm ci
          npm run build
          # Deploy steps...
```