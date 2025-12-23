import React, { useState, useEffect } from 'react';
import { apiRest } from '../../service/apiRest';
import EditarTipoMovimientoCCModal from '../modals/EditarTipoMovimientoCCModal';

const ListadoTipoMovimientoCC = ({ refresh }) => {
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const fetchTiposMovimiento = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiRest}/tipo-movimiento`);
      const data = await response.json();
      setTiposMovimiento(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposMovimiento();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de movimiento?')) {
      try {
        const response = await fetch(`${apiRest}/tipo-movimiento/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchTiposMovimiento();
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Signo</th>
              <th>Internal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposMovimiento.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>
                  <span className={`badge ${item.signo === '+' ? 'badge-success' : 'badge-danger'}`}>
                    {item.signo}
                  </span>
                </td>
                <td>
                  <span className={`badge ${item.internal ? 'badge-primary' : 'badge-secondary'}`}>
                    {item.internal ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary mr-2"
                    onClick={() => setEditingItem(item)}
                  >
                    Editar
                  </button>
                  <button 
                  disabled
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <EditarTipoMovimientoCCModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            fetchTiposMovimiento();
          }}
        />
      )}
    </>
  );
};

export default ListadoTipoMovimientoCC;