import React, { useState, useEffect, useMemo } from "react";
import { apiRest } from "../service/apiRest";
import { EditarClienteModal } from "./modals/EditarClienteModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";

export function ListadoClientesFiltradoVendedor({
  vendedorId,
  onRefresh,
} = {}) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const handleClienteCreado = () => {
    fetchClientes();
  };

  useEffect(() => {
    if (onRefresh) {
      window.refreshClientList = handleClienteCreado;
    }
    return () => {
      if (window.refreshClientList) {
        delete window.refreshClientList;
      }
    };
  }, [onRefresh]);

  const handleEliminar = async (id) => {
    try {
      console.log(`Intentando eliminar cliente con ID: ${id}`);

      const response = await fetch(`${apiRest}/cliente/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      console.log(
        `Respuesta del servidor: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error del servidor: ${errorText}`);
        throw new Error(
          `Error ${response.status}: ${errorText || response.statusText}`
        );
      }

      // Refrescar desde el servidor para verificar eliminación
      await fetchClientes();

      Swal.fire({
        icon: "success",
        title: "Eliminación procesada",
        text: "Se procesó la eliminación. La lista se actualizó desde el servidor.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: `No se pudo eliminar el cliente: ${error.message}`,
        confirmButtonText: "Entendido",
      });
    }
  };

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${apiRest}/cliente`;

      const response = await fetch(apiUrl, {
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

      const clientsArray = Array.isArray(data) ? data : [];
      setClientes(clientsArray);
      localStorage.setItem("clientes", JSON.stringify(clientsArray));
    } catch (error) {
      console.error("Detailed error:", error);
      setError(
        `No se pudo conectar con el servidor. Detalle: ${error.message}`
      );
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleRetry = () => {
    fetchClientes();
  };

  const filteredClients = useMemo(() => {
    let clientsToFilter = clientes;

    const userRole = localStorage.getItem("user_role");
    const currentUserId = localStorage.getItem("user_id");

    if (userRole === "vendedor" && currentUserId) {
      const vendedorId = localStorage.getItem("vendedor_id");
      clientsToFilter = clientsToFilter.filter((cliente) => {
        // Primero intenta con creado_por, si no existe usa vendedor_id
        const matchCreado = cliente.creado_por === parseInt(currentUserId);
        const matchVendedor = cliente.vendedor?.id === parseInt(vendedorId);
        const match =
          matchCreado || (cliente.creado_por === undefined && matchVendedor);
        return match;
      });
    } else if (vendedorId) {
      clientsToFilter = clientsToFilter.filter(
        (cliente) => cliente.vendedor?.id === vendedorId
      );
    }

    if (searchTerm) {
      clientsToFilter = clientsToFilter.filter(
        (c) =>
          c?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c?.dni?.toString().includes(searchTerm)
      );
    }

    return clientsToFilter;
  }, [clientes, vendedorId, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginatedClients = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredClients, currentPage, itemsPerPage]);

  const handleOnDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Use a copy of the currently filtered and paginated list for the drag logic
    const reorderedPaginatedClients = Array.from(paginatedClients);
    const [movedItem] = reorderedPaginatedClients.splice(source.index, 1);
    reorderedPaginatedClients.splice(destination.index, 0, movedItem);

    // Now, we need to map the new order back to the full `clientes` array.
    const newFullClientList = Array.from(clientes);
    const clientMap = new Map(newFullClientList.map((c) => [c.id, c]));

    const reorderedIds = reorderedPaginatedClients.map((c) => c.id);
    const nonFilteredClients = newFullClientList.filter(
      (c) => !filteredClients.some((fc) => fc.id === c.id)
    );
    const combinedList = [...reorderedPaginatedClients, ...nonFilteredClients];

    const finalOrderedClients = combinedList.map((c, index) => ({
      ...clientMap.get(c.id),
      orden: index,
    }));

    setClientes(finalOrderedClients);

    try {
      // Loop through the final ordered list and send one API call for each client
      for (const client of finalOrderedClients) {
        const payload = {
          id: client.id,
          orden: client.orden,
        };

        const response = await fetch(`${apiRest}/cliente/ordenar`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // Log the error and break the loop if a single request fails
          const errorBody = await response.json().catch(() => null);
          console.error("Error response status:", response.status);
          console.error(
            "Error response body:",
            JSON.stringify(errorBody, null, 2)
          );
          throw new Error("Error al guardar el nuevo orden");
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // Revert to the original state if any API call fails
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar el nuevo orden. Reviertiendo los cambios.",
      });
      setClientes(clientes); // Revert to the state before the drag-and-drop
    }
  };

  if (loading) {
    return (
      <div className="loading-container text-center py-5">
        <p>Cargando Clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container text-center py-5">
        <h3 className="text-danger">Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="btn btn-primary mt-3">
          Reintentar
        </button>
      </div>
    );
  }

  if (clientes.length === 0 && !loading) {
    return (
      <div className="error-container text-center py-5">
        No hay clientes registrados.
      </div>
    );
  }

  return (
    <div className="card-body">
      <div className="mb-3">
        <h2 className="card-title">Listado de Clientes</h2>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      {filteredClients.length > 0 ? (
        <>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <table className="table table-striped table-valign-middle table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>N°cliente</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Dirección del Local</th>
                  <th>Dirección de Casa</th>
                  <th>Teléfono 1</th>
                  <th>Teléfono 2</th>
                  <th>Rubro</th>
                  <th>Documento Frontal</th>
                  <th>Documento Dorsal</th>
                  <th>Servicio 1</th>
                  <th>servicio 2</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <Droppable droppableId="clientes">
                {(provided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {paginatedClients.map((cliente, index) => (
                      <Draggable
                        key={cliente.id}
                        draggableId={cliente.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <td {...provided.dragHandleProps}>
                              <span className="btn btn-tool btn-sm">
                                <i className="fas fa-bars"></i>
                              </span>
                            </td>
                            <td>{cliente.id_formatted}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.dni}</td>
                            <td>{cliente.direccion_local}</td>
                            <td>{cliente.direccion_casa}</td>
                            <td>{cliente.telefono1}</td>
                            <td>{cliente.telefono2}</td>
                            <td>{cliente.rubro}</td>
                            <td>
                              <img
                                src={`${apiRest}/cliente/${cliente.id}/imagen/documento_frente`}
                                width={100}
                                alt=""
                                style={{ cursor: "pointer" }}
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
                                alt=""
                                style={{ cursor: "pointer" }}
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
                                src={`${apiRest}/cliente/${cliente.id}/imagen/servicio_1`}
                                width={100}
                                alt=""
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  window.open(
                                    `${apiRest}/cliente/${cliente.id}/imagen/servicio_1`,
                                    "_blank"
                                  )
                                }
                              ></img>
                            </td>
                            <td>
                              <img
                                src={`${apiRest}/cliente/${cliente.id}/imagen/servicio_2`}
                                width={100}
                                alt=""
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  window.open(
                                    `${apiRest}/cliente/${cliente.id}/imagen/servicio_2`,
                                    "_blank"
                                  )
                                }
                              ></img>
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleOpenModal(cliente)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  Swal.fire({
                                    title: "¿Estás seguro?",
                                    text: `¿Deseas eliminar al cliente ${cliente.nombre}?`,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#d33",
                                    cancelButtonColor: "#3085d6",
                                    confirmButtonText: "Sí, eliminar",
                                    cancelButtonText: "Cancelar",
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      handleEliminar(cliente.id);
                                    }
                                  });
                                }}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
          {isModalOpen && (
            <EditarClienteModal
              cliente={selectedCliente}
              onClose={handleCloseModal}
              onClienteActualizado={handleClienteActualizado}
            />
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p>
              Mostrando {paginatedClients.length} de {filteredClients.length}{" "}
              clientes.
            </p>
            {totalPages > 1 && (
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Anterior
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        i + 1 === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p>No se encontraron clientes con ese criterio de búsqueda.</p>
          <p>
            <small>Total de clientes en BD: {clientes.length}</small>
          </p>
        </div>
      )}
    </div>
  );
}
