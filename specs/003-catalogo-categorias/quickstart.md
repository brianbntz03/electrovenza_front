# Quickstart: Catálogo de Categorías

**Feature**: 003-catalogo-categorias
**Date**: 2026-01-09

## Prerequisites

- Node.js instalado
- Proyecto electrovenza_front clonado
- Backend API corriendo en `localhost:3002` (o URL configurada en `.env`)

## Setup

```bash
# 1. Instalar dependencias (si no están instaladas)
npm install

# 2. Verificar variables de entorno
cat .env
# Debe existir: REACT_APP_API_URL=http://localhost:3002

# 3. Iniciar el servidor de desarrollo
npm start
```

## Files to Create

### 1. Service Layer

**File**: `src/service/categoriasService.js`

```javascript
import { apiRest } from './apiRest';

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

export const getCategoriasActivas = async () => {
  const categorias = await getCategorias();
  return categorias.filter(cat => cat.activo === true);
};
```

### 2. Page Component

**File**: `src/pages/CatalogoCategorias/CatalogoCategorias.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoriasActivas } from '../../service/categoriasService';
import CategoryCard from './components/CategoryCard';
import './CatalogoCategorias.css';

export default function CatalogoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCategorias = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategoriasActivas();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoriaId) => {
    navigate(`/categoria/${categoriaId}/articulos`);
  };

  if (isLoading) {
    return <div className="loading">Cargando categorías...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchCategorias}>Reintentar</button>
      </div>
    );
  }

  if (categorias.length === 0) {
    return <div className="empty">No hay categorías disponibles.</div>;
  }

  return (
    <div className="catalogo-categorias">
      <h2>Categorías de Productos</h2>
      <div className="categorias-grid">
        {categorias.map(categoria => (
          <CategoryCard
            key={categoria.id}
            categoria={categoria}
            onClick={() => handleCategoryClick(categoria.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Card Component

**File**: `src/pages/CatalogoCategorias/components/CategoryCard.js`

```javascript
import React from 'react';
import { apiRest } from '../../../service/apiRest';
import './CategoryCard.css';

export default function CategoryCard({ categoria, onClick }) {
  const imageUrl = categoria.imagen
    ? `${apiRest}/images/categorias/${categoria.imagen}`
    : '/placeholder-categoria.png';

  return (
    <div className="category-card" onClick={onClick}>
      <img src={imageUrl} alt={categoria.nombre} />
      <div className="category-info">
        <h3>{categoria.nombre}</h3>
        <p>{categoria.descripcion}</p>
      </div>
    </div>
  );
}
```

### 4. Add Route

**File**: `src/Components/Content.js` (modificar)

```javascript
// Agregar import
import CatalogoCategorias from '../pages/CatalogoCategorias/CatalogoCategorias';

// Agregar ruta (dentro de <Routes>)
<Route path="/catalogo-categorias" element={<CatalogoCategorias />} />
```

## Testing

```bash
# Ejecutar tests
npm test

# Verificar en navegador
# 1. Login con cualquier usuario
# 2. Navegar a /catalogo-categorias
# 3. Verificar que se muestran las categorías como bloques
# 4. Hacer clic en una categoría para navegar
```

## Verification Checklist

- [ ] Service `categoriasService.js` creado
- [ ] Componente `CatalogoCategorias.js` creado
- [ ] Componente `CategoryCard.js` creado
- [ ] Estilos CSS creados
- [ ] Ruta agregada en `Content.js`
- [ ] Estados de loading/error/empty funcionando
- [ ] Imagen placeholder disponible
- [ ] Navegación a artículos funciona
- [ ] Layout responsive verificado
