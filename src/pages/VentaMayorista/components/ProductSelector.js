import React, { useState, useEffect } from 'react';
import { getArticulosMayorista } from '../../../service/articulosService';

/**
 * Component for selecting products with wholesale pricing
 * @param {Object} props
 * @param {Function} props.onAddProduct - Callback when product is added
 */
export default function ProductSelector({ onAddProduct }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticulosMayorista();
      
      setProductos(data);

    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar productos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Seleccionar Productos</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-3">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p className="mt-2">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
            <button className="btn btn-sm btn-outline-danger ml-3" onClick={fetchProductos}>
              <i className="fas fa-sync mr-1"></i>
              Reintentar
            </button>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="alert alert-info">
            <i className="fas fa-info-circle mr-2"></i>
            {searchTerm ? 'No se encontraron productos con ese nombre.' : 'No hay productos con precio mayorista disponibles.'}
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-striped table-hover">
              <thead className="thead-light sticky-top">
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Stock</th>
                  <th className="text-right">Precio Mayorista</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td className="text-center">
                      <span className={`badge ${producto.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="text-right">
                      ${producto.precio_mayorista?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onAddProduct(producto)}
                        disabled={producto.stock === 0}
                        title={producto.stock === 0 ? 'Sin stock disponible' : 'Agregar al carrito'}
                      >
                        <i className="fas fa-plus mr-1"></i>
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
