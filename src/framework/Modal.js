import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

export function ModalEditarTEMPLATE_LISTADO_NAME({ object, onClose, onObjectActualizado }) {
  const urlObject = `${apiRest}/cliente`;
  const titleSingular = "Cliente";  

  const [formData, setFormData] = useState({
    dato1: "",
    dato2: "",
  });
  const [colectivo, setColectivo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (object) {
      setFormData({
        dato1: object.dato1 || "",
        dato2: Number(object.dato2) || 0,
      });
    }
  }, [object]);

  useEffect(() => {
    const fetchColectivo = async () => {
      try {
        const response = await fetch(`${urlObject}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
          }
        );
        if (!response.ok) {
          throw new Error(`No se pudo actualizar los datos del ${titleSingular}`);
        }
        const data = await response.json();
        setColectivo(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchColectivo();
  }, []);

  
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
      console.log(`Enviando datos para actualizar ${titleSingular}:`, formData);
      const response = await fetch(`${urlObject}/${object.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(formData),
      });

     if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar ${titleSingular}: ${response.status} - ${errorText}`);
      }

      const objectActualizado = await response.json();
      const objectSeleccionado = colectivo.find(
        (object) => Number(object.id) === formData.id
      );
      const objectCompleto = {
        ...objectActualizado,
        object: objectSeleccionado || null,
      };

      console.log(`${titleSingular}} actualizado exitosamente:`, objectCompleto);
      onObjectActualizado(objectCompleto);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };


  if (!object) {
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
            <h5 className="modal-title">Editar ({titleSingular})</h5>
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
                <label>Dato 1</label>
                <input
                  type="text"
                  className="form-control"
                  name="dato1"
                  value={formData.dato1}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Dato 2</label>
                <input
                  type="text"
                  className="form-control"
                  name="dato2"
                  value={formData.dato2}
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
