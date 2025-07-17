import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest } from "../../service/apiRest";


export const CrearVendedor = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleRetry = () => {
    setLoading(false);
    setError(null);
    setButton(false);
  };
  useEffect(() => {
    //MostrarAlerta();
  }, []);

  const MostrarAlerta = () => {
    Swal.fire({
      title: "Creación de Vendedor",
      text: "el vendedor fue creada",
      icon: "success",
      draggable: true,
      timer: 1000,
    }).then(() => {
      window.location.href = "/vendedores";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Corregido el endpoint - asegúrate de que esta URL sea correcta para tu API
      const response = await fetch(`${apiRest}/vendedor`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, direccion, telefono }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Categoría creada:", data);
      MostrarAlerta();
      setButton(true);
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
          <h3 class="card-title">Crear Vendedor</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <div class="card-body">
            <div className="form-group">
              <label for="exampleInputName">
                Nombre :
                </label>
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
              <label for="exampleInputDescription">
              Direccion :
              </label>
              <input
               class="form-control"  
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                type="text"
                name="direccion"
                required
              />
            </div>
           <div class="form-group">
              <label for="exampleInputDescription">
              Telefono :
              </label>
              <input
               class="form-control"  
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                type="text"
                name="telefono"
                required
              />
            </div>

            <div class="card-footer">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Vendedor"}
            </button>  
            </div>      
          </div>
        </form>
      </div>
    </>
  );
};
