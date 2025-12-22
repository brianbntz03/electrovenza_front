import React, { useState, useEffect } from "react";
import CreditoCuotaVencida from "./CreditoCuotaVencida";
import { apiRest } from "../service/apiRest";

export function CreditosCuotasVencidas() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contador, setContador] = useState(0);

  const incrementarContador = () => {
    setContador(contador + 1);
  };

  const fetchCuotas = async () => {
    try {
      console.log("Fetching cuotas de crédito...");
      const response = await fetch(
        `${apiRest}/cuota_credito/get-cuotas-vencidas`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Token enviado:", localStorage.getItem("jwt_token"));

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos recibidos de cuotas de crédito:", data);
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
    nuevaLista[cliente] = nuevaLista[cliente].filter(
      (cuota) => cuota.id !== idCuota
    );
    setCuotas(nuevaLista);
  };

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
      {Object.entries(cuotas).map(([cliente, ListadoDeCuotas]) => (
        <>
          <div className="card card-widget">
            <div className="card-header">
              <div className="user-block">
                <img
                  className="img-circle"
                  src="../dist/img/user1-128x128.jpg"
                  alt="face"
                />
                <span className="username">Cliente: {cliente}</span>
              </div>
            </div>

            <div className="card-footer p-0">
              <div className="row">
                {ListadoDeCuotas.map((cuota) => (
                  <CreditoCuotaVencida
                    id={cuota.id}
                    numero={cuota.numero}
                    fecha={cuota.fecha}
                    articulo={cuota.articulo}
                    valor={cuota.valor}
                    montoCobrado={cuota.monto_cobrado}
                    vendedor={cuota.vendedor}
                    estado={cuota.estado}
                    credito_fecha={cuota.credito_fecha}
                    credito_monto={cuota.credito_monto}
                    credito_numero={cuota.credito_numero}
                    incrementarContador={incrementarContador}
                  />
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
