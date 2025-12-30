import React from 'react';

/**
 * Component for displaying sale summary and cart
 * @param {Object} props
 * @param {Array} props.items - Cart items
 * @param {Function} props.onRemoveItem - Callback to remove item
 * @param {Function} props.onUpdateQuantity - Callback to update quantity
 */
export default function SalesSummary({ items, onRemoveItem, onUpdateQuantity }) {
  const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_mayorista), 0);

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h3 className="card-title">
          <i className="fas fa-shopping-cart mr-2"></i>
          Resumen de Venta
        </h3>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="fas fa-cart-plus fa-3x mb-3 d-block"></i>
            <p>No hay productos seleccionados</p>
            <small>Agregue productos de la lista para comenzar</small>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center" style={{ width: '120px' }}>Cantidad</th>
                    <th className="text-right">Precio Unit.</th>
                    <th className="text-right">Subtotal</th>
                    <th className="text-center" style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <small>{item.nombre}</small>
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="1"
                          max={item.stock_disponible}
                          value={item.cantidad}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value);
                            if (newQty > 0 && newQty <= item.stock_disponible) {
                              onUpdateQuantity(item.id, newQty);
                            }
                          }}
                          style={{ width: '80px', display: 'inline-block' }}
                        />
                        <br />
                        <small className="text-muted">
                          Stock: {item.stock_disponible}
                        </small>
                      </td>
                      <td className="text-right">
                        <small>
                          ${item.precio_mayorista.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </small>
                      </td>
                      <td className="text-right">
                        <strong>
                          ${(item.cantidad * item.precio_mayorista).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onRemoveItem(item.id)}
                          title="Eliminar producto"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-active">
                    <th colSpan="3" className="text-right">TOTAL:</th>
                    <th className="text-right">
                      <h5 className="mb-0">
                        ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h5>
                    </th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-3 alert alert-info">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Total de productos:</strong> {items.length} |
              <strong className="ml-2">Total de unidades:</strong> {items.reduce((sum, item) => sum + item.cantidad, 0)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
