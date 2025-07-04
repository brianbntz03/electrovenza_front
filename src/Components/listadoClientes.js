import React, { useState } from 'react'

export function ListadoClientes() {

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const listadoclient = async (e) => {
    try {
      const datosclientes = {
          clientes: datos.map((dat) =>({
            id: dat.id,
            nombre: dat.nombre,
            dni: dat.dni,
            direccion_local: dat.direccion_local,
            direccion_casa: dat.direccion_casa,
            telefono1: dat.telefono1,
            telefono2: dat.telefono2,
            vendedor_id: dat.vendedor_id
          }))
      }

      const response = await fetch("http://localhost:3001/cliente", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };


  return (
    <div class="card-body">
      <p>listado Clientes</p> 
    <table className="table table-striped table-valign-middle table-bordered">
      <thead>
        <tr>
            <th>vendedor</th>
            <th>Nombre</th>
            <th>dni</th>
            <th>Direccion del local</th>
            <th>Direccion de casa</th>
            <th>Telefono 1</th>
            <th>Telefono 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
      </tbody>
    </table>
    </div>
    )
}
