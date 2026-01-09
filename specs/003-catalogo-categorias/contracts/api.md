# API Contract: Catálogo de Categorías

**Feature**: 003-catalogo-categorias
**Date**: 2026-01-09

## Endpoints

### GET /categoria

Obtiene la lista de todas las categorías.

**Authorization**: Bearer Token (JWT)

**Request**:
```http
GET /categoria HTTP/1.1
Host: {API_HOST}
Authorization: Bearer {jwt_token}
```

**Response 200 OK**:
```json
[
  {
    "id": 1,
    "nombre": "Cuidado personal",
    "descripcion": "cortadora de pelo, planchita, secador, cremas, etc",
    "activo": true,
    "imagen": "categoria_1.jpeg"
  },
  {
    "id": 2,
    "nombre": "Cocina",
    "descripcion": "electrodomésticos para cocina",
    "activo": true,
    "imagen": "categoria_2.jpeg"
  },
  {
    "id": 3,
    "nombre": "Limpieza",
    "descripcion": "aspiradoras, lustradoras, etc",
    "activo": false,
    "imagen": null
  }
]
```

**Response 401 Unauthorized**:
```json
{
  "error": "Token no válido o expirado"
}
```

**Response 500 Internal Server Error**:
```json
{
  "error": "Error interno del servidor"
}
```

## Frontend Service Interface

```javascript
// src/service/categoriasService.js

import { apiRest } from './apiRest';

/**
 * Get all categories from the API
 * @returns {Promise<Categoria[]>} List of all categories
 * @throws {Error} If the request fails
 */
export const getCategorias = async () => {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${apiRest}/categoria`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener categorías');
  }

  return response.json();
};

/**
 * Get only active categories
 * @returns {Promise<Categoria[]>} List of active categories
 */
export const getCategoriasActivas = async () => {
  const categorias = await getCategorias();
  return categorias.filter(cat => cat.activo === true);
};
```

## Image Assets

**Category Images URL Pattern**:
```
{API_HOST}/images/categorias/{imagen}
```

**Placeholder Image**:
```
/public/placeholder-categoria.png
```

**Dimensions** (recommended):
- Width: 300px
- Height: 200px
- Format: JPEG or PNG
- Aspect ratio: 3:2
