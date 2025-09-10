import { useState, useEffect } from "react";
import { apiRest, publicUrl } from "../../service/apiRest";
import FlashMessage from "../tiny/FlashMessage";


export const CrearBandasPrecios = () => {
  const urlObject = `${apiRest}/setting-escala-precios`;
  const urlRedirection = `SettingBandasPreciosListado`;
  const titlePlural = "Configuración para escala de precios";
  const titleSingular = "Escala";
  const storaObjectName =  "SettingEscalaPrecios";

  const [descripcion, setDescripcion] = useState("");
  const [bandaSuperior, setBandaSuperior] = useState(0);
  const [porcentajeMinorista, setPorcentajeMinorista] = useState(0);
  const [porcentajeMayorista, setPorcentajeMayorista] = useState(0);
  const [porcentajeComisionVendedor, setPorcentajeComisionVendedor] = useState(0);
  
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
  };
  useEffect(() => {
  }, []);


  const ActualizarListadoEnLocalStorage = async() => {
    const response = await fetch(`${urlObject}`);
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
        },
        body: JSON.stringify(
          { 
            descripcion,
            'banda_superior': Number(bandaSuperior), 
            'porcentaje_minorista': Number(porcentajeMinorista),
            'porcentaje_mayorista': Number(porcentajeMayorista),
            'porcentaje_comision_vendedor': Number(porcentajeComisionVendedor),
           }),
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
                Descripcion :
                </label>
                <input 
                  class="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  type="text"
                  name="descripcion"
                  required
                />
            </div>

            <div className="form-group">
              <label for="bandaSuperior">
                Banda Superior :
                </label>
                <input 
                  class="form-control"
                  value={bandaSuperior}
                  onChange={(e) => setBandaSuperior(e.target.value)}
                  type="text"
                  name="bandaSuperior"
                  required
                  placeholder="Ej: 15000"
                />
            </div>

             <div className="form-group">
              <label for="porcentajeMinorista">
                Porcentaje Minorista :
                </label>
                <input 
                  class="form-control"
                  value={porcentajeMinorista}
                  onChange={(e) => setPorcentajeMinorista(e.target.value)}
                  type="text"
                  name="porcentajeMinorista"
                  required
                  placeholder="10"
                />
            </div>

            <div className="form-group">
              <label for="porcentajeMayorista">
                Porcentaje Mayorista :
                </label>
                <input 
                  class="form-control"
                  value={porcentajeMayorista}
                  onChange={(e) => setPorcentajeMayorista(e.target.value)}
                  type="text"
                  name="porcentajeMayorista"
                  required
                  placeholder="10"
                />
            </div>

            <div className="form-group">
              <label for="porcentajeMayorista">
                Porcentaje Comision Vendedor :
                </label>
                <input 
                  class="form-control"
                  value={porcentajeComisionVendedor}
                  onChange={(e) => setPorcentajeComisionVendedor(e.target.value)}
                  type="text"
                  name="porcentajeComisionVendedor"
                  required
                  placeholder="10"
                />
            </div>

            <div class="card-footer">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear categoría"}
            </button>  
            </div>      
          </div>
        </form>
      </div>
    </>
  );
};
