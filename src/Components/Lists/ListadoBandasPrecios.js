import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";
import { ModalEditarBandasPrecios } from "../modals/ModalEditarBandasPrecios";
import FlashMessage from "../tiny/FlashMessage";
import FlashMessageConfirm from "../tiny/ConfirmMessage";

export function ListadoBandasPrecios() {
  const storageObjectName =  "colectivo";
  const urlObject = `${apiRest}/setting-escala-precios`;
  const titlePlural = "Bandas de precios";
  const titleSingular = "Banda";
  
  const [colectivo, setColectivo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  

  const handleOpenModal = (object) => {
    setSelectedObject(object);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedObject(null);
    setIsModalOpen(false);
  };

  const handleObjectActualizado = (objectActualizado) => {
    const nuevosObjects = colectivo.map((c) =>
      c.id === objectActualizado.id ? { ...c, ...objectActualizado } : c
    );
    setColectivo(nuevosObjects);
    localStorage.setItem(storageObjectName, JSON.stringify(nuevosObjects));
  };

  const handleEliminar = async (id) => {

    const response = await FlashMessageConfirm("Eliminar Banda","Seguro que desea eliminar la banda?");
    if (!response) {
      return;
    }

    try {
      await fetch(`${urlObject}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      console.log(`${titleSingular} con id ${id} eliminado. `);

      const nuevosObjects = colectivo.filter((object) => object.id !== id);
      setColectivo(nuevosObjects);
      localStorage.setItem(storageObjectName, JSON.stringify(nuevosObjects));
    } catch (error) {
      console.error(`Error al eliminar ${titleSingular}:`, error);
    }
  };

  const fetchColectivo = async () => {
    try {
      const response = await fetch(`${urlObject}`, {
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
      setColectivo(data);
      localStorage.setItem(storageObjectName, JSON.stringify(data));
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
    fetchColectivo();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchColectivo();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando {titlePlural}...</p>
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
  if (!colectivo || colectivo.length === 0) {
    return <div className="error-container">No hay ({titlePlural}) registrados</div>;
  }

  return (
    <div className="card-body">
      <p>Listado de {titlePlural}</p>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Banda superior</th>
            <th>Porcentaje Minorista</th>
            <th>Porcentaje Mayorista</th>
            <th>% Comision Minorista</th>
            <th>% Comision Mayorista</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {colectivo
            .map((object) => (
              <tr key={object.id}>
                <td>{object.descripcion}</td>
                <td>{object.banda_superior}</td>
                <td>{object.porcentaje_minorista}</td>
                <td>{object.porcentaje_mayorista}</td>
                <td>{object.porcentaje_comision_vendedor}</td>
                <td>{object.porcentaje_comision_mayorista}</td>
                <td>
                  <button onClick={() => handleOpenModal(object)}>
                    editar
                  </button>
                  <button onClick={() => handleEliminar(object.id)}>
                    eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && (
        <ModalEditarBandasPrecios
          object={selectedObject}
          onClose={handleCloseModal}
          onObjectActualizado={handleObjectActualizado}
        />
      )}
    </div>
  );
}
