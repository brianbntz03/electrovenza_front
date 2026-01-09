import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoriasActivas } from '../../service/categoriasService';
import CategoryCard from './components/CategoryCard';
import './CatalogoCategorias.css';

/**
 * CatalogoCategorias page component
 * Displays all active categories as clickable cards in a responsive grid
 */
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
      console.error('Error fetching categories:', err);
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
        <h2>Categorías de Productos</h2>
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
