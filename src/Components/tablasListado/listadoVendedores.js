import React, { useEffect, useState } from 'react'
import { apiRest } from '../../service/apiRest';

export function ListadoVendedores() {

  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Vendedores desde la API:', data);
      setVendedores(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendedores();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!vendedores || vendedores.length === 0) return <div>No hay vendedores registrados</div>;

  console.log('Vendedores:', vendedores);
  console.log('Vendedores:', vendedores[0].nombre);
  console.log('Vendedores:', vendedores[0].telefono);
  console.log('Vendedores:', vendedores[0].direccion);


  return (
    <div class="card-body">
      <p>Listado de vendedores</p>

        <table className="table table-striped table-valign-middle table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Telefono</th>
                    <th>Direccion</th>
                </tr>
            </thead>
            <tbody>
                {vendedores.map((vendedor, index) => (
                    <tr key={index}>
                        <td>{vendedor.nombre}</td>
                        <td>{vendedor.telefono}</td>
                        <td>{vendedor.direccion}</td>
                    </tr>
                ))}
            
            {/* Placeholder row for consistent table structure */}
            <tr>
                <td colSpan="4" className="text-center">Total de vendedores: {vendedores.length}</td>
            </tr>
        </tbody>
        </table>
      
    </div>
  )
}
