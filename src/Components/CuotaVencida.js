import React, { useState } from "react";
import { apiRest } from "../service/apiRest";
import { convertIsoToDMY } from "../miscellaneus/aux";

export default function CuotaVencida(cuota) {
  const [montoParcial, setMontoParcial] = useState("");

  const registrarPagoParcial = async () => {
    if (!montoParcial || isNaN(montoParcial) || Number(montoParcial) <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    try {
      const response = await fetch(
        `${apiRest}/cuota_venta/monto-cobrado/${cuota.id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ monto_cobrado: Number(montoParcial) }),
        }
      );

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      cuota.incrementarContador();
      setMontoParcial("");
      // Ocultar modal manualmente si no estás usando jQuery
      document.getElementById(`cerrar-modal-${cuota.id}`).click();
      return data;
    } catch (error) {
      console.error("Error al registrar pago parcial:", error);
    }
  };

  const registrarPago = async () => {
    try {
      const confirmacion = window.confirm(
        "¿Esta seguro de que quiere marcar como pagada la cuota?"
      );
      if (!confirmacion) return;

      const response = await fetch(`${apiRest}/cuota_venta/${cuota.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      cuota.incrementarContador();
      return data;
    } catch (error) {
      console.error("Error detallado:", error);
    }
  };

  return (
    <>
      <div className="col-md-3 col-sm-6 col-12">
        <div
          className={
            cuota.estado === 1
              ? "info-box bg-warning"
              : "info-box bg-gradient-info"
          }
        >
          <span className="info-box-icon">
            <i className="far fa-calendar-alt"></i>
          </span>
          <div className="info-box-content">
            <span className="info-box-text">
              {cuota.fecha} ({cuota.numero})
            </span>
            <span className="progress-description">{cuota.articulo}</span>
            <span className="info-box-number">valor: ${cuota.valor}</span>
            <span className="info-box-number">
              Pendiente: ${cuota.valor - cuota.montoCobrado}
            </span>           
            <span className="progress-description">
              Vendedor: {cuota.vendedor}
            </span>
            <div className="row">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  data-toggle="modal"
                  data-target={`#modal-warning-${cuota.id}`}
                >
                  Pago parcial
                </button>
              </div>
              <div className="col-6">
                <button
                  onClick={registrarPago}
                  className="btn btn-sm btn-primary"
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pago parcial */}
      <div
        className="modal fade"
        id={`modal-warning-${cuota.id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={`modalLabel-${cuota.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content bg-warning">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalLabel-${cuota.id}`}>
                Registrar Pago parcial
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                id={`cerrar-modal-${cuota.id}`}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Monto a pagar:</label>
              <input
                type="number"
                className="form-control"
                value={montoParcial}
                onChange={(e) => setMontoParcial(e.target.value)}
                placeholder={`Ej: ${cuota.valor - cuota.montoCobrado}`}
              />
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                id={`cerrar-modal-${cuota.id}`}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={registrarPagoParcial}
              >
                registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
