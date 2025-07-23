import React, { useState } from "react";
import { apiRest } from "../service/apiRest";

export default function CuotaVencida(cuota) {
  const [montoParcial, setMontoParcial] = useState("");

  const registrarPagoParcial = async () => {
    if (!montoParcial || isNaN(montoParcial) || Number(montoParcial) <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    try {
      const response = await fetch(`${apiRest}/cuota_venta/parcial/${cuota.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monto: montoParcial }),
      });

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
      const confirmacion = window.confirm("¿Esta seguro de que quiere marcar como pagada la cuota?");
      if (!confirmacion) return;

      const response = await fetch(`${apiRest}/cuota_venta/${cuota.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      cuota.incrementarContador();
      return data;
    } catch (error) {
      console.error("Error detallado:", error);
    }
  };

  return (
    <div class="col-md-3 col-sm-6 col-12">
        <div className='info-box bg-warning'>
            <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>

            <div class="info-box-content">
                <span class="info-box-text">{cuota.fecha} ({cuota.id})</span>
                <span class="progress-description">{cuota.articulo}</span>
                <span class="info-box-number">${cuota.montoCobrado} de {cuota.valor}</span>
                <span class="progress-description">{cuota.vendedor}</span>
                <div className='row'>
                    <div className='col-6'>
                        <button className="btn btn-sm btn-success">Pago parcial</button>
                    </div>
                    <div className='col-6'>
                        <button 
                        onClick={registrarPago}
                        className="btn btn-sm btn-primary">Pagar</button>
                    </div>
                </div>
                
                
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
