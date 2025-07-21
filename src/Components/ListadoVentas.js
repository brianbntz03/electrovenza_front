import React, { useEffect, useState } from "react";
import { apiRest } from "../service/apiRest";
import { convertIsoToDMY } from "../miscellaneus/aux";
import { BotonImprimirCuotas } from "./tiny/BotonImprimirCuotas"

export function ComponentListadoVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchVentas = async () => {
       try {
                 const response = await fetch(`${apiRest}/ventas/last-ten`, {
                     method: 'GET',
                     headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json'
                     },
                 });
 
                 if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                 }
 
                 const data = await response.json();
                 setVentas(data);
                 setLoading(false);
             } catch (error) {
                 console.error("Error detallado:", error);
                 setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
                 setLoading(false);
             }
         }
  useEffect(() => {   fetchVentas();   }, []);
     
  // Función para reintentar la conexión
     const handleRetry = () => {
         setLoading(true);
         setError(null);
         fetchVentas();
     }
     if (loading) {
         return (
             <div className="loading-container">
                 <p>Cargando Ventas...</p>
             </div>
         );
     }
     if (error) {
         return (
             <div className="error-container">
                 <h3>Error de conexión</h3>
                 <p>{error}</p>
                 <button onClick={handleRetry} className="retry-button">Reintentar</button>
             </div>
         );
     }
   if (!ventas || ventas.length === 0) {
         return (
             <div className="error-container">
               No hay Ventas registradas
              </div>
          );
     }


  return (
    <div class="card-body">
      {loading && <p>Cargando ventas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table className="table table-striped table-valign-middle table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Articulo</th>
              <th>Total</th>
              <th>Clientes</th>
              <th>Vendedor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{convertIsoToDMY(venta.fecha)}</td>
                <td>{venta.articulo.nombre}</td>
                <td>{venta.precio}</td>
                <td>{venta.cliente.nombre}</td>
                <td>{venta.vendedor.nombre}</td>
                <td><BotonImprimirCuotas id={venta.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
