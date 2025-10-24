import React, { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import Swal from "sweetalert2";
import FlashMessage from "./tiny/FlashMessage";

const FormOtorgarFecha = ({ fecha, setFecha }) => (
  <div className="form-group">
    <label htmlFor="fecha_otorgamiento">Fecha de Otorgamiento</label>
    <input
      type="date"
      className="form-control"
      id="fecha"
      value={fecha || ""}
      onChange={(e) => setFecha(e.target.value)}
    />
  </div>
);

const FormClienteCard = ({ cliente, setCliente, clientesList }) => (
  <div className="form-group">
    <label htmlFor="cliente">Cliente</label>
    <select
      className="form-control"
      id="cliente_id"
      value={cliente}
      onChange={(e) => setCliente(e.target.value)}
    >
      <option value="">Seleccione un cliente</option>
      {clientesList.map((c) => (
        <option key={c.id} value={c.id}>
          {c.id_formatted} - {c.nombre}
        </option>
      ))}
    </select>
  </div>
);

const FormMontoaOtorgar = ({ monto, setMonto }) => (
  <div className="form-group">
    <label htmlFor="monto">Monto a Otorgar</label>
    <input
      id="monto"
      type="text"
      className="form-control"
      value={monto}
      onChange={(e) => setMonto(e.target.value)}
      placeholder="Ingrese el monto"
    />
  </div>
);

const FormCantidadCuota = ({ cuotaId, setCuotaId, cuotasList }) => (
  <div className="form-group">
    <label htmlFor="cuotas">Cantidad de Cuotas</label>
    <select
      className="form-control"
      id="setting_cuotas_credito_id"
      value={cuotaId}
      onChange={(e) => setCuotaId(Number(e.target.value))}
    >
      <option value="">Seleccione cuotas</option>
      {cuotasList.map((c) => (
        <option key={c.id} value={c.id}>
          {[c.tipo_cuota]}: {c.descripcion}  ({c.interes}%)
        </option>
      ))}
    </select>
  </div>
);

const OtorgarCredito = () => {
  const [cliente, setCliente] = useState("");
  const [monto, setMonto] = useState("");
  const [cuotaId, setCuotaId] = useState("");
  const [detallesFinanciacion, setDetallesFinanciacion] = useState(null);
  const [clientesList, setClientesList] = useState([]);
  const [cuotasList, setCuotasList] = useState([]);
  const [fecha, setFecha] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!cliente || !monto || !cuotaId || !detallesFinanciacion) {
      Swal.fire(
        "Campos incompletos",
        "Por favor, complete todos los campos.",
        "warning"
      );
      setLoading(false);
      return;
    }

    try {
      const vendedorId = Number(localStorage.getItem("vendedor_id"));
      const response = await fetch(`${apiRest}/credito  `, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setting_cuotas_credito_id: parseInt(cuotaId),
          cliente_id: parseInt(cliente),
          vendedor_id: vendedorId, //todo: tomar el id de vendedor del header
          monto: parseFloat(monto),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido del servidor." }));
        throw new Error(`Error ${response.status}: ${errorData.message}`);
      }

      FlashMessage(
        "Otorgar Crédito",
        "El crédito ha sido otorgado correctamente.",
        2000,
        "success",
        "creditos-cuotas-por-cobrar"
      );

      // limpiar después de guardar
      setCliente("");
      setMonto("");
      setCuotaId("");
      setDetallesFinanciacion(null);
    } catch (error) {
      console.error("Error detallado:", error);
      Swal.fire(
        "Error",
        `No se pudo registrar el crédito: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Traer clientes y cuotas
  useEffect(() => {
    fetch(`${apiRest}/cliente`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClientesList(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching clientes:", error));

    fetch(`${apiRest}/settings/cuotas-credito`)
      .then((res) => res.json())
      .then((data) => setCuotasList(Array.isArray(data) ? data : []))
      .catch(() => setCuotasList([]));
  }, []);

  useEffect(() => {
    if (monto > 0 && cuotaId) {
      const cuotaSeleccionada = cuotasList.find((c) => c.id === cuotaId);
      if (cuotaSeleccionada) {
        const cuotas = cuotaSeleccionada.numero;
        const interesDecimal = cuotaSeleccionada.interes;
        const total = monto * (1 + interesDecimal / 100);
        const valorCuota = Math.round(total / cuotas);

        const totalPagar = valorCuota * cuotas;

        setDetallesFinanciacion({
          cuotas,
          interes: `${cuotaSeleccionada.interes}%`,
          valorCuota: valorCuota,
          totalPagar: totalPagar,
        });
      }
    } else {
      setDetallesFinanciacion(null);
    }
  }, [monto, cuotaId, cuotasList]);

  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        <FormOtorgarFecha fecha={fecha} setFecha={setFecha} />
        <FormClienteCard
          cliente={cliente}
          setCliente={setCliente}
          clientesList={clientesList}
        />
        <FormMontoaOtorgar monto={monto} setMonto={setMonto} />
        <FormCantidadCuota
          cuotaId={cuotaId}
          setCuotaId={setCuotaId}
          cuotasList={cuotasList}
        />

        {detallesFinanciacion && (
          <>
            <h3>Detalles de Financiación</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Cuotas</th>
                  <th>Interés</th>
                  <th>Valor por Cuota</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{detallesFinanciacion.cuotas}</td>
                  <td>{detallesFinanciacion.interes}</td>
                  <td>${detallesFinanciacion.valorCuota}</td>
                  <td>${detallesFinanciacion.totalPagar}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: "right" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Otorgar Crédito"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};


export default OtorgarCredito;
