import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";

export const CrearCliente = () => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [direccionlocal, setDireccionlocal] = useState("");
  const [direccioncasa, setDireccioncasa] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");

  const [listaVendedores, setListaVendedores] = useState([]); // ✅ lista de vendedores
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(""); // ✅ id del vendedor elegido

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState(false);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
    setButton(false);
  };

  const MostrarAlerta = () => {
    Swal.fire({
      title: "Creación de Cliente",
      text: "El cliente fue creado correctamente",
      icon: "success",
      timer: 1500,
    }).then(() => {
      window.location.href = `${publicUrl}/clientes`;
    });
  };

  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const response = await fetch(`${apiRest}/vendedor`);
        const data = await response.json();
        setListaVendedores(data);
      } catch (error) {
        console.error("Error al cargar vendedores:", error);
        setError("No se pudieron cargar los vendedores.");
      }
    };

    obtenerVendedores();
  }, []);

  const getNombreVendedorById = (id) => {
    const vend = listaVendedores.find((v) => v.id === parseInt(id));
    return vend ? vend.nombre : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const userId = localStorage.getItem("user_id");
      
      const response = await fetch(`${apiRest}/cliente`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          'dni': Number(dni),
          direccion_local: direccionlocal,
          direccion_casa: direccioncasa,
          'telefono1': Number(telefono1),
          'telefono2': Number(telefono2),
          vendedor_id: Number(vendedorSeleccionado),
          creado_por: Number(userId),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }

      const data = await response.json();
      
      const storedClientes = localStorage.getItem('clientes');
      const clientes = storedClientes ? JSON.parse(storedClientes) : [];
      const updatedClientes = [...clientes, data];
      localStorage.setItem('clientes', JSON.stringify(updatedClientes));

      console.log("Cliente creado:", data);
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
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Intentar nuevamente</button>
      </div>
    );
  }

  return (
    <>
      <div className="card card-primary">
        <div className="card-header">
          <h3 className="card-title">Crear Cliente</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <div className="card-body">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>DNI:</label>
              <input
                className="form-control"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección Local:</label>
              <input
                className="form-control"
                value={direccionlocal}
                onChange={(e) => setDireccionlocal(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección Casa:</label>
              <input
                className="form-control"
                value={direccioncasa}
                onChange={(e) => setDireccioncasa(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono 1:</label>
              <input
                className="form-control"
                value={telefono1}
                onChange={(e) => setTelefono1(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono 2:</label>
              <input
                className="form-control"
                value={telefono2}
                onChange={(e) => setTelefono2(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label>Vendedor:</label>
              <select
                className="form-control"
                value={vendedorSeleccionado}
                onChange={(e) => setVendedorSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona un vendedor</option>
                {listaVendedores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};