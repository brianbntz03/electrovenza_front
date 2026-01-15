import { useEffect, useState } from 'react';
import { apiRest } from '../../service/apiRest';
import { EditarBandaPreciosModal } from '../modals/EditarBandaPreciosModal';



export function ListadoSettingBandaPrecios() {
    const [settingBandas, setSettingBandas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectBanda, setSelectBanda] = useState(null);
        

    const handleOpenModal = (banda) => {
    setSelectBanda(banda);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectBanda(null);
    setIsModalOpen(false);
  }

  const handleBandaActualizado = (bandaActualizada) => {
    const nuevasBandas = settingBandas.map((banda) =>
      banda.id === bandaActualizada.id ? bandaActualizada : banda
    ); 
    setSettingBandas(nuevasBandas);
    localStorage.setItem('settingBandas', JSON.stringify(nuevasBandas));
  }

    const handleEliminar = async (id) => {
        
    try {
        
         await fetch(`${apiRest}/setting-escala-precios/${id}`, {
             method: 'DELETE',
             headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              },
         });

        // Elimina la configuracion para la banda de precios
        const nuevasSettingCuotas = settingBandas.filter(banda => banda.id !== id);
        setSettingBandas(nuevasSettingCuotas);
    } catch (error) {
        console.error("Error al eliminar la banda de precios:", error);
    }
};



    const fetchSettingBandaPrecios = async () => {
        try {
            const response = await fetch(`${apiRest}/setting-escala-precios`, {
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
            setSettingBandas(data);
            setLoading(false);
        } catch (error) {
            console.error("Error detallado:", error);
            setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchSettingBandaPrecios();
    }
    , []);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchSettingBandaPrecios();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando configuraciones para definir banda de precios...</p>
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
  if (!settingBandas || settingBandas.length === 0) {
        return (
            <div className="error-container">
                <h3>No hay configuraciones para definición de bandas de precios disponibles</h3>
            </div>
        );
    }   
     return (
         <div className="card">   
             <div className="card-body table-responsive p-0"> 
                 <table className="table table-striped table-valign-middle table-bordered">
                    <tbody>
                     <tr>
                         <th> id </th>
                         <th> Banda Superior </th>
                         <th> Descripcion </th>
                         <th> % Minorista </th>
                         <th> % Mayorista </th>
                         <th> % Comision Vendedeor </th>
                         <th> </th>
                     </tr>
                     {settingBandas.map((settingCuota) => (
                    <tr key={settingCuota.id}>
                        <td> {settingCuota.id } </td>   
                        <td> {settingCuota.banda_superior.toLocaleString()} </td>
                        <td> {settingCuota.descripcion} </td>
                        <td> {settingCuota.porcentaje_minorista} </td>
                        <td> {settingCuota.porcentaje_mayorista} </td>
                        <td> {settingCuota.porcentaje_comision_vendedor} </td>
                        <td> 
                            <button
                            className="link-button"
                            onClick={() => handleOpenModal(settingCuota)}
                            >
                            editar
                            </button>
                            <button
                            className="link-button"
                            onClick={() => handleEliminar(settingCuota.id)}
                            >
                            eliminar
                            </button>
                        </td>
                    </tr>
                     ))}
                   </tbody>  
                 </table>
                 {isModalOpen && (
                    <EditarBandaPreciosModal
                        banda={selectBanda}
                        onClose={handleCloseModal}
                        onBandaActualizada={handleBandaActualizado}
                    />
                    )}
             </div>
         </div>
     )
}