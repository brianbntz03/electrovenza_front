import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export const CrearCliente = () => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [direccionlocal, setDireccionlocal] = useState("");
  const [direccioncasa, setDireccioncasa] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [rubro, setRubro] = useState("");
  
  const [documentoFrente, setDocumentoFrente] = useState(null); 
  const [documentoDorsal, setDocumentoDorsal] = useState(null); 
  const [servicio1, setServicio1] = useState(null);           
  const [servicio2, setServicio2] = useState(null);           
  
  const [listaVendedores, setListaVendedores] = useState([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState("");

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
      text: "El cliente fue creado correctamente.",
      icon: "success",
      timer: 2000,
    }).then(() => {
      window.location.href = `${publicUrl}/clientes`;
    });
  };

  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const response = await authenticatedFetch(`${apiRest}/vendedor`, {
          method: "GET",
        });
        const data = await response.json();
        setListaVendedores(data.data || data.vendedores || []);
      } catch (error) {
        console.error("Error al cargar vendedores:", error);
        setError("No se pudieron cargar los vendedores.");
      }
    };
    obtenerVendedores();
  }, []);
  
  const uploadImageByType = async (clienteId, file, tipo) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("imagen", file); 

    try {
      const response = await authenticatedFetch(`${apiRest}/cliente/${clienteId}/imagen/${tipo}`,
        {
          method: 'POST',
          body: formData,
        });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al subir ${tipo}: ${response.status} - ${errorText}`);
      } else {
        console.log(`Imagen de ${tipo} subida correctamente.`);
      }

    } catch (error) {
      console.error(`Error de red al subir ${tipo}:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");

      const response = await authenticatedFetch(`${apiRest}/cliente`, {
        method: "POST",
        body: JSON.stringify({
          nombre,
          dni: Number(dni),
          direccion_local: direccionlocal,
          direccion_casa: direccioncasa,
          telefono1: Number(telefono1),
          telefono2: Number(telefono2),
          vendedor_id: Number(vendedorSeleccionado),
          creado_por: Number(userId),
          rubro: rubro,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }

      const data = await response.json();
      const newClienteId = data.id;

      if (newClienteId) {
        const uploadPromises = [
          uploadImageByType(newClienteId, documentoFrente, 'documento_frente'),
          uploadImageByType(newClienteId, documentoDorsal, 'documento_dorso'),
          uploadImageByType(newClienteId, servicio1, 'servicio1'),
          uploadImageByType(newClienteId, servicio2, 'servicio2'),
        ];

        await Promise.allSettled(uploadPromises);
      }
      
      const storedClientes = localStorage.getItem("clientes");
      const clientes = storedClientes ? JSON.parse(storedClientes) : [];
      const updatedClientes = [...clientes, data];
      localStorage.setItem("clientes", JSON.stringify(updatedClientes));

      console.log("Cliente creado y subida de imágenes finalizada.");
      MostrarAlerta();
      setButton(true);
      setLoading(false);
      
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo crear el cliente. Verifica el servidor: ${error.message}`
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
              />
            </div>
            <div className="form-group">
              <label>Rubro:</label>
              <input
                className="form-control"
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
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
            
            <hr />
            
            <div className="form-group">
              <label htmlFor="documentoFrente">Documento de Frente:</label>
              <input
                className="form-control"
                id="documentoFrente"
                type="file"
                accept="image/*"
                onChange={(e) => setDocumentoFrente(e.target.files[0])}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="documentoDorsal">Documento Dorsal:</label>
              <input
                className="form-control"
                id="documentoDorsal"
                type="file"
                accept="image/*"
                onChange={(e) => setDocumentoDorsal(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label htmlFor="servicio1">Comprobante de Servicio 1:</label>
              <input
                className="form-control"
                id="servicio1"
                type="file"
                accept="image/*"
                onChange={(e) => setServicio1(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label htmlFor="servicio2">Comprobante de Servicio 2:</label>
              <input
                className="form-control"
                id="servicio2"
                type="file"
                accept="image/*"
                onChange={(e) => setServicio2(e.target.files[0])}
              />
            </div>          
          </div>

          <div className="card-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};