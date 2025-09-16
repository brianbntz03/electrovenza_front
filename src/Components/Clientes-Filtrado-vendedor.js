import React, { useState, useEffect } from "react";

export default function Clientes_filtrado_vendedor() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchClientes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let endpoint = "http://tu-api.com/cliente"; 

        if (user.role === "vendedor") {
          endpoint = `http://tu-api.com/cliente/filtro-por-vendedor/${user.id}`;
        }

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [user]);

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  return (
    <div>
      <h1>Listado de Clientes</h1>
      {clientes.length > 0 ? (
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id}>
              {cliente.nombre} {cliente.apellido}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron clientes.</p>
      )}
    </div>
  );
}