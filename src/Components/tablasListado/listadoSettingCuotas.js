import React, { useEffect, useState } from "react";
import { CUOTA_TYPE_NAMES } from "../../constants/cuotaTypes";
import { apiRest } from "../../service/apiRest";
import { EditarCuotaElectro } from "../modals/EditarCuotaElectro";
import { authenticatedFetch } from "../../utils/authenticatedFetch";

export function ListadoSettingCuotas() {
  const [settingCuotas, setSettigCuotas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCuota, setEditingCuota] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const fetchSettingCuotas = async () => {
    try {
      const response = await authenticatedFetch(`${apiRest}/settings/cuotas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSettigCuotas(data);
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo: ${error.message}`
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingCuotas();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchSettingCuotas();
  };

  const handleEdit = (cuota) => {
    setEditingCuota(cuota);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCuota(null);
  };

  const handleCuotaActualizada = (updatedCuota) => {
    setSettigCuotas((prevCuotas) =>
      prevCuotas.map((cuota) =>
        cuota.id === updatedCuota.id ? updatedCuota : cuota
      )
    );
    handleCloseModal();
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Cargando configuraciones para cuotas...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  if (!settingCuotas || settingCuotas.length === 0)
    return (
      <div className="error-container">
        <h3>No hay configuraciones para cuotas disponibles</h3>
      </div>
    );

  return (
    <div className="card">
      <div className="card-body table-responsive p-0">
        <table className="table table-striped table-valign-middle table-bordered">
          <thead>
            <tr>
              <th> id </th>
              <th> description </th>
              <th> numero </th>
              <th> interes </th>
              <th> tipo </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {settingCuotas.map((settingCuota) => (
              <tr key={settingCuota.id}>
                <td> {settingCuota.id} </td>
                <td> {settingCuota.descripcion} </td>
                <td> {settingCuota.numero} </td>
                <td> {settingCuota.interes} </td>
                <td> {CUOTA_TYPE_NAMES[settingCuota.tipo_cuota]} </td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => handleEdit(settingCuota)}
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
        <EditarCuotaElectro
          cuotaElectro={editingCuota}
          onClose={handleCloseModal}
          onCuotaActualizada={handleCuotaActualizada}
        />
      )}
    </div>
  );
}
