import React from "react";
import { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { EditarCategoriaModal } from "../modals/EditarCategoriaModal";

export function ListadoCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCategoria, setSelectCategoria] = useState(null);

  const handleOpenModal = (categoria) => {
    setSelectCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectCategoria(null);
    setIsModalOpen(false);
  }

  const handleCategoriaActualizado = (categoriaActualizada) => {
    const nuevasCategorias = categorias.map((categoria) =>
      categoria.id === categoriaActualizada.id ? categoriaActualizada : categoria
    ); 
    setCategorias(nuevasCategorias);
    localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
  }
 
   
  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/categoria/${id}`, {
        method: "DELETE",
      });
      console.log(`Producto con id ${id} eliminado. `);
      const nuevasCategorias = categorias.filter(
        (categoria) => categoria.id !== id
      );
      setCategorias(nuevasCategorias);
      localStorage.setItem("categorias", JSON.stringify(nuevasCategorias));
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${apiRest}/categoria`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Categorias desde la api:", data);
      setCategorias(data);
      localStorage.setItem("categorias", JSON.stringify(data));
    } catch (error) {
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storeCategorias = localStorage.getItem("categorias");
    if (storeCategorias) {
      setCategorias(JSON.parse(storeCategorias));
      setLoading(false);
    } else {
      fetchCategorias();
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchCategorias();
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando categorias...</p>
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
  if (!categorias || categorias.length === 0) {
    return (
      <div className="error-container">
        <h3>No hay categorias disponibles</h3>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body table-responsive p-0">
        <table className="table table-striped table-valign-middle table-bordered">
          <tr>
            <th> id </th>
            <th> nombre </th>
            <th> descripcion </th>
            <th> activo </th>
            <th> </th>
          </tr>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td> {categoria.id} </td>
              <td> {categoria.nombre} </td>
              <td> {categoria.descripcion} </td>
              <td> {categoria.activo} </td>
              <td>
                <button
                  className="link-button"
                  onClick={() => handleOpenModal(categoria)}
                >
                  editar
                </button>
                <button
                  className="link-button"
                  onClick={() => handleEliminar(categoria.id)}
                >
                  eliminar
                </button>
              </td>
            </tr>
          ))}
        </table>
        {isModalOpen && (
          <EditarCategoriaModal
            categoria={selectCategoria}
            onClose={handleCloseModal}
            onCategoriaActualizada={handleCategoriaActualizado}
          />
        )}
      </div>
    </div>
  );
}
