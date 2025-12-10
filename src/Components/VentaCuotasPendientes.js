import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreditoCuotaVencida from "./CreditoCuotaVencida";
import { apiRest } from "../service/apiRest";
import CuotaVencida from "./CuotaVencida";

export function VentaCuotasPendientes() {
  const { venta_id } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contador, setContador] = useState(0);

  const incrementarContador = () => {
    setContador(contador + 1);
  };

  const fetchCuotas = async () => {
    try {
      const response = await fetch(`${apiRest}/cuota_venta/get-cuotas-pendientes/${venta_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
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
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuotas();
  }, [contador, venta_id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchCuotas();
  };

  const handleBorrarCuota = (idCuota) => {
    const nuevaLista = cuotas.filter((cuota) => cuota.id !== idCuota);
    setCuotas(nuevaLista);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando Cuotas pendientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  if (!cuotas || cuotas.length === 0) {
    return <div className="error-container">No hay cuotas pendientes</div>;
  }

  const clienteNombre = cuotas[0]?.credito?.cliente?.nombre || "Cliente";

  return (
    <div className="card-body">
      <div className='card card-widget'>
        <div className='card-header'>
          <div className="user-block">
            <img className="img-circle" src="../dist/img/user1-128x128.jpg" alt="face" />
            <span className="username">Cliente: {clienteNombre}</span>
          </div>
        </div>

        <div className="card-footer p-0">
          <div className="row">
            {cuotas.map(cuota => (
              <CuotaVencida 
              id={cuota.id} 
              numero={cuota.numero} 
              fecha={cuota.fecha} 
              articulo={cuota.venta.articulo.nombre} 
              valor={cuota.valor} 
              montoCobrado={cuota.monto_cobrado} 
              vendedor={cuota.venta.vendedor.nombre} 
              estado={cuota.estado} 
              incrementarContador={incrementarContador} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}