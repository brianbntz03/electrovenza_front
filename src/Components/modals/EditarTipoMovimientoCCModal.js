import React, { useState } from 'react';
import { apiRest } from '../../service/apiRest';

const EditarTipoMovimientoCCModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: item.nombre,
    signo: item.signo,
    internal: item.internal
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiRest}/tipo-movimiento/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Tipo Movimiento CC</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Signo *</label>
                <select
                  className="form-control"
                  value={formData.signo}
                  onChange={(e) => setFormData({...formData, signo: e.target.value})}
                  required
                >
                  <option value="+">+ (Positivo)</option>
                  <option value="-">- (Negativo)</option>
                </select>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  disabled
                  className="form-check-input"
                  checked={formData.internal}
                  onChange={(e) => setFormData({...formData, internal: e.target.checked})}
                />
                <label className="form-check-label">Internal</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarTipoMovimientoCCModal;