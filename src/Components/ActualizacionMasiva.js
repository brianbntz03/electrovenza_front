import React, { useState } from "react";
import Swal from "sweetalert2";
import { apiRest } from "../service/apiRest";
import FlashMessageConfirm from "./tiny/ConfirmMessage";

export default function ActualizacionMasiva() {
  const [porcentaje, setPorcentaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await FlashMessageConfirm("Seguro que desea actualizar masivamente?", "Ejecutará una actualización masiva precios, quiere continuar?");
        if(!response){
          return ; 
        }
    
    try {
      const response = await fetch(`${apiRest}/articulos/actualizacion-masiva`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ porcentaje: Number(porcentaje) }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Los precios se han actualizado correctamente",
        });
        setPorcentaje("");
      } else {
        throw new Error("Error al actualizar los precios");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar los precios",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid">
      <h2>Actualización Masiva del precio</h2>
      <p>Descripción: Ingrese el porcentaje de actualización</p>
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="number"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="form-control d-inline-block"
          style={{ width: "200px" }}
          placeholder="Ingrese el porcentaje (1-100)"
          min="1"
          max="100"
          required
        />&nbsp;
        <button type="submit" className="btn btn-sm btn-info">
          Actualizar Precios
        </button>
      </form>
    </div>
  );
}
