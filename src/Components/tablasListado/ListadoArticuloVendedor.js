import Swal from "sweetalert2";
import { apiRest } from "../../service/apiRest";
import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export function ListadoArticulosVendedor() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [articulosLoading, setArticulosLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${apiRest}/articulos?page=1&limit=100000`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();

      const productosArray = Array.isArray(data) ? data : [];

      setProductos(productosArray);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await authenticatedFetch(`${apiRest}/articulos/${id}`, {
        method: "DELETE",
      });

      const nuevosProductos = productos.filter(
        (productos) => productos.id !== id
      );
      setProductos(nuevosProductos);
      localStorage.setItem("clientes", JSON.stringify(nuevosProductos));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleRetry = () => {
    setError(null);
    fetchProductos();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //const currentProductos = productos.slice(indexOfFirstItem, indexOfLastItem);
  const currentProductos = productos;

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

  const handleSearch = async (busqueda) => {
    setArticulosLoading(true);
    try {
      if (!busqueda.trim()) {
        await fetchProductos();
        return;
      }

      const url = `${apiRest}/articulos/find`;
      const options = {
        method: "POST",
        body: JSON.stringify({ patron: busqueda }),
      };

      const response = await authenticatedFetch(url, options);

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.status}`);
      const { data: listadoArticulos } = await response.json();

      const articulosConCategoria = listadoArticulos.map((articulo) => {
        if (!articulo.categoria) {
          return { ...articulo, categoria: { nombre: "Sin categoría" } };
        } else if (typeof articulo.categoria === "string") {
          return { ...articulo, categoria: { nombre: articulo.categoria } };
        } else if (articulo.categoria && articulo.categoria.descripcion) {
          return {
            ...articulo,
            categoria: { nombre: articulo.categoria.descripcion },
          };
        } else if (articulo.categoria && articulo.categoria.nombre) {
          return articulo;
        } else if (articulo.categoria && articulo.categoria.id) {
          return {
            ...articulo,
            categoria: {
              ...articulo.categoria,
              nombre: `Categoría ${articulo.categoria.id}`,
            },
          };
        }
        return articulo;
      });

      setProductos(articulosConCategoria);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3001: ${error.message}`
      );
    } finally {
      setArticulosLoading(false);
    }
  };

  const pageNumbers = getPageNumbers();

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  function FormArticulos() {
    const [busqueda, setBusqueda] = useState("");
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(busqueda);
        }}
        style={{
          marginBottom: "10px",
        }}
      >
        <div className="row">
          <div className="col-md-2">
            <label style={{ marginRight: "5px" }}>Buscar artículo</label>
          </div>
          <div className="col-md-3 input-group">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-control"
            />
            <span className="input-group-append">
              <button type="submit" className="btn btn-sm btn-info">
                Buscar
              </button>
            </span>
          </div>
        </div>
      </form>
    );
  }

  const RenderContent = () => {
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
    if (articulosLoading) {
      return (
        <div className="loading-container">
          <p>Buscando productos...</p>
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
                <th></th>
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
                  <td>
                    <a
                      href={`${apiRest}/articulos/${producto.id}/imagen`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`${apiRest}/articulos/${producto.id}/imagen`}
                        width={100}
                        alt={producto.nombre}
                      ></img>
                    </a>
                  </td>
                  <td>
                    <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      Swal.fire({
                        title: '¿estás seguro?',
                        text:  `¿Deseas eliminar al producto ${producto.nombre}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                      }).then((result) => {
                        if (result.isConfirmed){
                          eliminarProducto(producto.id);
                        }
                      });
                    }}
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
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                  >
                    &laquo; Anterior
                  </a>
                </li>

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
                        goToPage(number);
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
                      goToPage(currentPage + 1);
                    }}
                  >
                    Siguiente &raquo;
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <FormArticulos />
      <RenderContent />
    </div>
  );
}
