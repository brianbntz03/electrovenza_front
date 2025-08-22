import { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { EditarVendedorModal } from "../modals/EditarVendedorModal";

export function ListadoVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleVendedorActualizado = (vendedorActualizado) => {
    const nuevosVendedores = vendedores.map((v) =>
      v.id === vendedorActualizado.id ? { ...v, ...vendedorActualizado } : v
    );
    setVendedores(nuevosVendedores);
    localStorage.setItem("vendedores", JSON.stringify(nuevosVendedores));
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/vendedor/${id}`, {
        method: "DELETE",
      });
      console.log(`Vendedor con ${id} eliminado.`);

      const nuevosVendedores = vendedores.filter(
        (vendedor) => vendedor.id !== id
      );
      setVendedores(nuevosVendedores);
      localStorage.setItem("vendedores", JSON.stringify(nuevosVendedores));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const fetchVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Vendedores desde la API:", data);
      setVendedores(data);
      localStorage.setItem("vendedores", JSON.stringify(data));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /*const storedVendedores = localStorage.getItem("vendedores");
    if (storedVendedores) {
      setVendedores(JSON.parse(storedVendedores));
      setLoading(false);
    } else {
      fetchVendedores();
    }
      */
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
        <p>Cargando Vendedores...</p>
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
    return <div className="error-container">No hay vendedores registrados</div>;
  }

  return (
    <div class="card-body">
      <p>Listado de vendedores</p>

      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Direccion</th>
            <th>Saldo CC</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map((vendedor, index) => (
            <tr key={index}>
              <td>{vendedor.nombre}</td>
              <td>{vendedor.telefono}</td>
              <td>{vendedor.direccion}</td>
              <td>{vendedor.cuentaCorriente?.saldo ?? 0}</td>
              <td>
                <button
                  className="link-button"
                  onClick={() => handleOpenModal(vendedor)}
                >
                  Editar
                </button>
                <button
                  className="link-button"
                  onClick={() => handleEliminar(vendedor.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {/* Placeholder row for consistent table structure */}
          <tr>
            <td colSpan="4" className="text-center">
              Total de vendedores: {vendedores.length}
            </td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <EditarVendedorModal
          vendedor={selectedVendedor}
          onClose={handleCloseModal}
          onVendedoresActualizado={handleVendedorActualizado}
        />
      )}
    </div>
  );
}
