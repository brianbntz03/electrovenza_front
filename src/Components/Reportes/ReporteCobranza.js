import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { apiRest } from "../../service/apiRest";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CHART_OPTIONS_EJEMPLO = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        padding: 20,
      },
    },
  },
  cutout: "65%",
};

const ReporteCobranza = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [filtros, setFiltros] = useState({
    todo: true,
    electro: false,
    creditos: false,
  });

  const [vendedores, setVendedores] = useState([]);
  const [reporteData, setReporteData] = useState([]);
  const [totalesPeriodo, setTotalesPeriodo] = useState({
    totalCobrado: 0,
    totalCredito: 0,
    totalElectro: 0,
  });

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Cargar vendedores
  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const url = `${apiRest}/vendedor?page=1&limit=100`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setVendedores(data.data);
        } else if (Array.isArray(data)) {
          setVendedores(data);
        }
      } catch (error) {
        console.error("Error fetching vendedores:", error);
      }
    };

    fetchVendedores();
  }, []);

  const fetchReporteData = useCallback(async () => {
    let url = `${apiRest}/report/cobranzas`;
    const params = new URLSearchParams();

    let body = new FormData();

    if (fechaDesde) body.append("fecha_desde", fechaDesde);
    if (fechaHasta) body.append("fecha_hasta", fechaHasta);
    if (vendedor) body.append("vendedor_id", vendedor);
    if (filtros.electro) {
      body.append("tipo", "electro");
    } else if (filtros.creditos) {
      body.append("tipo", "creditos");
    } else {
      body.append("tipo", "todo");
    }

    //const queryString = params.toString();
    //if (queryString) url += `?${queryString}`;

    try {
      console.log("Fetching reporte data with body:", body);
      const response = await fetch(url,
        {
        method: "POST",
        body: body,
      }
      );
      const data = await response.json();

      if (data && Array.isArray(data.cobranzas)) {
        setReporteData(data.cobranzas);

        const totales = {
          totalCobrado: parseFloat(data.total) || 0,
          totalCredito: parseFloat(data.total_credito) || 0,
          totalElectro: parseFloat(data.total_electro) || 0,
        };
        setTotalesPeriodo(totales);
      } else {
        setReporteData([]);
        setTotalesPeriodo({
          totalCobrado: 0,
          totalCredito: 0,
          totalElectro: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching reporte data:", error);
      setReporteData([]);
      setTotalesPeriodo({ totalCobrado: 0, totalCredito: 0, totalElectro: 0 });
    }
  }, [fechaDesde, fechaHasta, vendedor, filtros]);

  useEffect(() => {
    fetchReporteData();
  }, [fetchReporteData]);

  // Configurar datos del gráfico
  useEffect(() => {
    if (totalesPeriodo.totalCobrado > 0 || totalesPeriodo.totalCredito > 0 || totalesPeriodo.totalElectro > 0) {
      setChartData({
        labels: ["Total Cobrado", "Créditos", "Electro"],
        datasets: [
          {
            data: [totalesPeriodo.totalCobrado, totalesPeriodo.totalCredito, totalesPeriodo.totalElectro],
            backgroundColor: [
              "#1EB264", // Verde
              "#FFB237", // Amarillo
              "#F0604B", // Rojo
            ],
            borderColor: "#ffffff",
            borderWidth: 3,
          },
        ],
      });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [totalesPeriodo]);

  const handleFiltroChange = (event) => {
    const { name } = event.target;
    setFiltros({
      todo: name === "todo",
      electro: name === "electro",
      creditos: name === "creditos",
    });
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Reporte de Cobranzas</h1>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content">
        <div className="container-fluid">
          {/* FILTROS */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Filtros de Reporte</h3>
            </div>
            <div className="card-body">
              {" "}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Desde:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaDesde"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Hasta:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaHasta"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Vendedor:</label>
                    <select
                      className="form-control"
                      name="vendedor"
                      value={vendedor}
                      onChange={(e) => setVendedor(e.target.value)}
                    >
                      <option value="">Seleccione un vendedor</option>
                      {vendedores.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Filtros Adicionales:</label>
                    <div className="form-check-inline">
                      <div className="icheck-primary d-inline mr-3">
                        <input
                          type="radio"
                          name="filtro"
                          value="todo"
                          checked={filtros.todo}
                          onChange={() => setFiltros({ todo: true, electro: false, creditos: false })}
                        />
                        <label htmlFor="todo">Todo</label>
                      </div>
                      <div className="icheck-primary d-inline mr-3">
                        <input
                          type="radio"
                          value="electro"
                          name="filtro"
                          checked={filtros.electro}
                          onChange={() => setFiltros({ todo: false, electro: true, creditos: false })}
                        />
                        <label htmlFor="electro">Electro</label>
                      </div>
                      <div className="icheck-primary d-inline">
                        <input
                          type="radio"
                          value="credito"
                          name="filtro"
                          checked={filtros.creditos}
                          onChange={() => setFiltros({ todo: false, electro: false, creditos: true })}
                        />
                        <label htmlFor="creditos">Créditos</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* GRÁFICO Y TOTALES */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resumen de Cobranzas</h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px", position: "relative" }}>
                    {chartData.labels.length > 0 ? (
                      <Doughnut data={chartData} options={CHART_OPTIONS_EJEMPLO} />
                    ) : (
                      <p className="text-center text-muted">
                        Sin datos para el gráfico.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Totales del Período</h3>
                </div>
                <div className="card-body">
                  <div className="info-box mb-3">
                    <span className="info-box-icon bg-success"><i className="fas fa-dollar-sign"></i></span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Cobrado</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.totalCobrado.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-box mb-3">
                    <span className="info-box-icon bg-warning"><i className="fas fa-credit-card"></i></span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Créditos</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.totalCredito.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-box">
                    <span className="info-box-icon bg-info"><i className="fas fa-bolt"></i></span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Electro</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.totalElectro.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
};

export default ReporteCobranza;
