import React, { useState } from 'react';
import { apiRest } from '../../service/apiRest';

const CrearTipoMovimientoCC = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    signo: '+',
    internal: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiRest}/tipo-movimiento`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSuccess();
        setFormData({
          nombre: '',
          signo: '+',
          internal: false
        });
      }
    } catch (error) {
      console.error('Error al crear tipo movimiento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre *</label>
        <input
          type="text"
          className="form-control"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required
          placeholder="Ej: Pago de cuota"
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
          className="form-check-input"
          checked={formData.internal}
          onChange={(e) => setFormData({...formData, internal: e.target.checked})}
        />
        <label className="form-check-label">Internal</label>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Crear Tipo Movimiento
      </button>
    </form>
  );
};

export default CrearTipoMovimientoCC;