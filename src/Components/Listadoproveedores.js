import { useEffect, useState } from "react";
import { apiRest } from "../service/apiRest"; 
import { authenticatedFetch } from "../utils/authenticatedFetch";

export function Listadoproveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEliminar = async (id) => {
    try {
      await authenticatedFetch(`${apiRest}/proveedor/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
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
      const response = await authenticatedFetch(`${apiRest}/proveedor`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
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
    fetchProveedores();
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
