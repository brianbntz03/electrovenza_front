import React from 'react';
import { apiRest } from '../../../service/apiRest';
import './CategoryCard.css';

/**
 * CategoryCard component displays a single category as a clickable card
 * @param {Object} props
 * @param {Object} props.categoria - Category data object
 * @param {Function} props.onClick - Click handler for navigation
 */
export default function CategoryCard({ categoria, onClick }) {
  const imageUrl = `${apiRest}/categoria/image/${categoria.id}`;

  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-image">
        <img
          src={imageUrl}
          alt={categoria.nombre}
          
        />
        
      </div>
      <div className="category-info">
        <h3 className="category-name">{categoria.nombre}</h3>
        <p className="category-description">{categoria.descripcion}
        

        </p>
      </div>
    </div>
  );
}
