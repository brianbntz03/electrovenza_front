import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";
import { EditarClienteModal } from "../modals/EditarClienteModal";
import FlashMessageConfirm from "../tiny/ConfirmMessage";

const PLACEHOLDER_URL =
  "https://placehold.co/100x100/eeeeee/333333?text=Sin+Foto";

export function ListadoClientes() {
  const [allClientes, setAllClientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_URL) {
      e.target.onerror = null;
      e.target.src = PLACEHOLDER_URL;
    }
  };

  const handleOpenModal = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(false);
  };

  const handleClienteActualizado = (clienteActualizado) => {
    const nuevosClientes = allClientes.map((c) =>
      c.id === clienteActualizado.id ? { ...c, ...clienteActualizado } : c
    );
    setAllClientes(nuevosClientes);
  };

  const handleEliminar = async (id) => {
    const response = await FlashMessageConfirm("Desea eliminar este cliente?", "Desea eliminar este cliente? Esta acción no se puede deshacer.");
        if(!response){
          return ; 
        }

    try {
      await fetch(`${apiRest}/cliente/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      console.log(`Producto con id ${id} eliminado. `);

      const nuevosClientes = allClientes.filter((cliente) => cliente.id !== id);
      setAllClientes(nuevosClientes);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const currentCliente = clientes;

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${apiRest}/cliente`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllClientes(data);
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

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allClientes.slice(indexOfFirstItem, indexOfLastItem);
    setClientes(currentItems);
  }, [currentPage, itemsPerPage, allClientes]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchClientes();
  };

  const totalPages = Math.ceil(allClientes.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 100;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

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
  if (allClientes.length === 0 && !loading) {
    return <div className="error-container">No hay clientes registrados</div>;
  }

  return (
    <div className="card-body">
      <p>Listado de Clientes</p>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>N°cliente</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Dirección del Local</th>
            <th>Dirección de Casa</th>
            <th>Teléfono 1</th>
            <th>Teléfono 2</th>
            <th>Rubro</th>
            <th>Vendedor</th>
            <th>Documento Frente</th>
            <th>Documento Dorso</th>
            <th>Servicio 1</th>
            <th>Servicio 2</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCliente.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id_formatted}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.dni}</td>
              <td>{cliente.direccion_local}</td>
              <td>{cliente.direccion_casa}</td>
              <td>{cliente.telefono1}</td>
              <td>{cliente.telefono2}</td>
              <td>{cliente.rubro}</td>
              <td>{cliente.vendedor?.nombre || "Sin vendedor"}</td>
              <td>
                <img
                  src={`${apiRest}/cliente/${cliente.id}/imagen/documento_frente`}
                  width={100}
                  alt="Documento Frente"
                  onError={handleImageError}
                  onClick={() =>
                    window.open(
                      `${apiRest}/cliente/${cliente.id}/imagen/documento_frente`,
                      "_blank"
                    )
                  }
                ></img>
              </td>
              <td>
                <img
                  src={`${apiRest}/cliente/${cliente.id}/imagen/documento_dorso`}
                  width={100}
                  alt="Documento Dorso"
                  onError={handleImageError}
                  onClick={() =>
                    window.open(
                      `${apiRest}/cliente/${cliente.id}/imagen/documento_dorso`,
                      "_blank"
                    )
                  }
                ></img>
              </td>
              <td>
                <img
                  src={`${apiRest}/cliente/${cliente.id}/imagen/servicio1`}
                  width={100}
                  alt="Servicio 1"
                  onError={handleImageError}
                  onClick={() =>
                    window.open(
                      `${apiRest}/cliente/${cliente.id}/imagen/servicio1`,
                      "_blank"
                    )
                  }
                ></img>
              </td>
              <td>
                <img
                  src={`${apiRest}/cliente/${cliente.id}/imagen/servicio2`}
                  width={100}
                  alt="Servicio 2"
                  onError={handleImageError} 
                  onClick={() =>
                    window.open(
                      `${apiRest}/cliente/${cliente.id}/imagen/servicio2`,
                      "_blank"
                    )
                  }
                ></img>
              </td>
              <td>
                <button onClick={() => handleOpenModal(cliente)}>editar</button>
                <button onClick={() => handleEliminar(cliente.id)}>
                  eliminar
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="14" className="text-center">
              Total de clientes: {allClientes.length}
            </td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <EditarClienteModal
          cliente={selectedCliente}
          onClose={handleCloseModal}
          onClienteActualizado={handleClienteActualizado}
        />
      )}
      {totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-3">
          <ul className="pagination justify-content-center">
            {/* Botón Anterior */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a
                className="page-link"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage - 1);
                }}
              >
                &laquo; Anterior
              </a>
            </li>

            {/* Números de Página */}
            {pageNumbers.map((number) => (
              <li
                key={number}
                className={`page-item ${
                  number === currentPage ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(number);
                  }}
                >
                  {number}
                </a>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage + 1);
                }}
              >
                Siguiente &raquo;
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
