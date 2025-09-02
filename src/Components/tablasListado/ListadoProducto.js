import { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { EditaProductoModal } from "../modals/EditarProductoMoral";

export function ListadoProducto() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

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

      const data = await response.json();
      console.log(data);
      setProductos(data);
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
    /*
    //Nota: por ahora lo dejo comentado, quiero que al cargar la pagina tome de la base 
    // el listado de productos.
    const storedProductos = localStorage.getItem('productos');
    if (storedProductos) {
      setProductos(JSON.parse(storedProductos));
      setLoading(false);
    } else {
      fetchProductos();
    }
    */
    fetchProductos();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProductos();
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
          <tr>
            <th> # </th>
            <th> nombre </th>
            <th> categoria </th>
            <th> precio minorista </th>
            <th> precio mayorista </th>
            <th> % comision vendedor </th>
            <th> stock </th>
            <th> </th>
          </tr>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td> {producto.id} </td>
              <td> {producto.nombre} </td>
              <td> {producto.categoria?.nombre || "Sin categoría"} </td>
              <td> {producto.precio} </td>
              <td> {producto.precio_mayorista} </td>
              <td> {producto.porcentaje_comision_vendedor} </td>
              <td> {producto.stock} </td>
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
        </table>
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
