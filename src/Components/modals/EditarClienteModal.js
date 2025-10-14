import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

export function EditarClienteModal({ cliente, onClose, onClienteActualizado }) {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    direccion_local: "",
    direccion_casa: "",
    telefono1: "",
    telefono2: "",
    vendedor_id: 0,
  });
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
          const response = await fetch(`${apiRest}/vendedor?limit=1000`);
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

      console.log("Enviando datos para actualizar cliente:", dataToSend);
      const response = await fetch(`${apiRest}/cliente/${cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
              <div className="form-group">
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
                <label>DNI</label>
                <input
                  type="text"
                  className="form-control"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Dirección del Local</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion_local"
                  value={formData.direccion_local}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Dirección de Casa</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion_casa"
                  value={formData.direccion_casa}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Teléfono 1</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Teléfono 2</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleChange}
                />
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
