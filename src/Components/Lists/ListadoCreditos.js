import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";
import { ModalEditarCreditos } from "../modals/ModalEditarCreditos";
import { convertIsoToDMY } from "../../miscellaneus/aux";
import { BotonImprimirCuotasCredito } from "../tiny/BotonImprimirCuotasCredito";
import { BotonCreditosCuotasPendientes } from "../tiny/BotonCreditosCuotasPendientes";
import { BotonAnularCredito } from "../tiny/BotonAnularCredito";
import { CUOTA_TYPE_NAMES } from "../../constants/cuotaTypes";
import { EstadosCredito } from "../../constants/creditos";

export function ListadoCreditos() {
  const storaObjectName = "creditos";
  const urlObject = `${apiRest}/credito/filter-by-vendedor`;
  const titlePlural = "Creditos Otorgados";

  const [colectivo, setColectivo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarPagado, setMostrarPagado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [fechaInicio, setFechaInicio] = useState(
    thirtyDaysAgo.toISOString().split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState(today.toISOString().split("T")[0]);

  const handleCloseModal = () => {
    setSelectedObject(null);
    setIsModalOpen(false);
  };

  const handleObjectActualizado = (objectActualizado) => {
    const nuevosObjects = colectivo.map((c) =>
      c.id === objectActualizado.id ? { ...c, ...objectActualizado } : c
    );
    setColectivo(nuevosObjects);
    localStorage.setItem(storaObjectName, JSON.stringify(nuevosObjects));
  };

  const creditoFilter = colectivo.filter((credito) => {
    if (mostrarPagado) {
      return credito.estado_credito === 3; // Solo mostrar pagados
    }
    return credito.estado_credito !== 3; // Solo mostrar no pagados
  });

  const fetchCreditosAsignados = async (
    fechaInicioParam = fechaInicio,
    fechaFinParam = fechaFin
  ) => {
    try {
      const vendedorId = localStorage.getItem("vendedor_id");
      const url =
        Number(vendedorId) > 0
          ? `${urlObject}/${vendedorId}`
          : `${apiRest}/credito/`;
      let response = null;

      if (vendedorId > 0) {
        response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            vendedor_id: Number(vendedorId),
            fecha_inicio: fechaInicioParam,
            fecha_fin: fechaFinParam,
          }),
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setColectivo(data);
      localStorage.setItem(storaObjectName, JSON.stringify(data));
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
    fetchCreditosAsignados();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchCreditosAsignados();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetchCreditosAsignados(fechaInicio, fechaFin);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando {titlePlural}...</p>
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
  if (!colectivo || colectivo.length === 0) {
    return (
      <div className="error-container">No hay {titlePlural} registrados</div>
    );
  }

  return (
    <div className="card-body">
      <p>Listado de {titlePlural}</p>
      {/*
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row">
          <div className="col-md-4">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label>Fecha Fin:</label>
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn-primary">
              Filtrar
            </button>
          </div>
        </div>
      </form>
      */}
      <div className="form-check form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          id="filterPagado"
          checked={mostrarPagado}
          onChange={(e) => setMostrarPagado(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="filterPagado">
          Mostrar credito Pagados
        </label>
      </div>
      <table className="table table-striped table-valign-middle table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th># cuotas</th>
            <th>Vendedor</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {creditoFilter.map((object) => (
            <tr key={object.id}>
              <td>{object.id}</td>
              <td>
                {object.fecha ? convertIsoToDMY(object.fecha) : "Sin fecha"}
              </td>
              <td>{object.cliente.nombre}</td>
              <td>{object.monto}</td>
              <td>
                {CUOTA_TYPE_NAMES[object.setting_cuotas_credito.tipo_cuota]}
              </td>
              <td>{object.setting_cuotas_credito.descripcion}</td>
              <td>{object.vendedor.nombre}</td>
              <td>
                <span
                  className={`badge ${
                    object.estado_credito === 3 ? "bg-success" : "bg-primary"
                  }`}
                >
                  {EstadosCredito[object.estado_credito]}
                </span>
              </td>
              <td>
                <BotonImprimirCuotasCredito id={object.id} /> &nbsp;
                <BotonCreditosCuotasPendientes id={object.id} /> &nbsp;
                <BotonAnularCredito id={object.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <ModalEditarCreditos
          object={selectedObject}
          onClose={handleCloseModal}
          onObjectActualizado={handleObjectActualizado}
        />
      )}
    </div>
  );
}
