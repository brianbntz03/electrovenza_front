import React, { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import FlashMessage from "./tiny/FlashMessage";

export const ArticuloPresupuesto = () => {
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clientesCompletos, setClientesCompletos] = useState([]);
  const [terminoBusquedaCliente, setTerminoBusquedaCliente] = useState("");
  const [cuotasFiltrados, setCuotasFiltrados] = useState([]);
  const [error, setError] = useState(null);
  const [articulosLoading, setArticulosLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [idCliente, setIdCliente] = useState("");
  const [idinteres, setIdInteres] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const [selectedVendedorId, setSelectedVendedorId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Inicializamos el rol por defecto.
  const [userRole, setUserRole] = useState("vendedor");

  // Cargar vendedores, clientes y cuotas al inicio
  useEffect(() => {
    const storedUserRole = localStorage.getItem("user_role");

    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    cargarVendedores();
    cargarClientes();
    cargarCuotas();
  }, []);

  // Ajusta el nombre del vendedor y su ID después de que la lista de vendedores se haya cargado
  useEffect(() => {
    async function fetchVendedor() {
      const role = localStorage.getItem("user_role");
      if (role === "admin") {
        return;
      }

      const storedUserId = localStorage.getItem("user_id");
      const response = await fetch(
        `${apiRest}/vendedor/user_id/${storedUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener el vendedor: ${response.status}`);
      }

      const vendedor = await response.json();
      if (vendedor) {
        setNombreVendedor(vendedor.nombre);
        setSelectedVendedorId(vendedor.id);
      }
    }
    fetchVendedor();
  }, []);

  const [presupuesto, setPresupuesto] = useState(() => {
    const stored = localStorage.getItem("presupuesto");
    return stored ? JSON.parse(stored) : [];
  });

  const registrarVenta = async () => {
    try {
      console.log("Fecha seleccionada para la venta:", fechaSeleccionada);

      const ventaData = {
        nro_cuotas_id: parseInt(idinteres),
        cliente_id: parseInt(idCliente),
        vendedor_id: parseInt(selectedVendedorId),
        fecha: fechaSeleccionada,
        articulos: presupuesto.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
          descripcion: item.descripcion,
          categoria: item.categoria?.nombre,
        })),
        total: calcularTotal(),
      };

      console.log("Datos de venta a enviar:", ventaData);

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

      FlashMessage(
        "Registro de venta",
        "La venta se registro con exito",
        2000,
        "success",
        "cuotas-por-cobrar-electro"
      );
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      FlashMessage(
        "Registro de venta",
        "La venta se registro con exito",
        2000,
        "error"
      );
    }
  };

  const agregarAlPresupuesto = (nuevoArticulo) => {
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
    return presupuesto.reduce(
      (acc, item) => acc + parseFloat(item.precio) * item.cantidad,
      0
    );
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

    return total;
  };

  const sumarCuotas = () => {
    const totalConInteres = calcularTotalConInteres();
    const cuotaSeleccionada = cuotasFiltrados.find(
      (c) => c.id === parseInt(idinteres, 10)
    );

    const total = totalConInteres / cuotaSeleccionada.numero;

    return total;
  };

  const calcularPrecioConInteres = (precio, idCuotaSeleccionada) => {
    const cuotaSeleccionada = cuotasFiltrados.find(
      (c) => c.id === parseInt(idCuotaSeleccionada, 10)
    );
    if (!cuotaSeleccionada) return precio;
    const interes = cuotaSeleccionada.interes / 100;
    const precionConInteres = precio * (1 + interes);
    const total =
      Math.ceil(precionConInteres / cuotaSeleccionada.numero / 100) *
      cuotaSeleccionada.numero *
      100;
    return total;
  };

  const handleRetry = () => {
    setError(null);
  };

  const FormArticulos = ({ busqueda, setBusqueda }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(busqueda);
        }}
        style={{
          marginBottom: "10px",
        }}
      >
        <div className="row">
          <div className="col-md-2">
            <label style={{ marginRight: "5px" }}>Buscar artículo</label>
          </div>
          <div className="col-md-3 input-group">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-control"
            />
            <span className="input-group-append">
              <button type="submit" className="btn btn-sm btn-info">
                Buscar
              </button>
            </span>
          </div>
        </div>
      </form>
    );
  };

  const FormularioFecha = ({ fecha, setFecha }) => {
    const handleDataChange = (e) => {
      const selectedDate = e.target.value;
      console.log("Fecha seleccionada:", selectedDate);
      setFecha(selectedDate);
    };

    return (
      <div className="row">
        <div className="col-md-2">
          <label style={{ marginRight: "5px" }}>fecha</label>
        </div>
        <div className="col-md-3 input-group">
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={fecha || ""}
            onChange={handleDataChange}
          />
        </div>
      </div>
    );
  };

  const FormVendedor = (
    selectedVendedorId,
    setSelectedVendedorId,
    vendedoresFiltrados
  ) => {
    return (
      <div className="row">
        <div className="col-md-2">
          <label style={{ marginRight: "5px" }}>Vendedor:</label>
        </div>
        <div className="col-md-3 input-group">
          {userRole === "vendedor" ? (
            <p className="form-control-plaintext">{nombreVendedor}</p>
          ) : (
            <select
              className="form-control"
              value={selectedVendedorId}
              name="idVendedor"
              onChange={(e) => setSelectedVendedorId(e.target.value)}
            >
              <option value="">-- Seleccionar Vendedor --</option>
              {vendedoresFiltrados &&
                vendedoresFiltrados.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.nombre}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  const FormCliente = ({ idCliente, setIdCliente, clientesFiltrados }) => {
    const clienteSeleccionado = clientesFiltrados.find(c => c.id == idCliente);
    const displayValue = clienteSeleccionado ? `${clienteSeleccionado.id_formatted} - ${clienteSeleccionado.nombre}` : terminoBusquedaCliente;

    return (
      <div className="row">
        <div className="col-md-2">
          <label style={{ marginRight: "5px" }}>Buscar Cliente:</label>
        </div>
        <div className="col-md-3 input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Escribir nombre o ID..."
            value={displayValue}
            onChange={(e) => {
              setTerminoBusquedaCliente(e.target.value);
              setIdCliente("");
            }}
            list="clientes-list"
          />
          <datalist id="clientes-list">
            {clientesFiltrados.map((cliente) => (
              <option 
                key={cliente.id} 
                value={`${cliente.id_formatted} - ${cliente.nombre}`}
                onClick={() => setIdCliente(cliente.id)}
              />
            ))}
          </datalist>
        </div>
      </div>
    );
  };

  const FormNumeroCuotas = ({ idinteres, setIdInteres, cuotasFiltrados }) => {
    return (
      <div className="row">
        <div className="col-md-2">
          <label style={{ marginRight: "5px" }}>N° de cuotas</label>
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={idinteres}
            name="idinteres"
            onChange={(e) => setIdInteres(e.target.value)}
          >
            <option value="">-- Seleccionar numero de cuotas --</option>
            {cuotasFiltrados.map((interes) => (
              <option key={interes.id} value={interes.id}>
                {interes.descripcion} ({interes.interes} %)
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const handleSearch = async (busqueda) => {
    setSearchPerformed(true);
    setArticulosLoading(true);
    try {
      const url = busqueda
        ? `${apiRest}/articulos/find`
        : `${apiRest}/articulos?page=1&limit=10000`;
      const method = busqueda ? "POST" : "GET";
      const options = {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      };

      if (busqueda) {
        options.body = JSON.stringify({ patron: busqueda });
      }

      const response = await fetch(url, options);

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.status}`);
      const { data: listadoArticulos } = await response.json();

      const articulosConCategoria = listadoArticulos.map((articulo) => {
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
      const response = await fetch(`${apiRest}/vendedor?page=1&limit=200`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setVendedoresFiltrados(data.data);
      }
    } catch (error) {
      console.error("Error cargando vendedores:", error);
    }
  };

  const cargarClientes = async () => {
    try {
      console.log("Cargando clientes...");
      const token = localStorage.getItem("jwt_token");
      console.log("Token JWT:", token ? "Presente" : "No encontrado");

      const response = await fetch(`${apiRest}/cliente`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta del servidor:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de clientes recibidos:", data);
        console.log("Cantidad de clientes:", data.length);
        setClientesCompletos(data);
        setClientesFiltrados(data);
      } else if (response.status === 401) {
        console.error("Token expirado o inválido. Redirigiendo al login...");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");
        window.location.href = "/login";
      } else {
        console.error(
          "Error en la respuesta:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  // Lógica de filtrado
  useEffect(() => {
    if (terminoBusquedaCliente.length >= 2 || terminoBusquedaCliente === "") {
      const busquedaLower = terminoBusquedaCliente.toLowerCase();
      const resultados = clientesCompletos.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(busquedaLower) ||
          cliente.id_formatted.toLowerCase().includes(busquedaLower)
      );
      setClientesFiltrados(resultados);
    }
  }, [terminoBusquedaCliente, clientesCompletos]);

  // Detectar selección del datalist
  useEffect(() => {
    const cliente = clientesCompletos.find(c => 
      `${c.id_formatted} - ${c.nombre}` === terminoBusquedaCliente
    );
    if (cliente) {
      setIdCliente(cliente.id);
    }
  }, [terminoBusquedaCliente, clientesCompletos]);

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
    <div className="">
      <FormVendedor
        selectedVendedorId={selectedVendedorId}
        setSelectedVendedorId={setSelectedVendedorId}
        vendedoresFiltrados={vendedoresFiltrados}
      />
      <FormularioFecha
        fecha={fechaSeleccionada}
        setFecha={setFechaSeleccionada}
      />
      <FormCliente
        idCliente={idCliente}
        setIdCliente={setIdCliente}
        clientesFiltrados={clientesFiltrados}
      />
      <FormNumeroCuotas
        idinteres={idinteres}
        setIdInteres={setIdInteres}
        cuotasFiltrados={cuotasFiltrados}
      />
      <FormArticulos busqueda={busqueda} setBusqueda={setBusqueda} />
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
                  <th>Articulo</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Img</th>
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
                    <td>{articulo.precio.toLocaleString()}</td>
                    <td>
                      <img
                        src={`${apiRest}/articulos/${articulo.id}/imagen`}
                        width={100}
                        alt=""
                      ></img>
                    </td>
                    <td>
                      <a href="#presupuesto-financiacion">
                        <button
                          className="btn btn-success"
                          onClick={() => agregarAlPresupuesto(articulo)}
                          disabled={presupuesto.some(
                            (item) => item.id === articulo.id
                          )}
                        >
                          +
                        </button>
                      </a>
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
      <a name="presupuesto-financiacion">
      <h3>Presupuesto</h3>
      {presupuesto.length === 0 ? (
        <p>No hay artículos en el presupuesto.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Código</th>
                <th>Articulo</th>
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
                  <td>{item.nombre || item.descripcion}</td>
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
                          cuotasFiltrados.find(
                            (c) => c.id === parseInt(idinteres, 10)
                          )?.interes || 0
                        }% (${
                          cuotasFiltrados.find(
                            (c) => c.id === parseInt(idinteres, 10)
                          )?.numero || 0
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
                    $
                    {idinteres
                      ? calcularTotalConInteres().toLocaleString()
                      : calcularTotal().toLocaleString()}
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
                    <th>Cantidad</th>
                    <th>Precio Contado</th>
                    <th>Cuotas</th>
                    <th>Valor por cuota</th>
                    <th>Total con interés</th>
                  </tr>
                </thead>
                <tbody>
                  {presupuesto.map((item) => {
                    const subtotal = parseFloat(item.precio) * item.cantidad;
                    const numeroCuotas =
                      cuotasFiltrados.find(
                        (c) => c.id === parseInt(idinteres, 10)
                      )?.numero || 1;
                    const conInteres = calcularPrecioConInteres(
                      subtotal,
                      idinteres
                    );
                    const valorPorCuota =
                      Math.ceil(conInteres / numeroCuotas / 100) * 100;

                    return (
                      <tr key={`financiacion-${item.id}`}>
                        <td>{item.nombre || item.descripcion}</td>
                        <td>{item.cantidad}</td>
                        <td>${subtotal.toLocaleString()}</td>
                        <td>{numeroCuotas}</td>
                        <td>${valorPorCuota.toLocaleString()}</td>
                        <td>${conInteres.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}
                  >
                    <td td colSpan="2" style={{ textAlign: "center" }}>
                      TOTAL
                    </td>
                    <td>${calcularTotal().toLocaleString()}</td>

                    <td>No aplica</td>
                    <td>{sumarCuotas().toLocaleString()}</td>
                    <td>${calcularTotalConInteres().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: "right" }}>
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
    </a>
    </div>
  );
};
