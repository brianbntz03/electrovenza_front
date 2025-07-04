import React from "react";

export function Listadoproveedores() {
  return (
    <div class="card-body">
      <p>Listado de los proveedores</p>
      <table className="table table-striped table-valign-middle table-bordered">
        {" "}
        <tr>
          <th>Nombre</th>
          <th>Telefono</th>
          <th>Correo</th>
          <th>Direccion</th>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  );
}
