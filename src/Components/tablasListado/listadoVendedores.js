import React, { useEffect, useState } from "react";
import { EditarVendedorModal } from "../modals/EditarVendedorModal";
import Swal from "sweetalert2";
import { apiRest } from "../../service/apiRest";

export const ListadoVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState(null);

  const handleOpenModal = (vendedor) => {
    setSelectedVendedor(vendedor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVendedor(null);
    setIsModalOpen(false);
  };

  const handleVendedorActualizado = async () => {
    await fetchVendedores();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiRest}/vendedor/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el vendedor");
      }
      await fetchVendedores();
    } catch (error) {
      console.error("Error al eliminar el vendedor:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al eliminar el vendedor.",
        "error"
      );
    }
  };

  const fetchVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`, {
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
      const activeVendedores = data.filter((vendedor) => vendedor.activo);
      setVendedores(activeVendedores);
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        "No se pudo conectar con el servidor. Por favor, inténtelo de nuevo más tarde."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchVendedores();
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando vendedores...</p>
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

  if (!vendedores || vendedores.length === 0) {
    return (
      <div className="error-container">
        <h3>No hay vendedores disponibles</h3>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body table-responsive p-0">
        <table className="table table-striped table-valign-middle table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Username</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor) => (
              <tr key={vendedor.id}>
                <td>{vendedor.nombre}</td>
                <td>{vendedor.direccion}</td>
                <td>{vendedor.telefono}</td>
                <td>{vendedor.correo}</td> {/* ✅ Corregido aquí */}
                <td>{vendedor.username}</td>
                <td>
                  <button onClick={() => handleOpenModal(vendedor)} className="btn btn-primary btn-sm mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(vendedor.id)} className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <EditarVendedorModal
            vendedor={selectedVendedor}
            onClose={handleCloseModal}
            onVendedorActualizado={handleVendedorActualizado}
          />
        )}
      </div>
    </div>
  );
};