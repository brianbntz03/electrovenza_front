import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

// URL de un placeholder simple
const PLACEHOLDER_URL = "https://placehold.co/100x100/eeeeee/333333?text=Sin+Foto";

export function EditarClienteModal({ cliente, onClose, onClienteActualizado }) {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    direccion_local: "",
    direccion_casa: "", 
    telefono1: "",
    telefono2: "",
    rubro: "",
    vendedor_id: 0,
  });
  const [documentoFrente, setDocumentoFrente] = useState(null);
  const [documentoDorso, setDocumentoDorso] = useState(null);
  const [servicio1, setServicio1] = useState(null);
  const [servicio2, setServicio2] = useState(null);
  
  // Estados para las vistas previas
  const [previewDocumentoFrente, setPreviewDocumentoFrente] = useState(null);
  const [previewDocumentoDorso, setPreviewDocumentoDorso] = useState(null);
  const [previewServicio1, setPreviewServicio1] = useState(null);
  const [previewServicio2, setPreviewServicio2] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        dni: Number(cliente.dni) || 0,
        direccion_local: cliente.direccion_local || "",
        direccion_casa: cliente.direccion_casa || "",
        telefono1: Number(cliente.telefono1) || 0,
        telefono2: Number(cliente.telefono2) || 0,
        rubro: cliente.rubro || "",
        vendedor_id: cliente.vendedor ? Number(cliente.vendedor.id) : 0,
      });
    }
  }, [cliente]);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);

    if (role === "admin") {
      const fetchVendedores = async () => {
        try {
          const response = await fetch(`${apiRest}/vendedor?limit=1000`,
        {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
          if (!response.ok) {
            throw new Error("No se pudo cargar los vendedores");
          }
          const { data } = await response.json();
          setVendedores(Array.isArray(data) ? data : data.vendedores || []);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchVendedores();
    }
  }, []);

  // Limpiar URLs de objeto al desmontar el componente
  useEffect(() => {
    return () => {
      if (previewDocumentoFrente) URL.revokeObjectURL(previewDocumentoFrente);
      if (previewDocumentoDorso) URL.revokeObjectURL(previewDocumentoDorso);
      if (previewServicio1) URL.revokeObjectURL(previewServicio1);
      if (previewServicio2) URL.revokeObjectURL(previewServicio2);
    };
  }, [previewDocumentoFrente, previewDocumentoDorso, previewServicio1, previewServicio2]);

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
  
  // Función para manejar errores de carga de imagen (404)
  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_URL) {
      e.target.onerror = null; 
      e.target.src = PLACEHOLDER_URL;
      e.target.alt = "Imagen no disponible";
    }
  };


  const handleImageUpload = async (tipo, archivo) =>  {

  const formData = new FormData();
  formData.append('imagen', 'file');

    if (!archivo) return;

    try {
      const formData = new FormData();
      // El campo del archivo DEBE llamarse 'imagen'
      formData.append("imagen", archivo); 
      
      //  RUTA CORREGIDA: Incluye el tipo en la URL
      const response = await fetch(`${apiRest}/cliente/${cliente.id}/imagen/${tipo}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }
      
      // FORZAR RECARGA DE LA IMAGEN EN LA VENTANA ACTUAL
      const timestamp = new Date().getTime();
      const imgElements = document.querySelectorAll(`img[src*="cliente/${cliente.id}/imagen"]`);
      imgElements.forEach(img => {
        const currentSrc = img.src.split('?')[0];
        // Solo actualizamos la imagen cuyo tipo coincide con la que acabamos de subir
        if (currentSrc.includes(tipo)) {
            img.src = `${currentSrc}?t=${timestamp}`
        }
      });

      
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(Number(formData.dni))) {
      setError("El DNI debe ser un número válido.");
      return;
    }

    setError(null);

    try {
      const dataToSend = {
        ...formData,
        dni: Number(formData.dni),
        telefono1: Number(formData.telefono1),
        telefono2: Number(formData.telefono2),
      };

      const response = await fetch(`${apiRest}/cliente/${cliente.id}`, {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al actualiz   el producto: ${response.status} - ${errorText}`
        );
      }

      const clienteActualizado = await response.json();
      const vendedorSeleccionado = vendedores.find(
        (vendedor) => Number(vendedor.id) === dataToSend.vendedor_id
      );
      const clienteConVendedorCompleto = {
        ...clienteActualizado,
        vendedor: vendedorSeleccionado || cliente.vendedor || null,
      };

      console.log(
        "Cliente actualizado exitosamente:",
        clienteConVendedorCompleto
      );
      onClienteActualizado(clienteConVendedorCompleto);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!cliente) {
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
            <h5 className="modal-title">Editar Cliente</h5>
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
              {/* --- Campos de texto sin cambios --- */}
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>DNI</label>
                <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Dirección del Local</label>
                <input type="text" className="form-control" name="direccion_local" value={formData.direccion_local} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Dirección de Casa</label>
                <input type="text" className="form-control" name="direccion_casa" value={formData.direccion_casa} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teléfono 1</label>
                <input type="text" className="form-control" name="telefono1" value={formData.telefono1} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teléfono 2</label>
                <input type="text" className="form-control" name="telefono2" value={formData.telefono2} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Rubro</label>
                <input type="text" className="form-control" name="rubro" value={formData.rubro} onChange={handleChange} />
              </div>
              {userRole === "admin" && (
                <div className="form-group">
                  <label>Vendedor</label>
                  <select
                    className="form-control"
                    name="vendedor_id"
                    value={Number(formData.vendedor_id)}
                    onChange={handleChangeNumber}
                  >
                    <option value="">Seleccione un vendedor</option>
                    {vendedores.map((vendedor) => (
                      <option key={vendedor.id} value={String(vendedor.id)}>
                        {vendedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <h5 className="mt-4 mb-3">Imágenes del Cliente</h5>
              
              {/* Documento Frente */}
              <div className="card mb-3">
                <div className="card-header">Documento Frente</div>
                <div className="card-body">
                  <div className="form-group">
                    <label>{previewDocumentoFrente ? 'Nueva Imagen Seleccionada' : 'Imagen Actual'}</label>
                    <div>
                      <img 
                          src={previewDocumentoFrente || `${apiRest}/cliente/${cliente.id}/imagen/frente`} 
                          width={100} 
                          alt="Documento Frente"
                          onError={handleImageError}
                      ></img>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nueva Imagen</label>
                    <input
                      type="file"
                      className="form-control"

                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDocumentoFrente(file);
                          setPreviewDocumentoFrente(URL.createObjectURL(file));
                          handleImageUpload('frente', file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Documento Dorso */}
              <div className="card mb-3">
                <div className="card-header">Documento Dorso</div>
                <div className="card-body">
                  <div className="form-group">
                    <label>{previewDocumentoDorso ? 'Nueva Imagen Seleccionada' : 'Imagen Actual'}</label>
                    <div>
                      <img 
                          src={previewDocumentoDorso || `${apiRest}/cliente/${cliente.id}/imagen/dorso`} 
                          width={100} 
                          alt="Documento Dorso"
                          onError={handleImageError}
                      ></img>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nueva Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDocumentoDorso(file);
                          setPreviewDocumentoDorso(URL.createObjectURL(file));
                          handleImageUpload('dorso', file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Servicio 1 */}
              <div className="card mb-3">
                <div className="card-header">Servicio 1</div>
                <div className="card-body">
                  <div className="form-group">
                    <label>{previewServicio1 ? 'Nueva Imagen Seleccionada' : 'Imagen Actual'}</label>
                    <div>
                      <img 
                          src={previewServicio1 || `${apiRest}/cliente/${cliente.id}/imagen/servicio1`} 
                          width={100} 
                          alt="Servicio 1"
                          onError={handleImageError}
                      ></img>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nueva Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setServicio1(file);
                          setPreviewServicio1(URL.createObjectURL(file));
                          handleImageUpload('servicio1', file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Servicio 2 */}
              <div className="card mb-3">
                <div className="card-header">Servicio 2</div>
                <div className="card-body">
                  <div className="form-group">
                    <label>{previewServicio2 ? 'Nueva Imagen Seleccionada' : 'Imagen Actual'}</label>
                    <div>
                      <img 
                          src={previewServicio2 || `${apiRest}/cliente/${cliente.id}/imagen/servicio2`} 
                          width={100} 
                          alt="Servicio 2"
                          onError={handleImageError}
                      ></img>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nueva Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setServicio2(file);
                          setPreviewServicio2(URL.createObjectURL(file));
                          handleImageUpload('servicio2', file);
                        }
                      }}
                    />
                  </div>
                </div>
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