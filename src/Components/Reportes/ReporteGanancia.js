import React, { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { apiRest } from "../../service/apiRest";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const ReporteGanancia = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filtros, setFiltros] = useState({
    todo: true,
    electro: false,
    credito: false,
  });
  const [totalesPeriodo, setTotalesPeriodo] = useState({
    total: 0,
    totalCredito: 0,
    totalElectro: 0,
  });

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);



  const fetchReporteData = useCallback(async () => {
    setLoading(true);
    let url = `${apiRest}/report/ganancias`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
          tipo: filtros.electro
            ? "electro"
            : filtros.credito
            ? "credito"
            : "todos",
        }),
      });
      const data = await response.json();
      console.log(data);

      if (data) {
        const totales = {
          total: parseFloat(data.total) || 0,
          totalCredito: parseFloat(data.total_credito) || 0,
          totalElectro: parseFloat(data.total_electro) || 0,
        };
        setTotalesPeriodo(totales);
      } else {
        setTotalesPeriodo({
          total: 0,
          totalCredito: 0,
          totalElectro: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching reporte data:", error);
      setTotalesPeriodo({ total: 0, totalCredito: 0, totalElectro: 0 });
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, filtros]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchReporteData();
  };

  // Configurar datos del gráfico
  useEffect(() => {
    if (
      totalesPeriodo.total > 0 ||
      totalesPeriodo.totalCredito > 0 ||
      totalesPeriodo.totalElectro > 0
    ) {
      setChartData({
        labels: ["Créditos", "Electro"],
        datasets: [
          {
            data: [totalesPeriodo.totalCredito, totalesPeriodo.totalElectro],
            backgroundColor: [
              "#1EB264", // Verde
              "#FFB237", // Amarillo
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
      credito: name === "credito",
    });
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Reporte de Ganancias</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          {/* FILTROS */}
          <form onSubmit={handleApplyFilters}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Filtros de Reporte</h3>
              </div>
              <div className="card-body">
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
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Filtros Adicionales: &nbsp;</label>
                      <div className="form-check-inline">
                        <div className="icheck-primary d-inline mr-3">
                          <input
                            type="radio"
                            name="filtro"
                            value="todo"
                            id="todo"
                            checked={filtros.todo}
                            onChange={() =>
                              setFiltros({
                                todo: true,
                                electro: false,
                                credito: false,
                              })
                            }
                          />
                          &nbsp;
                          <label htmlFor="todo">Todo</label>
                        </div>
                        <div className="icheck-primary d-inline mr-3">
                          <input
                            type="radio"
                            value="electro"
                            id="electro"
                            name="filtro"
                            checked={filtros.electro}
                            onChange={() =>
                              setFiltros({
                                todo: false,
                                electro: true,
                                credito: false,
                              })
                            }
                          />
                          &nbsp;
                          <label htmlFor="electro">Electro </label>
                        </div>
                        <div className="icheck-primary d-inline">
                          <input
                            type="radio"
                            value="credito"
                            id="credito"
                            name="filtro"
                            checked={filtros.credito}
                            onChange={() =>
                              setFiltros({
                                todo: false,
                                electro: false,
                                credito: true,
                              })
                            }
                          />
                          &nbsp;
                          <label htmlFor="credito">Créditos &nbsp;</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Aplicar Filtros"}
                </button>
              </div>
            </div>
          </form>
          {/* GRÁFICO Y TOTALES */}
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resumen de Ganancias</h3>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px", position: "relative" }}>
                    {chartData.labels.length > 0 ? (
                      <Doughnut
                        data={chartData}
                        options={CHART_OPTIONS_EJEMPLO}
                      />
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
                    <span className="info-box-icon bg-success">
                      <i className="fas fa-dollar-sign"></i>
                    </span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Ganancias</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.total}
                      </span>
                    </div>
                  </div>

                  <div className="info-box mb-3">
                    <span className="info-box-icon bg-warning">
                      <i className="fas fa-credit-card"></i>
                    </span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Créditos</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.totalCredito}
                      </span>
                    </div>
                  </div>

                  <div className="info-box">
                    <span className="info-box-icon bg-info">
                      <i className="fas fa-bolt"></i>
                    </span>
                    <div className="info-box-content">
                      <span className="info-box-text">Total Electro</span>
                      <span className="info-box-number">
                        ${totalesPeriodo.totalElectro}
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

export default ReporteGanancia;
