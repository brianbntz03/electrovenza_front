import { useState, useEffect } from "react";
import { apiRest, publicUrl } from "../../service/apiRest";
import FlashMessage from "../tiny/FlashMessage";


export const CrearCreditos = () => {
  const urlObject = `${apiRest}/cliente`;
  const urlRedirection = `${publicUrl}/clienteListado`;
  const titlePlural = "Clientes";
  const titleSingular = "Cliente";
  const storaObjectName =  "colectivo";

  const [dato1, setDato1] = useState("");
  const [dato2, setDato2] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
  };
  useEffect(() => {
  }, []);


  const ActualizarListadoEnLocalStorage = async() => {
    const response = await fetch(`${urlObject}`,
        {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
    );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(`${titlePlural} desde la api:`, data);
      localStorage.setItem(storaObjectName, JSON.stringify(data));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${urlObject}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(
          { dato1, dato2 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      ActualizarListadoEnLocalStorage()
      FlashMessage("","Creacion exitosa", 2000, "success", urlRedirection);
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
        <p>Cargando ({titlePlural})...</p>
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
          <h3 class="card-title">Crear ({titleSingular})</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <div class="card-body">
            <div className="form-group">
              <label for="exampleInputName">
                Dato 1 :
                </label>
                <input 
                  class="form-control"
                  value={dato1}
                  onChange={(e) => setDato1(e.target.value)}
                  type="text"
                  name="dato1"
                  required
                />
            </div>
            <div class="card-footer">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : `Crear ${titleSingular}`}
            </button>  
            </div>      
          </div>
        </form>
      </div>
    </>
  );
};
