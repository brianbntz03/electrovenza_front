import { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { EditarVendedorModal } from "../modals/EditarVendedorModal";
import { TipoVendedor } from "../../constants/tipoVendedor";


export function ListadoVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  
  // Estados para la Paginación del lado del Servidor
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100); 
  const [apiTotalItems, setApiTotalItems] = useState(0); 
  
  // --- LÓGICA DE MANEJO DE VENDEDORES ---

  const handleOpenModal = (vendedor) => {
    setSelectedVendedor(vendedor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVendedor(null);
    setIsModalOpen(false);
  };

  const handleVendedorActualizado = (vendedorActualizado) => {
    const safeVendedores = Array.isArray(vendedores) ? vendedores : [];
    
    const nuevosVendedores = safeVendedores.map((v) =>
      v.id === vendedorActualizado.id ? { ...v, ...vendedorActualizado } : v
    );
    setVendedores(nuevosVendedores);
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`${apiRest}/vendedor/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
      });
      console.log(`Vendedor con ${id} eliminado.`);

      // Refrescar la página actual después de eliminar
      fetchVendedores(); 
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const fetchVendedores = async () => {
    try {
      // URL para Paginación del Servidor
      const apiUrl = `${apiRest}/vendedor?page=${currentPage}&limit=${itemsPerPage}`;
      console.log("Fetching vendors from URL:", apiUrl);

      const response = await fetch(apiUrl,{
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
      console.log("Vendedores desde la API:", data);

      // **Extracción segura de datos y total** (Ajustar según la estructura de tu API)
      const vendorsArray = Array.isArray(data) ? data : data.data || []; 
      const totalItemsFromApi = data.totalItems || data.total || 0; 

      setVendedores(vendorsArray);
      setApiTotalItems(totalItemsFromApi); 
      
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // **Efecto para recargar al cambiar la página**
  useEffect(() => {
    fetchVendedores();
  }, [currentPage, itemsPerPage]);

  // --- LÓGICA DE PAGINACIÓN INTEGRADA Y RENDERIZADO ---

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchVendedores();
  };
  
  const safeVendedores = Array.isArray(vendedores) ? vendedores : [];
  const totalPages = Math.ceil(apiTotalItems / itemsPerPage);

  // Función para generar un array simple de números de página (puedes mejorar esta lógica si necesitas elipsis)
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

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando Vendedores...</p>
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
  if (apiTotalItems === 0 && !loading) {
    return <div className="error-container">No hay vendedores registrados</div>;
  }

  return (
    <div class="card-body">
      <p>Listado de vendedores</p>

      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Direccion</th>
            <th>Saldo CC</th>
            <th>Tipo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Mapea directamente sobre el array parcial del servidor */}
          {safeVendedores.map((vendedor) => (
            <tr key={vendedor.id}> 
              <td>{vendedor.id}</td>
              <td>{vendedor.nombre}</td>
              <td>{vendedor.telefono}</td>
              <td>{vendedor.direccion}</td>
              <td>{vendedor.cuentaCorriente?.saldo ?? 0}</td>
              <td>{TipoVendedor[vendedor.tipo] }</td>
              <td>
                <button
                  className="link-button"
                  onClick={() => handleOpenModal(vendedor)}
                >
                  Editar
                </button>
                <button
                  className="link-button"
                  onClick={() => handleEliminar(vendedor.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan="10" className="text-center">
              Total de vendedores: {apiTotalItems}
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* Modal ... */}
      {isModalOpen && selectedVendedor && (
        <EditarVendedorModal
          vendedor={selectedVendedor}
          onClose={handleCloseModal}
          onVendedoresActualizado={handleVendedorActualizado}
        />
      )}

      {/* --- CÓDIGO DE PAGINACIÓN INTEGRADO --- */}
      {totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-3">
          <ul className="pagination justify-content-center">
            {/* Botón Anterior */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a 
                className="page-link" 
                href="#!" 
                onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage - 1); }}
              >
                &laquo; Anterior
              </a>
            </li>

            {/* Números de Página */}
            {pageNumbers.map(number => (
              <li 
                key={number} 
                className={`page-item ${number === currentPage ? 'active' : ''}`}
              >
                <a 
                  className="page-link" 
                  href="#!" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(number); }}
                >
                  {number}
                </a>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a 
                className="page-link" 
                href="#!" 
                onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage + 1); }}
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