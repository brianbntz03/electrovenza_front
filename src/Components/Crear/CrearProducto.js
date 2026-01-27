import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioMayorista, setPrecioMayorista] = useState(0);
  const [stock, setStock] = useState(0);
  const [idCategoria, setIdCategoria] = useState(0);
  const [porcentajeComisionVendedor, setPorcentajeComisionVendedor] = useState(0);
  const [porcentajeComisionMayorista, setPorcentajeComisionMayorista] = useState(0);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
  };
  useEffect(() => {
    //MostrarAlerta();
  }, []);

  const MostrarAlerta = () => {
    Swal.fire({
      title: "Creación de Producto",
      text: "El producto fue creado",
      icon: "success",
      draggable: true,
      timer: 1000,
    }).then(() => {
      window.location.href = `${publicUrl}/productosListado`;
    });
  };

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await authenticatedFetch(`${apiRest}/categoria`, {
          method: "GET",
        });
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setError("No se pudieron cargar las categorías.");
      }
    };

    obtenerCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear producto con JSON
      const response = await authenticatedFetch(`${apiRest}/articulos`, {
        method: "POST",
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          precio_mayorista: precioMayorista,
          precio_compra: precioCompra,
          stock,
          idCategoria,
          porcentaje_comision_vendedor: porcentajeComisionVendedor,
          porcentaje_comision_mayorista: porcentajeComisionMayorista,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Si hay imagen, subirla por separado
      if (imagen && data.id) {
        const formData = new FormData();
        formData.append('imagen', imagen);
        
        await authenticatedFetch(`${apiRest}/articulos/${data.id}/imagen`, {
          method: "POST",
          body: formData,
        });
      }
      
      console.log("Producto creado:", data);
      MostrarAlerta();
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando categorías...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <>
      <div class="card card-primary">
        <div class="card-header">
          <h3 class="card-title">Crear Productos</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <div class="card-body">
            <div className="form-group">
              <label for="exampleInputName">Nombre :</label>
              <input
                class="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                name="nombre"
                required
              />
            </div>
            <div class="form-group">
              <label for="exampleInputDescription">Descripcion</label>
              <input
                class="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                name="descripcion"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="exampleInputDescription">Precio minorista</label>
              <input
                class="form-control"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                type="text"
                name="precio"
                required
                min={1}
                step="any"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">Precio mayorista</label>
              <input
                class="form-control"
                value={precioMayorista}
                onChange={(e) => setPrecioMayorista(Number(e.target.value))}
                type="text"
                name="precioMayorista"
                required
                min={1}
                step="any"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">Precio Compra</label>
              <input
                class="form-control"
                value={precioCompra}
                onChange={(e) => setPrecioCompra(Number(e.target.value))}
                type="text"
                name="precio_compra"
                required
                min={1}
                step="any"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">Stock</label>
              <input
                class="form-control"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                type="text"
                name="stock"
                required
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">% Comision vendedor</label>
              <input
                class="form-control"
                value={porcentajeComisionVendedor}
                onChange={(e) => setPorcentajeComisionVendedor(Number(e.target.value))}
                type="text"
                name="porcentaje_comision_Vendedor"
                required
                min={0.1}
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">% Comision vendedor mayorista</label>
              <input
                class="form-control"
                value={porcentajeComisionMayorista}
                onChange={(e) => setPorcentajeComisionMayorista(Number(e.target.value))}
                type="text"
                name="porcentaje_comision_Mayorista"
                required
                min={0.1}
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">categoria</label>
              <select
                type="text"
                class="form-control"
                value={idCategoria}
                onChange={(e) => setIdCategoria(Number(e.target.value))}
                name="idCategoria"
                required
              >
                <option value=""> selecciona una categoria </option>
                {Array.isArray(categorias) &&
                  categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div class="form-group">
              <label for="imagen">Imagen</label>
              <input
                class="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                name="imagen"
              />
            </div>
            <div class="card-footer">
              <button type="submit" class="btn btn-primary" disabled={loading}>
                {loading ? "Creando..." : "Crear Producto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
