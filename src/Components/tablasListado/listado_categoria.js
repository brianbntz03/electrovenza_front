import React from "react";
import { useEffect, useState } from "react";
import { EditarCategoriaModal } from "../modals/EditarCategoriaModal";
import { apiRest } from "../../service/apiRest";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export function ListadoCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCategoria, setSelectCategoria] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

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
      await authenticatedFetch(`${apiRest}/categoria/${id}`, {
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
      const response = await authenticatedFetch(`${apiRest}/categoria`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      const categoriasArray = Array.isArray(data) ? data : []; 
      
      console.log("Categorias desde la api:", categoriasArray);
      setCategorias(categoriasArray);
      localStorage.setItem("categorias", JSON.stringify(categoriasArray));
      setCurrentPage(1); 
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchCategorias();
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentCategorias = categorias.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(categorias.length / itemsPerPage);
  
  const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
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
  
  const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
      }
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
        <p>{error.message}</p>
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
          <thead>
            <tr>
              <th> id </th>
              <th> nombre </th>
              <th> descripcion </th>
              <th> activo </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {currentCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td> {categoria.id} </td>
                <td> {categoria.nombre} </td>
                <td> {categoria.descripcion} </td>
                <td> {categoria.activo ? 'Sí' : 'No'} </td> {/* Display boolean more clearly */}
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
          </tbody>
        </table>

        {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-3">
                <ul className="pagination justify-content-center"> 
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a 
                            className="page-link" 
                            href="#!" 
                            onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }}
                        >
                            &laquo; Anterior
                        </a>
                    </li>

                    {pageNumbers.map(number => (
                        <li 
                            key={number} 
                            className={`page-item ${number === currentPage ? 'active' : ''}`}
                        >
                            <a 
                                className="page-link" 
                                href="#!" 
                                onClick={(e) => { e.preventDefault(); goToPage(number); }}
                            >
                                {number}
                            </a>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a 
                            className="page-link" 
                            href="#!" 
                            onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }}
                        >
                            Siguiente &raquo;
                        </a>
                    </li>
                </ul>
            </nav>
        )}

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