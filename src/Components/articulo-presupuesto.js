import { useNavigate } from "react-router-dom";
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
  const [articulosLoading, setArticulosLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [idCliente, setIdCliente] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const [idinteres, setIdInteres] = useState("");

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
        nro_cuotas_id: parseInt(idinteres) || 1,
        cliente_id: parseInt(idCliente) || 1,
        vendedor_id: parseInt(idVendedor) || 1,
        articulos: presupuesto.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
          descripcion: item.descripcion,
          categoria: item.categoria?.nombre,
        })),
        total: calcularTotal(),
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
      .reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0)
      .toFixed(2);
  };

  const calcularTotalConInteres = () => {
    if (!idinteres) {
      return calcularTotal();
    }

    const total = presupuesto.reduce(
      (acc, item) =>
        acc +
        calcularPrecioConInteres(
          parseFloat(item.precio) * item.cantidad,
          idinteres
        ),
      0
    );

    return total.toFixed(2);
  };

  const calcularPrecioConInteres = (precio, idCuotaSeleccionada) => {
    const cuotaSeleccionada = cuotasFiltrados.find(
      (c) => c.id == idCuotaSeleccionada 
    );
    if (!cuotaSeleccionada) return precio;
    const interes = cuotaSeleccionada.interes / 100;
    const precionConInteres = precio * (1 + interes); 
    const total = Math.ceil(precionConInteres / cuotaSeleccionada.numero / 100 ) * cuotaSeleccionada.numero * 100
    return total;

  };

  const handleRetry = () => {
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

  const FormVendedor = () => {
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
  };

  const FormCliente = () => {
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
  };

  const FormNumeroCuotas = () => {
    return (
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "5px" }}>N° de cuotas</label>
        <select
          className="form-control"
          value={idinteres}
          name="idinteres"
          onChange={(e) => setIdInteres(e.target.value)}
          style={{ width: "300px", display: "inline-block" }}
        >
          <option value="">-- Seleccionar numero de cuotas --</option>
          {cuotasFiltrados.map((interes) => (
            <option key={interes.id} value={interes.id}>
              {interes.descripcion} ({interes.interes} %)
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleSearch = async (busqueda) => {
    setAccionActual("buscar");
    setSearchPerformed(true);
    setArticulosLoading(true);
    try {
      const url = busqueda
        ? `${apiRest}/articulos/find`
        : `${apiRest}/articulos`;
      const method = busqueda ? "POST" : "GET";
      const options = {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      if (busqueda) {
        options.body = JSON.stringify({ patron: busqueda });
      }

      const response = await fetch(url, options);

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.status}`);
      const data = await response.json();
      console.log("Datos de artículos:", data);
      console.log("Estructura del primer artículo:", data[0]);

      
      const articulosConCategoria = data.map((articulo) => {
        console.log(`Artículo ${articulo.id} - Categoría:`, articulo.categoria);

        if (!articulo.categoria) {
          return { ...articulo, categoria: { nombre: "Sin categoría" } };
        } else if (typeof articulo.categoria === "string") {
          return { ...articulo, categoria: { nombre: articulo.categoria } };
        } else if (articulo.categoria && articulo.categoria.descripcion) {
          return {
            ...articulo,
            categoria: { nombre: articulo.categoria.descripcion },
          };
        } else if (articulo.categoria && articulo.categoria.nombre) {
          return articulo;
        } else if (articulo.categoria && articulo.categoria.id) {
          return {
            ...articulo,
            categoria: {
              ...articulo.categoria,
              nombre: `Categoría ${articulo.categoria.id}`,
            },
          };
        }
        return articulo;
      });

      setArticulosFiltrados(articulosConCategoria);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3001: ${error.message}`
      );
    } finally {
      setArticulosLoading(false);
    }
  };

  const cargarVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      console.log("Response vendedores:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Datos vendedores:", data);
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

      {searchPerformed && (
        <>
          <h3>Lista de artículos</h3>
          {articulosLoading ? (
            <div className="text-center p-4">
              <p>Buscando artículos...</p>
            </div>
          ) : articulosFiltrados.length > 0 ? (
            <table className="table table-striped table-valign-middle table-bordered">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articulosFiltrados.map((articulo) => (
                  <tr key={articulo.id}>
                    <td>{articulo.id}</td>
                    <td>{articulo.nombre}</td>
                    <td>
                      {articulo.categoria?.nombre?.trim() || "Sin categoría"}
                    </td>
                    <td>
                      {articulo.precio ? `$${articulo.precio}` : "No definido"}
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => agregarAlPresupuesto(articulo)}
                        disabled={presupuesto.some(
                          (item) => item.id === articulo.id
                        )}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron artículos.</p>
          )}
        </>
      )}

      <h3>Presupuesto</h3>
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
                    {`$${(parseFloat(item.precio) * item.cantidad).toFixed(2)}`}
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
                  <strong>Interés:</strong>
                </td>
                <td colSpan="2">
                  <strong>
                    {idinteres
                      ? `${
                          cuotasFiltrados.find((c) => c.id == idinteres)
                            ?.interes || 0
                        }% (${
                          cuotasFiltrados.find((c) => c.id == idinteres)
                            ?.numero || 0
                        } cuotas)`
                      : "No seleccionado"}
                  </strong>
                </td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>
                  <strong>Total:</strong>
                </td>
                <td colSpan="2">
                  <strong>
                    ${idinteres ? calcularTotalConInteres() : calcularTotal()}
                  </strong>
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
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "20px",
                          borderRadius: "5px",
                          maxWidth: "500px",
                          width: "90%",
                        }}
                      >
                        <h5>Resultado de la venta</h5>
                        <p>Se registró la venta: {mensajeVenta}</p>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setModalVisible(false)}
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

          {idinteres && (
            <>
              <h4 style={{ marginTop: "20px" }}>Detalle de financiación</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cuotas</th>
                    <th>Interés</th>
                    <th>Subtotal</th>
                    <th>Total con interés</th>
                    <th>Valor por cuota</th>
                  </tr>
                </thead>
                <tbody>
                  {presupuesto.map((item) => {
                    const subtotal = parseFloat(item.precio) * item.cantidad;
                    const numeroCuotas =
                      cuotasFiltrados.find((c) => c.id == idinteres)?.numero ||
                      1;
                    const interes =
                      cuotasFiltrados.find((c) => c.id == idinteres).interes ||
                      0;
                    const conInteres = calcularPrecioConInteres(
                      subtotal,
                      idinteres
                    );
                    const valorPorCuota = Math.ceil(conInteres / numeroCuotas / 100) * 100;

                    return (
                      <tr key={`financiacion-${item.id}`}>
                        <td>{item.nombre || item.descripcion}</td>
                        <td>{numeroCuotas}</td>
                        <td>{interes}%</td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>${conInteres.toFixed(2)}</td>
                        <td>${valorPorCuota}</td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}
                  >
                    <td td colSpan="3" style={{ textAlign: "center" }}>
                      TOTAL
                    </td>
                    <td>${calcularTotal()}</td>
                    <td>${calcularTotalConInteres()}</td>
                    <td>
                      $
                      {(() => {
                        const totalConInteresPresupuesto = parseFloat(calcularTotalConInteres());
                        const numeroCuotasSeleccionadas =
                          cuotasFiltrados.find((c) => c.id == idinteres)?.numero || 0;

                        if (numeroCuotasSeleccionadas > 0) {
                          return Math.ceil(totalConInteresPresupuesto / numeroCuotasSeleccionadas / 100) * 100;
                        } else {
                          return 0; 
                        }
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: "right" }} >
                  <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={() => registrarVenta()}
                  >
                  Registrar Venta
                  </button>
              </div>
              
            </>
          )}
        </>
      )}
    </div>
  );
};
