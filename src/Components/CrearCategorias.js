import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const CrearCategorias = () => {
  const [ nombre, setNombre ] = useState("");
  const [ descripcion, setDescripcion ] = useState("");
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ button, setButton ] = useState(false);
  
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
      title: "Creación de Categoría",
      text: "la categoria fue creada",
      icon: "success",
      draggable: true,
      timer: 1000,
    }).then(()=>{
      window.location.href = "/categorias";
    });

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Corregido el endpoint - asegúrate de que esta URL sea correcta para tu API
      const response = await fetch('http://localhost:3001/categoria', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion })
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
      setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
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
      <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
        <label>
          Nombre :
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            name="nombre"
            style={{
              marginLeft: "10px", marginRight: "10px"
              , backgroundColor: "white", color: "black"
              , borderRadius: "5px", padding: "5px"
              , border: "1px solid black"
              , width: "300px"
              , height: "30px"
              , fontSize: "20px"
            }}
            required
          />
        </label><br />
        <label>
          Descripcion :
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            type="text"
            name="descripcion"
            style={{
              marginLeft: "10px", marginRight: "10px"
              , backgroundColor: "white", color: "black"
              , borderRadius: "5px", padding: "5px"
              , border: "1px solid black"
              , width: "300px"
              , height: "30px"
              , fontSize: "20px"
            }}
            required
          />
        </label>
        <br />
        <button
        
        type="submit" 
        className="btn btn-sm btn-info"
        disabled={loading}
        style={{
            marginLeft: "10px", marginRight: "10px"
            , borderRadius: "5px", padding: "5px"
            , border: "1px solid black"
            , width: "200px"
            , height: "40px"
            , fontSize: "20px"
          }}
        >
          {loading ? 'Creando...' : 'Crear categoría'}
        </button>
      </form>
    </>
  )
}
