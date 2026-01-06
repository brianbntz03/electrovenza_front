import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

export function ModalEditarBandasPrecios({ object, onClose, onObjectActualizado }) {
  const urlObject = `${apiRest}/setting-escala-precios`;
  const titleSingular = "Banda de precios";  

  const [formData, setFormData] = useState({
    descripcion: "",
    banda_superior: 0,
    porcentaje_minorista: 0,
    porcentaje_mayorista: 0,
    porcentaje_comision_vendedor: 0,
  });
  const [colectivo, setColectivo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (object) {
      setFormData({
        descripcion: object.descripcion || "",
        banda_superior: Number(object.banda_superior) || 0,
        porcentaje_minorista: Number(object.porcentaje_minorista) || 0,
        porcentaje_mayorista: Number(object.porcentaje_mayorista) || 0,
        porcentaje_comision_vendedor: Number(object.porcentaje_comision_vendedor) || 0,
        porcentaje_comision_mayorista: Number(object.porcentaje_comision_mayorista) || 0,
      });
    }
  }, [object]);

  useEffect(() => {
    const fetchColectivo = async () => {
      try {
        const response = await fetch(`${urlObject}`);
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


const handleChangeString = (e) => {
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
  
const handleChange = (e) => {
  const { name, value } = e.target;
  let numbers = ["banda_superior", "porcentaje_minorista", "porcentaje_mayorista", "porcentaje_comision_vendedor", "porcentaje_comision_mayorista"];
  let isNumber = numbers.includes(name);
  if(isNumber){
    console.log("number", name)
    handleChangeNumber(e);
  }else{
    console.log("string", name)
    handleChangeString(e)
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Enviando datos para actualizar ${titleSingular}:`, formData);
      const response = await fetch(`${urlObject}/${object.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
            <h5 className="modal-title">Editar {titleSingular}</h5>
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
              
              {
              Object.entries(formData).map(([key, value]) =>(
                <div className="form-group">
                <label>{key}</label>
                <input
                  type="text"
                  className="form-control"
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              </div>
              ))}
              
              
              
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
