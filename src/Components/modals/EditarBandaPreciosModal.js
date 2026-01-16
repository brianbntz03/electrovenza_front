import React, { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";

export function EditarBandaPreciosModal({
  banda,
  onClose,
  onBandaActualizada,
}) {
  const [formData, setFormData] = useState({
    descripcion: "",
    banda_superior: 0,
    porcentaje_minorista: 0,
    porcentaje_mayorista: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (banda) {
      setFormData({
        descripcion: banda.descripcion || "",
        banda_superior: Number(banda.banda_superior) || 0,
        porcentaje_minorista: Number(banda.porcentaje_minorista) || 0,
        porcentaje_mayorista: Number(banda.porcentaje_mayorista) || 0,
        porcentaje_comision_vendedor: Number(banda.porcentaje_comision_vendedor) || 0,
      });
    }
  }, [banda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiRest}/setting-escala-precios/${banda.id}`, {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al actualizar la banda de precios: ${response.status} - ${errorText}`
        );
      }

      const bandaActualizada = await response.json();
      console.log("Banda actualizada exitosamente:", bandaActualizada);
      onBandaActualizada(bandaActualizada);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!banda) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Bande de definicion de precios</h5>
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
              
              <div className="form-group">
                <label>Banda Superior</label>
                <input
                  type="number"
                  className="form-control"
                  name="banda_superior"
                  value={formData.banda_superior}
                  onChange={handleChangeNumber}
                />
              </div>

              <div className="form-group">
                <label>Descripcion</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>

              

              <div className="form-group">
                <label>Porcentaje Minorista</label>
                <input
                  type="number"
                  className="form-control"
                  name="porcentaje_minorista"
                  value={formData.porcentaje_minorista}
                  onChange={handleChangeNumber}
                />
              </div>

              <div className="form-group">
                <label>Porcentaje Mayorista</label>
                <input
                  type="number"
                  className="form-control"
                  name="porcentaje_mayorista"
                  value={formData.porcentaje_mayorista}
                  onChange={handleChangeNumber}
                />
              </div>

              <div className="form-group">
                <label>Porcentaje Comision Vendedor</label>
                <input
                  type="number"
                  className="form-control"
                  name="porcentaje_comision_vendedor"
                  value={formData.porcentaje_comision_vendedor}
                  onChange={handleChangeNumber}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  cancelar
                </button>
                <button type="submit" className="btn btn-secondary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
