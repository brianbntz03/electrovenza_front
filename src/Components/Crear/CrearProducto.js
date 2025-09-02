import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiRest } from "../../service/apiRest";

export const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioMayorista, setPrecioMayorista] = useState(0);
  const [idCategoria, setIdCategoria] = useState(0);
  const [porcentajeComisionVendedor, setPorcentajeComisionVendedor] = useState(0);
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
      window.location.href = "/productosListado";
    });
  };

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await fetch(`${apiRest}/categoria`);
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
      const response = await fetch(`${apiRest}/articulos`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, descripcion, precio, precio_mayorista: precioMayorista, idCategoria,porcentaje_comision_vendedor: porcentajeComisionVendedor }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
              />
            </div>

            <div class="form-group">
              <label for="exampleInputDescription">% Comision vendedor</label>
              <input
                class="form-control"
                value={porcentajeComisionVendedor}
                onChange={(e) => setPorcentajeComisionVendedor(Number(e.target.value))}
                type="text"
                name="porcentajeComisionVendedor"
                required
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
