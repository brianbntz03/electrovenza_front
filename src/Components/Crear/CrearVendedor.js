import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";

export const CrearVendedor = () => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('crearVendedorForm');
    if (savedData) {
      try {
        const { nombre, direccion, telefono, email, username, contraseña } = JSON.parse(savedData);
        setNombre(nombre || "");
        setDireccion(direccion || "");
        setTelefono(telefono || "");
        setEmail(email || "");
        setUsername(username || ""); 
        setContraseña(contraseña || "");
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }
  }, []);

  useEffect(() => {
    const formData = { nombre, direccion, telefono, email, username, contraseña }; 
    localStorage.setItem('crearVendedorForm', JSON.stringify(formData));
  }, [nombre, direccion, telefono, email, username, contraseña]);

  const handleRetry = () => {
    setError(null);
    setLoading(false);
  };

  const MostrarAlerta = () => {
    Swal.fire({
      title: "Éxito",
      text: "El vendedor fue creado correctamente",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      localStorage.removeItem('crearVendedorForm');
      window.location.href = `${publicUrl}/vendedores`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      username: username.trim(), 
      password: contraseña.trim(),
      role: "vendedor",
    };

    try {
      const response = await fetch(`${apiRest}/vendedor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      MostrarAlerta();
      setLoading(false);

    } catch (err) {
      console.error("Error creando vendedor:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Crear Vendedor</h3>
      </div>
      <form onSubmit={handleSubmit} className="card-body">
        {error && (
          <div
            className="alert alert-danger"
            onClick={handleRetry}
            style={{ cursor: "pointer" }}
          >
            <strong>Error:</strong> {error} (Click para reintentar)
          </div>
        )}

        <div className="form-group">
          <label>Nombre:</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre de usuario:</label>
          <input
            className="form-control"
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            className="form-control"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Vendedor"}
          </button>
        </div>
      </form>
    </div>
  );
};