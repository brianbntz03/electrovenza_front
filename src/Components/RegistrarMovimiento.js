import { useState } from "react";
import { apiRest } from "../service/apiRest";

export function RegistrarMovimieto() {
  const [vendedor, setVendedor] = useState();
  const [nombre, setNombre] = useState();
  const [signo, setSigno] = useState();
  const [internal, setInternal] = useState();
  const [tipoMovimiento, setTipoMovimiento] = useState();
  const [monto, setMonto] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState();

  const handleRetry = () => {
    setLoading(false);
    setError(null);
    setButton(false);
  };
  useState(() => {
    //MostrarAlerta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
try {
        const response = fetch(`${apiRest}/tipo-movimiento`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, signo, internal }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Producto creado:", data);
      setButton(true);
      setLoading(false);
    }catch (error) {
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
if(error){
    return (
        <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Intentar nuevamente
        </button>
      </div>
    )
}
  
  
    return (
    <div className="card card-primary">
      <div className="row">
        <div className="col-md-4">vendedor</div>
        <div className="col-md-8">
          <select
          type="text"
          class ="form-control"
          value={vendedor}
          onChange={(e) => setNombre(e.target.value)}
          name="vendedor"
          required
        >
        <option value=""> seleccionar vendedor</option>
        {Array.isArray(nombre) &&
          nombre.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
          </select>
        </div>
        <div className="col-md-4"> tipo de movimento</div>
        <div className="col-md-8">
          <select 
          type="text"
          class ="form-control"
          value={tipoMovimiento}
          onChange={(e) => setTipoMovimiento(e.target.value)}
          name="tipoMovimiento"
          required
        >
          </select>
        </div>
        <div className="col-md-4">monto</div>
        <div className="col-md-8"><input type="text"/>$</div>
        <div className="col-md-4"><button >Guardar</button></div>
      </div>
    </div>
  );
}
