import React, { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";

export const EditarVendedorModal = ({
  vendedor,
  onClose,
  onVendedoresActualizado,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion:  "",
    telefono: 0,
    username:  "",
    email:  "",
    password: "", 
    activo: true,
    tipo: 1,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vendedor) {
      setFormData({
        nombre: vendedor.nombre || "",
        direccion: vendedor.direccion || "",
        telefono: vendedor.telefono || 0,
        username: vendedor.user?.username || "",
        email: vendedor.user?.email || "",
        tipo: vendedor.tipo || 1,
        password: "", 
      });
    }
  }, [vendedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${apiRest}/vendedor/${vendedor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al actualizar el vendedor: ${response.status} - ${errorText}`
        );
      }

      const vendedorActualizado = await response.json();
      
      onVendedoresActualizado(vendedorActualizado);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{display: "block"}}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
        <h5>Editar Vendedor</h5>
        <button 
          type="button"
          className="close"
          onClick={onClose}
          aria-label="Close"
        >
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grouop">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          </div>
          <div className="form-group">
            <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control "
            value={formData.direccion}
            onChange={handleChange}
          />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleChange}
          />
          </div>
          <div className="form-group">
            <label>Tipo</label><br/>
            <input type="radio" name="tipo" value="1" checked={formData.tipo === 1} onChange={handleChange} /> Minorista &nbsp;
            <input type="radio" name="tipo" value="2" checked={formData.tipo === 2} onChange={handleChange} /> Mayorista
          </div>
          <div className="form-group">
            <label>Usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            readOnly
          />
          </div>
          <div className="form-group">
            <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control "
            value={formData.password}
            onChange={handleChange}
          />
          </div>
        <div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary "
            >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar cambios
          </button>
            </div>
        </form>
      </div>
      </div>
      </div>
    </div>
  );
};
