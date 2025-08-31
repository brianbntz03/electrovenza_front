import { useEffect, useState } from "react";
import { apiRest } from "../service/apiRest"; 

export function Listadoproveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/proveedor/${id}`, {
        method: "DELETE",
      });
      console.log(`Proveedor con ${id} eliminado.`);

      const nuevosProveedores = proveedores.filter(
        (proveedor) => proveedor.id !== id
      );
      setProveedores(nuevosProveedores);
      localStorage.setItem("proveedores", JSON.stringify(nuevosProveedores));
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${apiRest}/proveedor`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProveedores(data);
      localStorage.setItem("proveedores", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching proveedores:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedProveedores = localStorage.getItem("proveedores");
    if (storedProveedores) {
      setProveedores(JSON.parse(storedProveedores));
      setLoading(false);
    } else {
      fetchProveedores();
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProveedores();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando Proveedores...</p>
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
  if (!proveedores || proveedores.length === 0) {
    return <div className="error-container">No hay proveedores registrados</div>;
  }

  return (
    <div className="card-body">
      <p>Listado de los proveedores</p>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Telefono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={index}>
              <td>{proveedor.id}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>
                <button
                  className="link-button"
                  onClick={() => handleEliminar(proveedor.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className="text-center">
              Total de proveedores: {proveedores.length}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
