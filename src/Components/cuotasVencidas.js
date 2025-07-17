import React, { useState, useEffect } from 'react';
import { apiRest } from '../service/apiRest';
import CuotaVencida from './CuotaVencida';

export function CuotasVencidas() {

  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contador, setContador] = useState(0)

  const incrementarContador = () => {
    setContador(contador+1);
  }

  const fetchCuotas = async () => {
      try {
                const response = await fetch(`${apiRest}/cuota_venta`, {
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
                setCuotas(data);
                setLoading(false);
            } catch (error) {
                console.error("Error detallado:", error);
                setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
                setLoading(false);
            }
        }
    useEffect(() => {   
        fetchCuotas();
    }
    , [contador]);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchCuotas();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando Cuotas a cobrar...</p>
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
  if (!cuotas || cuotas.length === 0) {
        return (
            <div className="error-container">
                No hay clientes registrados
            </div>
        );
    }   

  return (
    <div className="card-body">
          { Object.entries(cuotas).map(([cliente, ListadoDeCuotas]) => (
            <div className='card card-widget'>
                <div className='card-header'>
                <div className="user-block">
                  <img className="img-circle" src="../dist/img/user1-128x128.jpg" alt="User Image" />
                  <span className="username"><a href="#">Cliente: {cliente}</a></span>

                </div>
                </div>
                
              <div class="card-footer p-0">
                <div class="row">
                  
                  {ListadoDeCuotas.map(cuota => (
                    <CuotaVencida id={cuota.id} fecha={cuota.fecha} articulo={cuota.articulo} valor={cuota.valor} vendedor={cuota.vendedor} incrementarContador={incrementarContador} />
                    ))}
                </div>

              </div>
            <hr/>
            
            <hr/>
            </div>
          ))}
        
    </div>
  );
}
