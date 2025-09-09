import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";
import { EditarClienteModal } from "../modals/EditarClienteModal";

export function ListadoClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleOpenModal = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(false);
  };

  const handleClienteActualizado = (clienteActualizado) => {
    const nuevosClientes = clientes.map((c) =>
      c.id === clienteActualizado.id ? { ...c, ...clienteActualizado } : c
    );
    setClientes(nuevosClientes);
    localStorage.setItem("clientes", JSON.stringify(nuevosClientes));
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/cliente/${id}`, {
        method: "DELETE",
      });
      console.log(`Producto con id ${id} eliminado. `);

      const nuevosClientes = clientes.filter((cliente) => cliente.id !== id);
      setClientes(nuevosClientes);
      localStorage.setItem("clientes", JSON.stringify(nuevosClientes));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${apiRest}/cliente`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setClientes(data);
      localStorage.setItem("clientes", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchClientes();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando Clientes...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }
  if (!clientes || clientes.length === 0) {
    return <div className="error-container">No hay clientes registrados</div>;
  }

  return (
    <div className="card-body">
      <p>Listado de Clientes</p>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Dirección del Local</th>
            <th>Dirección de Casa</th>
            <th>Teléfono 1</th>
            <th>Teléfono 2</th>
            <th>Vendedor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes
            .filter((c) => c && c.nombre)
            .map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.dni}</td>
                <td>{cliente.direccion_local}</td>
                <td>{cliente.direccion_casa}</td>
                <td>{cliente.telefono1}</td>
                <td>{cliente.telefono2}</td>
                <td>{cliente.vendedor?.nombre || "Sin vendedor"}</td>
                <td>
                  <button onClick={() => handleOpenModal(cliente)}>
                    editar
                  </button>
                  <button onClick={() => handleEliminar(cliente.id)}>
                    eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && (
        <EditarClienteModal
          cliente={selectedCliente}
          onClose={handleCloseModal}
          onClienteActualizado={handleClienteActualizado}
        />
      )}
    </div>
  );
}
