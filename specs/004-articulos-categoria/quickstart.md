# Quickstart: Listado de Artículos por Categoría

**Feature**: 004-articulos-categoria
**Date**: 2026-01-09

## Prerequisites

- Feature 003-catalogo-categorias implementada (navegación desde categorías)
- Node.js instalado
- Backend API corriendo en `localhost:3002`

## Setup

```bash
# Verificar que el proyecto está corriendo
npm start

# La ruta será: /categoria/:categoriaId/articulos
```

## Files to Modify/Create

### 1. Extend Service Layer

**File**: `src/service/articulosService.js` (modificar)

Agregar al final del archivo:

```javascript
/**
 * Get articles by category ID
 * @param {number|string} categoryId - The category ID
 * @returns {Promise<Articulo[]>} List of articles in the category
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

### 2. Page Component

**File**: `src/pages/ArticulosCategoria/ArticulosCategoria.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticulosActivosByCategoria } from '../../service/articulosService';
import { isWholesaleSeller } from '../../constants/roles';
import ArticuloCard from './components/ArticuloCard';
import './ArticulosCategoria.css';

export default function ArticulosCategoria() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem('user_role');

  const fetchArticulos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getArticulosActivosByCategoria(categoriaId);
      setArticulos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los artículos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoriaId) {
      fetchArticulos();
    }
  }, [categoriaId]);

  const handleBackClick = () => {
    navigate('/catalogo-categorias');
  };

  if (isLoading) {
    return <div className="loading">Cargando artículos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchArticulos}>Reintentar</button>
        <button onClick={handleBackClick}>Volver a Categorías</button>
      </div>
    );
  }

  if (articulos.length === 0) {
    return (
      <div className="empty">
        <p>No hay artículos disponibles en esta categoría.</p>
        <button onClick={handleBackClick}>Volver a Categorías</button>
      </div>
    );
  }

  return (
    <div className="articulos-categoria">
      <div className="header">
        <button className="back-btn" onClick={handleBackClick}>
          ← Volver a Categorías
        </button>
        <h2>Artículos de la Categoría</h2>
      </div>
      <div className="articulos-grid">
        {articulos.map(articulo => (
          <ArticuloCard
            key={articulo.id}
            articulo={articulo}
            showWholesalePrice={isWholesaleSeller(userRole)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Card Component

**File**: `src/pages/ArticulosCategoria/components/ArticuloCard.js`

```javascript
import React from 'react';
import { apiRest } from '../../../service/apiRest';
import './ArticuloCard.css';

const truncateDescription = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

const formatPrecio = (precio) => {
  const num = parseFloat(precio);
  return `$${num.toLocaleString('es-AR')}`;
};

const getStockIndicator = (stock) => {
  if (stock === 0) {
    return { text: 'Sin stock', className: 'stock-none' };
  }
  if (stock <= 5) {
    return { text: 'Últimas unidades', className: 'stock-low' };
  }
  return { text: 'Disponible', className: 'stock-available' };
};

export default function ArticuloCard({ articulo, showWholesalePrice }) {
  const imageUrl = articulo.imagen
    ? `${apiRest}/images/articulos/${articulo.imagen}`
    : '/placeholder-articulo.png';

  const precio = showWholesalePrice
    ? articulo.precio_mayorista
    : articulo.precio;

  const stockInfo = getStockIndicator(articulo.stock);

  return (
    <div className="articulo-card">
      <div className="articulo-image">
        <img src={imageUrl} alt={articulo.nombre} />
        <span className={`stock-badge ${stockInfo.className}`}>
          {stockInfo.text}
        </span>
      </div>
      <div className="articulo-info">
        <h3>{articulo.nombre}</h3>
        <p className="descripcion">
          {truncateDescription(articulo.descripcion)}
        </p>
        <p className="precio">{formatPrecio(precio)}</p>
        {showWholesalePrice && (
          <span className="precio-label">Precio Mayorista</span>
        )}
      </div>
    </div>
  );
}
```

### 4. Add Route

**File**: `src/Components/Content.js` (modificar)

```javascript
// Agregar import
import ArticulosCategoria from '../pages/ArticulosCategoria/ArticulosCategoria';

// Agregar ruta (dentro de <Routes>)
<Route path="/categoria/:categoriaId/articulos" element={<ArticulosCategoria />} />
```

## CSS Styles (Basic)

### ArticulosCategoria.css

```css
.articulos-categoria {
  padding: 20px;
}

.articulos-categoria .header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.articulos-categoria .back-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.articulos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
}

.error button, .empty button {
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
}
```

### ArticuloCard.css

```css
.articulo-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: box-shadow 0.2s;
}

.articulo-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.articulo-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.articulo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.stock-available { background: #4caf50; color: white; }
.stock-low { background: #ff9800; color: white; }
.stock-none { background: #f44336; color: white; }

.articulo-info {
  padding: 15px;
}

.articulo-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.articulo-info .descripcion {
  color: #666;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.articulo-info .precio {
  font-size: 20px;
  font-weight: bold;
  color: #2196f3;
  margin: 0;
}

.articulo-info .precio-label {
  font-size: 12px;
  color: #666;
}
```

## Testing

```bash
# Ejecutar tests
npm test

# Verificar en navegador:
# 1. Login como vendedor minorista → ver precio minorista
# 2. Login como vendedor mayorista → ver precio mayorista
# 3. Navegar a /catalogo-categorias
# 4. Hacer clic en una categoría
# 5. Verificar tarjetas de artículos
# 6. Verificar indicadores de stock
# 7. Verificar botón "Volver a Categorías"
```

## Verification Checklist

- [ ] Función `getArticulosByCategoria` agregada a articulosService
- [ ] Componente `ArticulosCategoria.js` creado
- [ ] Componente `ArticuloCard.js` creado
- [ ] Estilos CSS creados
- [ ] Ruta agregada en `Content.js`
- [ ] Precio correcto según rol de usuario
- [ ] Indicadores de stock funcionando
- [ ] Estados de loading/error/empty funcionando
- [ ] Navegación "Volver a Categorías" funciona
- [ ] Layout responsive verificado
- [ ] Descripción truncada correctamente
- [ ] Imagen placeholder funciona
