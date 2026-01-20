import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCategoriasActivas } from '../../service/categoriasService';
import CategoryCard from './components/CategoryCard';
import './CatalogoCategorias.css';
import { CATALOGO_MAYORISTA, CATALOGO_MINORISTA, CATALOGO_VENDEDOR_MAYORISTA } from '../../constants/catalogo';

/**
 * CatalogoCategorias page component
 * Displays all active categories as clickable cards in a responsive grid
 */
export default function CatalogoCategorias({ opcion }) {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getCatalogoFromUrl = () => {
    const path = location.pathname;

    if (path.includes('catalogo-vendedor-mayorista')) {
      return CATALOGO_VENDEDOR_MAYORISTA;
    }
    if (path.includes('catalogo-mayorista')) {
      return CATALOGO_MAYORISTA;
    }
    if (path.includes('catalogo-minorista')) {
      return CATALOGO_MINORISTA;
    }

    return CATALOGO_MINORISTA; // fallback seguro
  };

  const catalogoActual = getCatalogoFromUrl();
  
  const getCatalogoPath = () => {
    switch (catalogoActual) {
      case CATALOGO_MAYORISTA:
        return '/catalogo-mayorista';
      case CATALOGO_MINORISTA:
        return '/catalogo-minorista';
      case CATALOGO_VENDEDOR_MAYORISTA:
        return '/catalogo-vendedor-mayorista';
      default:
        return '/catalogo-minorista';
    }
  };


  const getCatalogoTitle = () => {
    switch (catalogoActual) {
      case CATALOGO_MAYORISTA:
        return 'Catálogo Mayorista';
      case CATALOGO_MINORISTA:
        return 'Catálogo Minorista';
      case CATALOGO_VENDEDOR_MAYORISTA:
        return 'Catálogo Vendedor Mayorista';
      default:
        return 'Catálogo de Productos';
    }
  };

  const fetchCategorias = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategoriasActivas();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías. Por favor, intente nuevamente.');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ocultar el menú lateral
    document.body.classList.add('sidebar-mini', 'sidebar-collapse');
    const sidebar = document.querySelector('.main-sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
    
    // Limpiar al desmontar el componente
    return () => {
      document.body.classList.remove('sidebar-mini', 'sidebar-collapse');
      const sidebar = document.querySelector('.main-sidebar');
      if (sidebar) {
        sidebar.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoriaId) => {
    const basePath = getCatalogoPath();
    navigate(`${basePath}/categoria/${categoriaId}/articulos`);
  };

  if (isLoading) {
  return (
      <div className="catalogo-categorias">
        <div className="catalogo-loading">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalogo-categorias">
        <div className="catalogo-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchCategorias}>
            <i className="fas fa-sync-alt"></i> Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="catalogo-categorias">
        <div className="catalogo-empty">
          <i className="fas fa-folder-open"></i>
          <p>No hay categorías disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-categorias">
      <div className="catalogo-header">
        <h2>{getCatalogoTitle()}</h2>
        <p className="catalogo-subtitle">
          Seleccione una categoría para ver los artículos disponibles
        </p>
      </div>
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
