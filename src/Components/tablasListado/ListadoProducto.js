import React, { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { EditaProductoModal } from "../modals/EditarProductoMoral";

export function ListadoProducto() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const handleOpenModal = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProducto(null);
    setIsModalOpen(false);
  };

  const handleProductosActualizado = (productoActualizado) => {
    setProductos((prevProductos) => {
      const nuevosProductos = prevProductos.map((p) =>
        p.id === productoActualizado.id ? { ...p, ...productoActualizado } : p
      );
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
      return nuevosProductos;
    });
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/articulos/${id}`, {
        method: "DELETE",
      });
      console.log(`Producto con id ${id} eliminado. `);

      const nuevosProductos = productos.filter((producto) => producto.id !== id);
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${apiRest}/articulos`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();
      
      const productosArray = Array.isArray(data) ? data : []; 
      
      setProductos(productosArray);
      setLoading(false);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProductos();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProductos();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentProductos = productos.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(productos.length / itemsPerPage);
  
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
        <p>Cargando productos...</p>
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
  if (!productos || productos.length === 0) {
    return (
      <div className="error-container">
        <h3>No hay productos disponibles</h3>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="card-body table-responsive p-0">
        <table className="table table-striped table-valign-middle table-bordered">
          <thead>
            <tr>
              <th> # </th>
              <th> nombre </th>
              <th> categoria </th>
              <th> precio minorista </th>
              <th> precio mayorista </th>
              <th> % comision vendedor </th>
              <th> stock </th>
              <th> Img </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {currentProductos.map((producto) => (
              <tr key={producto.id}>
                <td> {producto.id} </td>
                <td> {producto.nombre} </td>
                <td> {producto.categoria?.nombre || "Sin categoría"} </td>
                <td> {producto.precio} </td>
                <td> {producto.precio_mayorista} </td>
                <td> {producto.porcentaje_comision_vendedor} </td>
                <td> {producto.stock} </td>
                <td><img src={`${apiRest}/articulos/${producto.id}/imagen`} width={100} alt=""></img></td>
                <td>
                  <button
                    onClick={() => handleOpenModal(producto)}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                  >
                    Eliminar
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
          <EditaProductoModal
            producto={selectedProducto}
            onClose={handleCloseModal}
            onProductosActualizado={handleProductosActualizado}
          />
        )}
      </div>
    </div>
  );
}