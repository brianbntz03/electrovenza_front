import React from 'react';
import { apiRest } from '../../../service/apiRest';
import './ArticuloCard.css';

/**
 * Truncates a description to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default 120)
 * @returns {string} Truncated text with ellipsis if needed
 */
const truncateDescription = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Formats a price number for display in Argentine locale
 * @param {string|number} precio - The price to format
 * @returns {string} Formatted price string
 */
const formatPrecio = (precio) => {
  const num = parseFloat(precio);
  if (isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-AR')}`;
};

/**
 * Returns stock indicator information based on quantity
 * @param {number} stock - Stock quantity
 * @returns {Object} Object with text and className
 */
const getStockIndicator = (stock) => {
  if (stock === 0) {
    return { text: 'Sin stock', className: 'stock-none' };
  }
  if (stock <= 5) {
    return { text: 'Últimas unidades', className: 'stock-low' };
  }
  return { text: 'Disponible', className: 'stock-available' };
};

/**
 * ArticuloCard component displays a single product as a card
 * @param {Object} props
 * @param {Object} props.articulo - Product data object
 * @param {Number} props.mostrarPrecio - Whether to show wholesale price
 */
export default function ArticuloCard({ articulo, mostrarPrecio }) {
  const imageUrl = articulo.imagen
    ? `${apiRest}/articulos/${articulo.id}/imagen`
    : '/placeholder-articulo.png';

  const precio = mostrarPrecio
    ? articulo.precio_mayorista
    : articulo.precio;

  const stockInfo = getStockIndicator(articulo.stock);

  return (
    <div className="articulo-card">
      <div className="articulo-image">
        <img
          src={imageUrl}
          alt={articulo.nombre}
          
        />
        <span className={`stock-badge ${stockInfo.className}`}>
          {stockInfo.text}
        </span>
      </div>
      <div className="articulo-info">
        <h3 className="articulo-nombre">{articulo.nombre}</h3>
        <p className="articulo-descripcion">
          {truncateDescription(articulo.descripcion)}
        </p>
        <div className="articulo-precio-container">
          <p className="articulo-precio">{formatPrecio(precio)}</p>
          {mostrarPrecio && (
            <span className="precio-label">Precio Mayorista</span>
          )}
        </div>
      </div>
    </div>
  );
}
