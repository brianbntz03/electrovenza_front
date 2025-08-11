import React from 'react';
import { useEffect, useState } from 'react';
import { apiRest } from '../../service/apiRest';

export function ListadoCategoria() {
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleEliminar = async (id) => {
        
    try {
        await fetch(`${apiRest}/categoria/${id}`, {
             method: 'DELETE',
         });
        const nuevasCategorias = categorias.filter(categoria => categoria.id !== id);
        setCategorias(nuevasCategorias);
    } catch (error) {
        console.error("Error al eliminar la categoria:", error);
    }
};



    const fetchCategorias = async () => {
        try {
            const response = await fetch(`${apiRest}/categoria`, {
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
            setCategorias(data);
            setLoading(false);
        } catch (error) {
            console.error("Error detallado:", error);
            setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCategorias();
    }
    , []);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchCategorias();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando categorias...</p>
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
  if (!categorias || categorias.length === 0) {
        return (
            <div className="error-container">
                <h3>No hay categorias disponibles</h3>
            </div>
        );
    }   
     return (
         <div className="card">   
             <div className="card-body table-responsive p-0"> 
                 <table className="table table-striped table-valign-middle table-bordered">
                     <tr>
                         <th> id </th>
                         <th> nombre </th>
                         <th> descripcion </th>
                         <th> activo </th>
                         <th> </th>
                     </tr>
                     {categorias.map((categoria) => (
                         <tr key={categoria.id}>
                             <td> {categoria.id } </td>   
                             <td> {categoria.nombre} </td>
                             <td> {categoria.descripcion} </td>
                             <td> {categoria.activo} </td>
                             <td> 
                                 <button className="link-button" onClick={() => console.log('Editar clicked')}>editar</button> 
                                 <button className="link-button" onClick={() => handleEliminar(categoria.id)}>eliminar</button>
                             </td>
                         </tr>
                     ))}
                 </table>
             </div>
         </div>
     )
}