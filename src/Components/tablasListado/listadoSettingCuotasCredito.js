import { useEffect, useState } from "react";
import { CUOTA_TYPE_NAMES } from "../../constants/cuotaTypes";
import { apiRest } from "../../service/apiRest";
import { EditarCuotaCredito } from "../modals/EditarCuotaCredito";

export function ListadoSettingCuotasCredito() {
  const [settingCuotas, setSettingCuotas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cuotaToEdit, setCuotaToEdit] = useState(null); // State to hold the cuota being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const fetchSettingCuotas = async () => {
    try {
      const response = await fetch(`${apiRest}/settings/cuotas-credito`, {
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
      setSettingCuotas(data);
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
    fetchSettingCuotas();
  }, []);


  const handleEditClick = (cuota) => {
    setCuotaToEdit(cuota);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCuotaToEdit(null); 
  };

  const handleCuotaActualizada = (cuotaActualizada) => {
    setSettingCuotas((prevCuotas) =>
      prevCuotas.map((cuota) =>
        cuota.id === cuotaActualizada.id ? cuotaActualizada : cuota
      )
    );
    handleCloseModal();
  };

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
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchSettingCuotas();
          }}
          className="retry-button"
        >
          Reintentar
        </button>
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
          <thead>
            <tr>
              <th>id</th>
              <th>description</th>
              <th>numero</th>
              <th>interes</th>
              <th>tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {settingCuotas.map((settingCuota) => (
              <tr key={settingCuota.id}>
                <td>{settingCuota.id}</td>
                <td>{settingCuota.descripcion}</td>
                <td>{settingCuota.numero}</td>
                <td>{settingCuota.interes}</td>
                <td>{CUOTA_TYPE_NAMES[settingCuota.tipo_cuota]}</td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => handleEditClick(settingCuota)}
                  >
                    editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <EditarCuotaCredito
          cuotaCredito={cuotaToEdit}
          onClose={handleCloseModal}
          onCuotaCreditoActualizada={handleCuotaActualizada}
        />
      )}
    </div>
  );
}
