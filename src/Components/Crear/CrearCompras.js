import { useState, useEffect } from "react";
import { publicUrl, apiRest } from "../../service/apiRest";
import FlashMessage from "../tiny/FlashMessage";

export const CrearCompras = () => {
  const [proveedorId, setProveedorId] = useState("");
  const [articulos, setArticulos] = useState([{ id: "", cantidad: "", precio: "" }]);
  const [proveedores, setProveedores] = useState([]);
  const [articulosDisponibles, setArticulosDisponibles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    fetchProveedores();
    fetchArticulos();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${apiRest}/proveedor`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`${apiRest}/articulos?page=1&limit=10000000`);
      const { data } = await response.json();
      setArticulosDisponibles(data);
    } catch (error) {
      console.error("Error fetching articulos:", error);
    }
  };

  const agregarArticulo = () => {
    setArticulos([...articulos, { id: "", cantidad: "", precio: "" }]);
  };

  const eliminarArticulo = (index) => {
    setArticulos(articulos.filter((_, i) => i !== index));
  };

  const actualizarArticulo = (index, campo, valor) => {
    const nuevosArticulos = [...articulos];
    nuevosArticulos[index][campo] = valor;
    setArticulos(nuevosArticulos);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const articulosValidos = articulos.filter(art => art.id && art.cantidad && art.precio);
    
    const compraData = {
      proveedorId: parseInt(proveedorId),
      articulos: articulosValidos.map(art => ({
        id: parseInt(art.id),
        cantidad: parseInt(art.cantidad),
        precio: parseFloat(art.precio)
      }))
    };

    try {
      const response = await fetch(`${apiRest}/compra`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      FlashMessage("", "Compra creada exitosamente", 2000, "success", "compras-listado");
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(`Error al crear la compra: ${error.message}`);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando compra...</p>
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
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Crear Compra</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
        <div className="card-body">
          <div className="form-group">
            <label>Proveedor:</label>
            <select 
              className="form-control"
              value={proveedorId}
              onChange={(e) => setProveedorId(e.target.value)}
              required
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map(proveedor => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <h5>Artículos:</h5>
          {articulos.map((articulo, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-4">
                <select 
                  className="form-control"
                  value={articulo.id}
                  onChange={(e) => actualizarArticulo(index, 'id', e.target.value)}
                  required
                >
                  <option value="">Seleccionar artículo</option>
                  {articulosDisponibles.map(art => (
                    <option key={art.id} value={art.id}>
                      {art.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input 
                  className="form-control"
                  type="number"
                  placeholder="Cantidad"
                  value={articulo.cantidad}
                  onChange={(e) => actualizarArticulo(index, 'cantidad', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input 
                  className="form-control"
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  value={articulo.precio}
                  onChange={(e) => actualizarArticulo(index, 'precio', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                {articulos.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => eliminarArticulo(index)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-secondary mb-3"
            onClick={agregarArticulo}
          >
            Agregar Artículo
          </button>
        </div>
        
        <div className="card-footer">
          <button
            type="submit"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Compra"}
          </button>  
        </div>
      </form>
    </div>
  );
};
