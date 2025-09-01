import React, { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import CreditaPagar from "./creditoApagar";

export function CreditosVencidos() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contador, setContador] = useState(0);

  const incrementarContador = () => {
    setContador(contador + 1);
  };

  const fetchCuotas = async () => {
    try {
      const response = await fetch(`${apiRest}/credito/cuotas_vencidas`, {
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
  }, [contador]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchCuotas();
  };

  const handleBorrarCuota = (cliente, idCuota) => {
    const nuevaLista = { ...cuotas };
    nuevaLista[cliente] = nuevaLista[cliente].filter((cuota) => cuota.id !== idCuota);
    setCuotas(nuevaLista);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando Creditos a cobrar...</p>
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

  if (!cuotas || Object.keys(cuotas).length === 0) {
    return <div className="error-container">No hay cuotas pendientes</div>;
  }

  return (
    <div className="card-body">
          { Object.entries(cuotas).map(([cliente, ListadoDeCuotas]) => (
            <>
            <div className='card card-widget'>
              <div className='card-header'>
                <div className="user-block">
                  <img className="img-circle" src="../dist/img/user1-128x128.jpg" alt="face" />
                  <span className="username">Cliente: {cliente}</span>
                </div>
              </div>

              <div class="card-footer p-0">
                <div class="row">
                  {ListadoDeCuotas.map(cuota => (
                    <CreditaPagar id={cuota.id} fecha={cuota.fecha} articulo={cuota.articulo} valor={cuota.valor} montoCobrado={cuota.monto_cobrado} vendedor={cuota.vendedor} estado={cuota.estado} incrementarContador={incrementarContador} />
                  ))}
                </div>
              </div>

              <hr />
            </div>
            
              </>
      ))}
    </div>
  );
}
