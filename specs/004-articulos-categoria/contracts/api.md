# API Contract: Listado de Artículos por Categoría

**Feature**: 004-articulos-categoria
**Date**: 2026-01-09

## Endpoints

### GET /articulos/by-category-id/{categoryId}

Obtiene la lista de artículos de una categoría específica.

**Authorization**: Bearer Token (JWT)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| categoryId | number | ✓ | ID de la categoría |

**Request**:
```http
GET /articulos/by-category-id/1 HTTP/1.1
Host: {API_HOST}
Authorization: Bearer {jwt_token}
```

**Response 200 OK**:
```json
[
  {
    "id": 24,
    "nombre": "Balanza de Cocina SF 40",
    "descripcion": "Balanza Digital De Cocina 1 Gr- 10 Kg Precision Funcion Tara...",
    "activo": true,
    "precio": "12500",
    "precio_mayorista": "7398",
    "precio_compra": "6217",
    "porcentaje_comision_vendedor": "10.00",
    "porcentaje_comision_mayorista": "3.00",
    "stock": 4,
    "imagen": "articulo_24.jpeg"
  },
  {
    "id": 25,
    "nombre": "Plancha a Vapor",
    "descripcion": "Plancha a vapor con suela antiadherente...",
    "activo": true,
    "precio": "18900",
    "precio_mayorista": "14500",
    "precio_compra": "12000",
    "porcentaje_comision_vendedor": "8.00",
    "porcentaje_comision_mayorista": "2.50",
    "stock": 0,
    "imagen": "articulo_25.jpeg"
  }
]
```

**Response 200 OK (empty category)**:
```json
[]
```

**Response 401 Unauthorized**:
```json
{
  "error": "Token no válido o expirado"
}
```

**Response 404 Not Found** (categoría inexistente):
```json
{
  "error": "Categoría no encontrada"
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
// src/service/articulosService.js (agregar función)

/**
 * Get articles by category ID
 * @param {number|string} categoryId - The category ID
 * @returns {Promise<Articulo[]>} List of articles in the category
 * @throws {Error} If the request fails
 */
export const getArticulosByCategoria = async (categoryId) => {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(
    `${apiRest}/articulos/by-category-id/${categoryId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (response.status === 404) {
    throw new Error('Categoría no encontrada');
  }

  if (!response.ok) {
    throw new Error('Error al obtener artículos');
  }

  return response.json();
};

/**
 * Get only active articles by category
 * @param {number|string} categoryId - The category ID
 * @returns {Promise<Articulo[]>} List of active articles
 */
export const getArticulosActivosByCategoria = async (categoryId) => {
  const articulos = await getArticulosByCategoria(categoryId);
  return articulos.filter(art => art.activo === true);
};
```

## Image Assets

**Article Images URL Pattern**:
```
{API_HOST}/images/articulos/{imagen}
```

**Placeholder Image**:
```
/public/placeholder-articulo.png
```

**Dimensions** (recommended):
- Width: 250px
- Height: 250px
- Format: JPEG or PNG
- Aspect ratio: 1:1

## Role-Based Price Display

| User Role | Price Field |
|-----------|-------------|
| `Vendedor Mayorista` | `precio_mayorista` |
| `vendedor_minorista` | `precio` |
| `administrador` | `precio` |

**Implementation**:
```javascript
import { ROLES, isWholesaleSeller } from '../constants/roles';

const getDisplayPrice = (articulo) => {
  const userRole = localStorage.getItem('user_role');
  if (isWholesaleSeller(userRole)) {
    return articulo.precio_mayorista;
  }
  return articulo.precio;
};
```
