import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticulosActivosByCategoria } from '../../service/articulosService';
import { isWholesaleSeller } from '../../constants/roles';
import ArticuloCard from './components/ArticuloCard';
import './ArticulosCategoria.css';

/**
 * ArticulosCategoria page component
 * Displays all active articles from a specific category as cards in a responsive grid
 */
export default function ArticulosCategoria() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem('user_role');
  const showWholesalePrice = isWholesaleSeller(userRole);

  const fetchArticulos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getArticulosActivosByCategoria(categoriaId);
      setArticulos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los artículos');
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoriaId]);

  useEffect(() => {
    if (categoriaId) {
      fetchArticulos();
    }
  }, [categoriaId, fetchArticulos]);

  const handleBackClick = () => {
    navigate('/catalogo-categorias');
  };

  if (isLoading) {
    return (
      <div className="articulos-categoria">
        <div className="articulos-loading">
          <div className="spinner"></div>
          <p>Cargando artículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articulos-categoria">
        <div className="articulos-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={fetchArticulos}>
              <i className="fas fa-sync-alt"></i> Reintentar
            </button>
            <button className="btn btn-secondary" onClick={handleBackClick}>
              <i className="fas fa-arrow-left"></i> Volver a Categorías
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (articulos.length === 0) {
    return (
      <div className="articulos-categoria">
        <div className="articulos-empty">
          <i className="fas fa-box-open"></i>
          <p>No hay artículos disponibles en esta categoría.</p>
          <button className="btn btn-primary" onClick={handleBackClick}>
            <i className="fas fa-arrow-left"></i> Volver a Categorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="articulos-categoria">
      <div className="articulos-header">
        <button className="btn-back" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i> Volver a Categorías
        </button>
        <div className="header-info">
          <h2>Artículos de la Categoría</h2>
          <p className="articulos-count">
            {articulos.length} {articulos.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
          </p>
        </div>
      </div>
      <div className="articulos-grid">
        {articulos.map(articulo => (
          <ArticuloCard
            key={articulo.id}
            articulo={articulo}
            showWholesalePrice={showWholesalePrice}
          />
        ))}
      </div>
    </div>
  );
}
