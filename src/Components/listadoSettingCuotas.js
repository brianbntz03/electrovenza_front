import { useEffect, useState } from 'react';
import '../Components/categorias.css';
import { CUOTA_TYPE_NAMES } from '../constants/cuotaTypes';
import { apiRest } from '../service/apiRest';


export function ListadoSettingCuotas() {
    const [settingCuotas, setSettigCuotas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleEliminar = async (id) => {
        
    try {
        
         await fetch(`${apiRest}/settings/cuotas/${id}`, {
             method: 'DELETE',
         });

        // Elimina el tipo de cuota del setting
        const nuevasSettingCuotas = settingCuotas.filter(cuota => cuota.id !== id);
        setSettigCuotas(nuevasSettingCuotas);
    } catch (error) {
        console.error("Error al eliminar la configuracion de cuota:", error);
    }
};



    const fetchSettingCuotas = async () => {
        try {
            const response = await fetch(`${apiRest}/settings/cuotas`, {
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
            setSettigCuotas(data);
            setLoading(false);
        } catch (error) {
            console.error("Error detallado:", error);
            setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchSettingCuotas();
    }
    , []);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchSettingCuotas();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando configuraciones para cuotas...</p>
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
  if (!settingCuotas || settingCuotas.length === 0) {
        return (
            <div className="error-container">
                <h3>No hay configuraciones para cuotas disponibles</h3>
            </div>
        );
    }   
     return (
         <div className="card">   
             <div className="card-body table-responsive p-0"> 
                 <table className="table table-striped table-valign-middle table-bordered">
                     <tr>
                         <th> id </th>
                         <th> description </th>
                         <th> numero </th>
                         <th> interes </th>
                         <th> tipo </th>
                         <th> </th>
                     </tr>
                     {settingCuotas.map((settingCuota) => (
                         <tr key={settingCuota.id}>
                             <td> {settingCuota.id } </td>   
                             <td> {settingCuota.descripcion} </td>
                             <td> {settingCuota.numero} </td>
                             <td> {settingCuota.interes} </td>
                             <td> {CUOTA_TYPE_NAMES[settingCuota.tipo_cuota]} </td>
                             <td> 
                                 <button className="link-button" onClick={() => console.log('Editar clicked')}>editar</button> 
                                 <button className="link-button" onClick={() => console.log('Eliminar esta deshabilitado')}>eliminar</button>
                             </td>
                         </tr>
                     ))}
                 </table>
             </div>
         </div>
     )
}