import React, { useState, useEffect } from 'react';
import { apiRest } from '../../service/apiRest';

export function ListadoClientes() {

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
      try {
                const response = await fetch(`${apiRest}/cliente`, {
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
                console.log(data);
                setClientes(data);
                setLoading(false);
            } catch (error) {
                console.error("Error detallado:", error);
                setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
                setLoading(false);
            }
        }
    useEffect(() => {   
        fetchClientes();
    }
    , []);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchClientes();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando Clientes...</p>
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
  if (!clientes || clientes.length === 0) {
        return (
            <div className="error-container">
                No hay clientes registrados
            </div>
        );
    }   

  return (
    <div className="card-body">
      <p>Listado de Clientes</p> 
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Dirección del Local</th>
            <th>Dirección de Casa</th>
            <th>Teléfono 1</th>
            <th>Teléfono 2</th>
            <th>Vendedor</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.dni}</td>
              <td>{cliente.direccion_local}</td>
              <td>{cliente.direccion_casa}</td>
              <td>{cliente.telefono1}</td>
              <td>{cliente.telefono2}</td>
              <td>{cliente.vendedor.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
