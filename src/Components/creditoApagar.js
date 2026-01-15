import { useState } from "react";
import { apiRest } from "../service/apiRest";

export default function CreditaPagar({ id, fecha, articulo, valor, montoCobrado, vendedor, estado, incrementarContador }) {
  const [montoParcial, setMontoParcial] = useState("");

  const registrarPagoParcial = async () => {
    if (!montoParcial || isNaN(montoParcial) || Number(montoParcial) <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    try {
      const response = await fetch(
        `${apiRest}/cuota_venta/monto-cobrado/${id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          body: JSON.stringify({ monto_cobrado: montoParcial }),
        }
      );

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      incrementarContador();
      setMontoParcial("");
      // Ocultar modal manually si no estás usando jQuery
      document.getElementById(`cerrar-modal-${id}`).click();
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

      const response = await fetch(`${apiRest}/cuota_venta/${id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      incrementarContador();
      return data;
    } catch (error) {
      console.error("Error detallado:", error);
    }
  };

  return (
    <>
      <div className="col-md-3 col-sm-6 col-12">
        <div className={estado===1 ? 'info-box bg-warning' : 'info-box bg-gradient-info'}>
          <span className="info-box-icon">
            <i className="far fa-calendar-alt"></i>
          </span>
          <div className="info-box-content">
            <span className="info-box-text">
              {fecha} ({id})
            </span>
            <span className="progress-description">{articulo}</span>
            <span className="info-box-number">valor: ${valor}</span>
            <span className="info-box-number">monto: ${valor-montoCobrado}</span>
            <span className="progress-description">vendedor: {vendedor}</span>
            <div className="row">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  data-toggle="modal"
                  data-target={`#modal-warning-${id}`}
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
        id={`modal-warning-${id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={`modalLabel-${id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content bg-warning">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalLabel-${id}`}>
                Registrar Cuota Parcial
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                id={`cerrar-modal-${id}`}
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
                placeholder={`Ej: ${valor-montoCobrado}`}
              />
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                id={`cerrar-modal-${id}`}
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
  )
};
