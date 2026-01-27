import { apiRest } from "../service/apiRest";
import { useState, useEffect } from "react";
import { authenticatedFetch } from "../utils/authenticatedFetch";

export const Articulos = () => {
  const [articulos, setArticulos] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArticulos = async () => {
    try {
      const response = await authenticatedFetch(`${apiRest}/articulos`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setArticulos(data);
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
    fetchArticulos();
  }, []);
  // Función para reintentar la conexión
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchArticulos();
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando articulos...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Reintentar</button>
      </div>
    );
  }
  if (!articulos) {
    return (
      <div>
        <h3>No hay articulos disponibles</h3>
      </div>
    );
  }

  return (
    <div>
      <p>Listado de Articulos</p>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Activo</th>
          </tr>
        </thead>
        {articulos.map((articulo) => (
          <tr key={articulo.id}>
            <td>{articulo.nombre}</td>
            <td>{articulo.descripcion}</td>
            <td>{articulo.activo ? "Si" : "No"}</td>
          </tr>
        ))}
        <tfoot>
          <tr>
            <td colSpan="3">Total articulos: {articulos.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
