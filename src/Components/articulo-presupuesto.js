import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";



export const ArticuloPresupuesto = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeVenta, setMensajeVenta] = useState("");
  const [accionActual, setAccionActual] = useState(null);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [cuotasFiltrados, setCuotasFiltrados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idCliente, setIdCliente] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const [idCuota, setIdCuota] = useState("");


  useEffect(() => {
    cargarVendedores();
    cargarClientes();
    cargarCuotas();
  }, []);
  const [presupuesto, setPresupuesto] = useState(() => {
    const stored = localStorage.getItem("presupuesto");
    return [];
  });

  const registrarVenta = async () => {
    setAccionActual("registrar Ventas");
    try {
      const ventaData = {
        nro_cuotas_id: idCuota,
        cliente_id: idCliente,
        vendedor_id: idVendedor,
        articulos: presupuesto.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
        })),
      };

      const response = await fetch(`${apiRest}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        throw new Error(`Error al registrar la venta: ${response.status}`);
      }

      const resultado = await response.text();
      setMensajeVenta(resultado);
      setModalVisible(true);
      console.log("Respuesta del servidor:", resultado);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      setMensajeVenta(`Error al registrar: ${error.message}`);
      setModalVisible(true);
    }
  };


  const agregarAlPresupuesto = (nuevoArticulo) => {
    setAccionActual("agregar");
    const yaAgregado = presupuesto.find((item) => item.id === nuevoArticulo.id);
    let nuevoPresupuesto;

    if (yaAgregado) {
      nuevoPresupuesto = presupuesto.map((item) =>
        item.id === nuevoArticulo.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoPresupuesto = [...presupuesto, { ...nuevoArticulo, cantidad: 1 }];
    }

    setPresupuesto(nuevoPresupuesto);
    localStorage.setItem("presupuesto", JSON.stringify(nuevoPresupuesto));
  };

  const eliminarProducto = (id) => {
    const actualizado = presupuesto.filter((item) => item.id !== id);
    setPresupuesto(actualizado);
    localStorage.setItem("presupuesto", JSON.stringify(actualizado));
  };

  const calcularTotal = () => {
    return presupuesto
      .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };

  function FormArticulos() {
    const [busqueda, setBusqueda] = useState("");
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(busqueda);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight: "5px" }}>Buscar artículo</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-info float-right">
            Buscar
          </button>
        </form>
      </div>
    );
  }

  function FormVendedor() {

    return (
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "5px" }}>Buscar Vendedor:</label>
        <select
          className="form-control"
          value={idVendedor}
          name="idVendedor"
          onChange={(e) => setIdVendedor(e.target.value)}
          style={{ width: "300px", display: "inline-block" }}
        >
          <option value="">-- Seleccionar Vendedor --</option>
          {vendedoresFiltrados.map((vendedor) => (
            <option key={vendedor.id} value={vendedor.id}>
              {vendedor.nombre}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function FormCliente() {

    return (
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "5px" }}>Buscar Cliente:</label>
        <select
          className="form-control"
          value={idCliente}
          name="idCliente"
          onChange={(e) => setIdCliente(e.target.value)}
          style={{ width: "300px", display: "inline-block" }}
        >
          <option value="">-- Seleccionar Cliente --</option> 
          {clientesFiltrados.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function FormNumeroCuotas() {

    return (
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "5px" }}>N° de cuotas</label>
        <select
          className="form-control"
          value={idCuota}
          name="idCuota"
          onChange={(e) => setIdCuota(e.target.value)}
          style={{ width: "300px", display: "inline-block" }}
        >
          <option value="">-- Seleccionar numero de cuotas --</option>
          {cuotasFiltrados.map((cuota) => (
            <option key={cuota.id} value={cuota.id}>
              {cuota.descripcion}
            </option>
          ))}
        </select>
      </div>
    );
  }
  const handleSearch = async (busqueda) => {
    setAccionActual("buscar");
    try {
      const response = await fetch(`${apiRest}/articulos/find`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patron: busqueda }),
      });

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.status}`);
      const data = await response.json();
      setArticulosFiltrados(data);
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };

  const cargarVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      if (response.ok) {
        const data = await response.json();
        setVendedoresFiltrados(data);
      }
    } catch (error) {
      console.error("Error cargando vendedores:", error);
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await fetch(`${apiRest}/cliente`);
      if (response.ok) {
        const data = await response.json();
        setClientesFiltrados(data);
      }
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const cargarCuotas = async () => {
    try {
      const response = await fetch(`${apiRest}/settings/cuotas`);
      if (response.ok) {
        const data = await response.json();
        setCuotasFiltrados(data);
      }
    } catch (error) {
      console.error("Error cargando cuotas:", error);
    }
  };

  if (loading)
    return (
      <div>
        <FormArticulos />
        <p>Cargando artículos...</p>
      </div>
    );

  if (error) {
    return (
      <div>
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <FormArticulos />
      <h3>Lista de artículos</h3>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articulosFiltrados.map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.id}</td>
              <td>{articulo.descripcion}</td>
              <td>{articulo.categoria?.nombre}</td>
              <td>{articulo.precio ? `$${articulo.precio}` : "No definido"}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => agregarAlPresupuesto(articulo)}
                  disabled={presupuesto.some((item) => item.id === articulo.id)}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <FormVendedor />
      <FormCliente />
      <FormNumeroCuotas />

      <h3>Presupuesto</h3>
      {presupuesto.length === 0 ? (
        <p>No hay artículos en el presupuesto.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {presupuesto.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.categoria?.nombre}</td>
                  <td>${item.precio}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => {
                        const nuevaCantidad = parseInt(e.target.value, 10);
                        if (nuevaCantidad >= 1) {
                          const nuevoPresupuesto = presupuesto.map((i) =>
                            i.id === item.id
                              ? { ...i, cantidad: nuevaCantidad }
                              : i
                          );
                          setPresupuesto(nuevoPresupuesto);
                          localStorage.setItem(
                            "presupuesto",
                            JSON.stringify(nuevoPresupuesto)
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    {typeof item.precio === "number"
                      ? `$${(item.precio * item.cantidad).toFixed(2)}`
                      : "Precio inválido"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info float-right"
                      onClick={() => eliminarProducto(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>
                  <strong>Total:</strong>
                </td>
                <td colSpan="2">
                  <strong>${calcularTotal()}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="7" style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => registrarVenta()}
                  >
                    Registrar Venta
                  </button>

                  {modalVisible && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "20px",
                          borderRadius: "5px",
                          maxWidth: "500px",
                          width: "90%"
                        }}
                      >
                        <h5>Resultado de la venta</h5>
                        <p>Se registró la venta: {mensajeVenta}</p>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setModalVisible(false) }
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};
