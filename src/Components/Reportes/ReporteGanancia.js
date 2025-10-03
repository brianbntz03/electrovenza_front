import React, { useState, useEffect, useRef } from 'react';

const ReporteGanancia = () => {
   const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [tipoCobranza, setTipoCobranza] = useState('');
    
    const [filtros, setFiltros] = useState({
      todo: true,
      electro: false,
      creditos: false,
    });
  
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
  
    const vendedores = ['Vendedor 1', 'Vendedor 2', 'Vendedor 3'];
    const tiposCobranza = ['Contado', 'Crédito'];
  
    // --- Lógica del Gráfico (Se ejecuta al cambiar cualquier filtro) ---
    useEffect(() => {
      // Solo proceder si window.Chart está disponible
      if (chartRef.current && window.Chart) {
        if (chartInstance.current) {
          chartInstance.current.destroy(); // Destruye la instancia anterior
        }
        
        const ctx = chartRef.current.getContext('2d');
        // Datos de ejemplo: Deberías usar los estados de 'filtros' para cargar datos reales aquí.
        chartInstance.current = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [
              {
                label: 'Cobranzas',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }, [filtros, fechaDesde, fechaHasta, vendedor, tipoCobranza]);
  
    // --- Lógica de Manejo de Radio Buttons (Ahora simple y exclusivo) ---
    const handleFiltroChange = (event) => {
      const { name } = event.target;
  
      // Al seleccionar uno, se activa ese y se desactivan automáticamente los demás.
      setFiltros({
        todo: name === 'todo',
        electro: name === 'electro',
        creditos: name === 'creditos',
      });
    };
  
    return (
      <div className="content-wrapper p-4 bg-gray-100 min-h-screen">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1 className="text-3xl font-bold text-gray-800">Reporte de Cobranzas</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            {/* Tarjeta de Filtros */}
            <div className="card shadow-lg mb-6 rounded-xl">
              <div className="card-header bg-white border-b border-gray-200 p-4 rounded-t-xl">
                <h3 className="card-title text-xl font-semibold text-gray-700">Filtros de Reporte</h3>
              </div>
              <div className="card-body p-6">
                <div className="row g-4">
                  {/* Filtro Desde */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desde:</label>
                      <input
                        type="date"
                        className="form-control w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Filtro Hasta */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hasta:</label>
                      <input
                        type="date"
                        className="form-control w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Filtro Vendedor */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor:</label>
                      <select
                        className="form-control w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        value={vendedor}
                        onChange={(e) => setVendedor(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {vendedores.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cobranza:</label>
                      <select
                        className="form-control w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        value={tipoCobranza}
                        onChange={(e) => setTipoCobranza(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {tiposCobranza.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
  
                <div className="row mt-4">
                  <div className="col-md-12">
                      <div className="form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Filtros Adicionales:</label>
                          <div className="flex space-x-4">
                              <div className="form-check flex items-center">
                              <input
                                  className="form-check-input h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
                                  type="radio" 
                                  name="todo"
                                  checked={filtros.todo}
                                  onChange={handleFiltroChange}
                                  id="check-todo"
                              />
                              <label className="form-check-label ml-2 text-gray-700 cursor-pointer" htmlFor="check-todo">Todo</label>
                              </div>
                              {/* Radio Button Electro */}
                              <div className="form-check flex items-center">
                              <input
                                  className="form-check-input h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
                                  type="radio" // <-- CAMBIO A radio
                                  name="electro"
                                  checked={filtros.electro}
                                  onChange={handleFiltroChange}
                                  id="check-electro"
                              />
                              <label className="form-check-label ml-2 text-gray-700 cursor-pointer" htmlFor="check-electro">Electro</label>
                              </div>
                              {/* Radio Button Créditos */}
                              <div className="form-check flex items-center">
                              <input
                                  className="form-check-input h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
                                  type="radio" // <-- CAMBIO A radio
                                  name="creditos"
                                  checked={filtros.creditos}
                                  onChange={handleFiltroChange}
                                  id="check-creditos"
                              />
                              <label className="form-check-label ml-2 text-gray-700 cursor-pointer" htmlFor="check-creditos">Créditos</label>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tarjeta de Gráfico */}
            <div className="card shadow-lg rounded-xl">
              <div className="card-header bg-white border-b border-gray-200 p-4 rounded-t-xl">
                <h3 className="card-title text-xl font-semibold text-gray-700">Gráfico de Cobranzas</h3>
              </div>
              <div className="card-body p-6">
                <div style={{ height: '400px', width: '100%' }}>
                    <canvas ref={chartRef} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
  

export default ReporteGanancia;
