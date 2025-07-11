import React, { useEffect, useState } from "react";
import { apiRest } from "../service/apiRest";

export function ListadoVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchVentas = async () => {
       try {
                 const response = await fetch(`${apiRest}/ventas`, {
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
     useEffect(() => {   
         fetchVentas();
     }
     , []);
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
              <th>n°cuota</th>
              <th>clientes</th>
              <th>vendedor</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.nro_cuotas_id}</td>
                <td>{venta.cliente_id}</td>
                <td>{venta.vendedor_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
