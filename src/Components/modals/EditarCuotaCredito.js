import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";
import { authenticatedFetch } from "../../utils/authenticatedFetch";
import { CUOTA_TYPE_NAMES } from "../../constants/cuotaTypes";

export function EditarCuotaCredito({ cuotaCredito, onClose, onCuotaCreditoActualizada }) {
  const [formData, setFormData] = useState({
    descripcion: "",
    numero: "",
    interes: "",
    tipo_cuota: "", 
    comision_vendedor: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cuotaCredito) {
      setFormData({
        descripcion: cuotaCredito.descripcion || "",
        numero: String(cuotaCredito.numero) || "",
        interes: String(cuotaCredito.interes) || "",
        tipo_cuota: String(cuotaCredito.tipo_cuota) || "", 
        comision_vendedor: String(cuotaCredito.comision_vendedor) || "", 
      });
    }
  }, [cuotaCredito]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        numero: Number(formData.numero),
        interes: Number(formData.interes),
        tipo_cuota: Number(formData.tipo_cuota), 
        comision_vendedor: Number(formData.comision_vendedor),
      };

      const response = await authenticatedFetch(`${apiRest}/settings/cuotas-credito/${cuotaCredito.id}`, {
        method: "PATCH",
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar la cuota: ${response.status} - ${errorText}`);
      }

      const cuotaActualizada = await response.json();
      console.log("Cuota actualizada exitosamente:", cuotaActualizada);
      onCuotaCreditoActualizada(cuotaActualizada);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!cuotaCredito) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cuota</h5>
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
                <label>Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input
                  type="number"
                  className="form-control"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Interés</label>
                <input
                  type="number"
                  className="form-control"
                  name="interes"
                  value={formData.interes}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>

                <select
                  className="form-control"
                  value={formData.tipo_cuota}
                  name="tipo_cuota"
                  onChange={handleChange}
                  required
                  >
                    <option value="">Seleccione una... </option>
                    { Object.entries(CUOTA_TYPE_NAMES).map(([key, value]) => (
                      <option value={key}>{value}</option>
                    ))}
                  </select>

              </div>

              <div className="form-group">
                <label>Comision Vendedor</label>
                <input
                  type="text"
                  className="form-control"
                  name="comision_vendedor" 
                  value={formData.comision_vendedor}
                  onChange={handleChange}
                />
              </div>


              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
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
    </div>
  );
}