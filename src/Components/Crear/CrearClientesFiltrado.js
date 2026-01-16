import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";
import { useEffect, useState } from "react";

export const CrearClienteFiltrado = () => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [direccionlocal, setDireccionlocal] = useState("");
  const [direccioncasa, setDireccioncasa] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [listaVendedores, setListaVendedores] = useState([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [Rubro, setRubro] = useState("");
  const [button, setButton] = useState(false);
  const [documentoFrente, setDocumentoFrente] = useState(null);
  const [documentoDorso, setDocumentoDorso] = useState(null);
  const [servicio1, setServicio1] = useState(null);
  const [servicio2, setServicio2] = useState(null);
  
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
      if (window.refreshClientList) {
        window.refreshClientList();
      }
      window.location.href = `${publicUrl}/clientes-filtrado-vendedor`;
    });
  };

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const id = localStorage.getItem("user_id");
    setUserRole(role);
    setUserId(id);

    // Test de conectividad
    const testBackend = async () => {
      try {
        const response = await fetch(`${apiRest}/vendedor`,{
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },  
        });
        console.log("Backend status:", response.status);
        if (response.ok) {
          console.log("✅ Backend conectado correctamente");
        }
      } catch (error) {
        console.error("❌ Backend no disponible:", error);
        setError("El servidor no está disponible. Verifica que esté corriendo en puerto 3001.");
      }
    };
    testBackend();

    if (role === "admin") {
      const obtenerVendedores = async () => {
        try {
          const response = await fetch(`${apiRest}/vendedor`,
        {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
          const data = await response.json();
          setListaVendedores(data);
        } catch (error) {
          console.error("Error al cargar vendedores:", error);
          setError("No se pudieron cargar los vendedores.");
        }
      };
      obtenerVendedores();
    }
  }, []);

  const uploadImageByType = async (clienteId, file, tipo) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await fetch(`${apiRest}/cliente/${clienteId}/imagen/${tipo}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      if (!response.ok) {
        console.error(`Error al subir ${tipo}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error al subir ${tipo}:`, error);
    }
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isNaN(Number(dni))) {
        setLoading(false);
        setError("El DNI debe ser un número válido.");
        return;
    }

    let vendedorId = null;
    if (userRole === "admin") {
        if (!vendedorSeleccionado || vendedorSeleccionado === "0" || isNaN(Number(vendedorSeleccionado))) {
            setLoading(false);
            setError("Por favor, selecciona un vendedor válido.");
            return;
        }
        vendedorId = Number(vendedorSeleccionado);
    } else if (userRole === "vendedor" || userRole === "Vendedor Mayorista") {
        vendedorId = localStorage.getItem("vendedor_id");
    } else {
        setLoading(false);
        setError("Error: Rol de usuario no válido. No se puede crear un cliente.");
        return;
    }

    // Validaciones adicionales
    if (!nombre.trim()) {
        setLoading(false);
        setError("El nombre es requerido.");
        return;
    }

    if (!telefono1.trim() || isNaN(Number(telefono1))) {
        setLoading(false);
        setError("El teléfono 1 debe ser un número válido.");
        return;
    }

    if (telefono2 && isNaN(Number(telefono2))) {
        setLoading(false);
        setError("El teléfono 2 debe ser un número válido.");
        return;
    }

    // Prepara los datos para que coincidan con el esquema del backend
    const clienteData = {
        nombre: nombre,
        'dni': Number(dni),
        direccion_local: direccionlocal,
        direccion_casa: direccioncasa,
        'telefono1': Number(telefono1),
        'telefono2': Number(telefono2),
        vendedor_id: Number(vendedorId),
        rubro: Rubro,
        creado_por: Number(userId),
    };
    
    console.log("Datos a enviar:", clienteData);
    console.log("Vendedor ID:", vendedorId, "Tipo:", typeof vendedorId); 

    try {
        const response = await fetch(`${apiRest}/cliente`, {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify(clienteData),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Error del servidor:", {
                status: response.status,
                statusText: response.statusText,
                body: text,
                url: response.url
            });
            throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        }

        const data = await response.json();
        const newClienteId = data.id;

        if (newClienteId) {
          const uploadPromises = [
            uploadImageByType(newClienteId, documentoFrente, 'frente'),
            uploadImageByType(newClienteId, documentoDorso, 'dorso'),
            uploadImageByType(newClienteId, servicio1, 'servicio1'),
            uploadImageByType(newClienteId, servicio2, 'servicio2'),
          ];
          await Promise.allSettled(uploadPromises);
        }

        console.log("Cliente creado:", data);
        MostrarAlerta();
        setLoading(false);
    } catch (error) {
        setError(`No se pudo crear el cliente: ${error.message}`);
        setLoading(false);
    }
};

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Intentar nuevamente</button>
      </div>
    );
  }

  return (
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
            <label>Rubro:</label>
            <input
              className="form-control"
              value={Rubro}
              onChange={(e) => setRubro(e.target.value)}
              type="text"
              required
            />
          </div>

          {userRole === "admin" && (
            <div className="form-group">
              <label>Vendedor:</label>
              <select
                className="form-control"
                value={vendedorSeleccionado}
                onChange={(e) => setVendedorSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona un Vendedor</option>
                {listaVendedores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <hr />
          
          <div className="form-group">
            <label>Documento Frente:</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setDocumentoFrente(e.target.files[0])}
            />
          </div>
          
          <div className="form-group">
            <label>Documento Dorso:</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setDocumentoDorso(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Servicio 1:</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setServicio1(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Servicio 2:</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setServicio2(e.target.files[0])}
            />
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
};