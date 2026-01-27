import React, { useEffect, useState } from "react";
import { apiRest } from "../../service/apiRest";
import { convertIsoToDMY } from "../../miscellaneus/aux";
import { BotonImprimirCuotas } from "../tiny/BotonImprimirCuotas";
import { BotonAnularCredito } from "../tiny/BotonAnularCredito";
import { BotonCuotasPendientes } from "../tiny/BotonCuotasPendientes";
import { EstadosVentas } from "../../constants/ventas";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export function ComponentListadoVentasMayorista() {
  const storageObjectName = "ventas";
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const urlObject = `${apiRest}/ventas-mayorista/filter-by-vendedor`;
  const titlePlural = "Articulos Otorgados";
  const [mostrarPagadas, setMostrarPagadas] = useState(false);

  const handleObjectActualizado = (objectActualizado) => {
    const nuevosObjects = ventas.map((c) =>
      c.id === objectActualizado.id ? { ...c, ...objectActualizado } : c
    );
    setVentas(nuevosObjects);
    localStorage.setItem("ventas", JSON.stringify(nuevosObjects));
  };

  const ventasFiltradas = ventas.filter((venta) => {
    if (mostrarPagadas) {
      return venta.estado_venta === 3; // Solo mostrar pagadas
    }
    return venta.estado_venta === 1; // Solo mostrar generadas
  });

  
  const fetchVentas = async () => {
    try {
      const response = await authenticatedFetch(`${apiRest}/ventas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('URL del servidor:', `${apiRest}/ventas`); // Ver qué servidor está usando
      console.log('Datos de ventas:', data); // Para debuggear
      console.log('Primera venta:', data[0] || data[Object.keys(data)[0]]?.[0]); // Ver estructura
      // Si los datos vienen agrupados por vendedor, los aplanamos
      let ventasArray = [];
      if (typeof data === 'object' && !Array.isArray(data)) {
        // Los datos vienen como {"Carlos": [...], "Otro": [...]}
        ventasArray = Object.values(data).flat();
      } else {
        ventasArray = data;
      }
      setVentas(ventasArray);
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
    fetchVentas();
    
    // Escuchar eventos de actualización de ventas
    const handleVentaActualizada = () => {
      fetchVentas();
    };
    
    window.addEventListener('ventaActualizada', handleVentaActualizada);
    
    return () => {
      window.removeEventListener('ventaActualizada', handleVentaActualizada);
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchVentas();
  };

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
        <button onClick={handleRetry} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }
  if (!ventas || ventas.length === 0) {
    return <div className="error-container">No hay Ventas registradas</div>;
  }

  return (
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">
          listado de <strong>{titlePlural}</strong>
        </p>
      </div>
      <div className="form-check form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          id="filterPagado"
          checked={mostrarPagadas}
          onChange={(e) => setMostrarPagadas(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="filterPagado">
          Mostrar ventas pagados
        </label>
      </div>

      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Articulo</th>
            <th>Total</th>
            <th>Clientes</th>
            <th>Vendedor</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>
                {venta.fecha ? convertIsoToDMY(venta.fecha) : "Sin fecha"}
              </td>
              
              <td>{venta?.articulo?.nombre}</td>
              <td>${venta.precio}</td>
              <td>{venta?.cliente?.nombre}</td>
              <td>{venta?.vendedor?.nombre}</td>
              
              <td>
               <span
                  className={`badge ${
                    venta.estado_credito === 3 ? "bg-success" : "bg-primary"
                  }`}
                >
                  {EstadosVentas[venta.estado_venta] }
                </span>
              </td>
              <td>
                <BotonImprimirCuotas id={venta.id} /> &nbsp;
                <BotonCuotasPendientes id={venta.id} /> &nbsp;
                <BotonAnularCredito id={venta.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
