import React, { useState } from 'react';
import CrearTipoMovimientoCC from '../Components/Crear/CrearTipoMovimientoCC';
import ListadoTipoMovimientoCC from '../Components/tablasListado/ListadoTipoMovimientoCC';

const PageTipoMovimientoCC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Tipos de Movimiento CC</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Listado de Tipos de Movimiento</h3>
              <button 
                className="btn btn-primary btn-sm float-right"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="fas fa-plus"></i> Nuevo Tipo Movimiento
              </button>
            </div>
            <div className="card-body">
              <ListadoTipoMovimientoCC refresh={refreshList} />
            </div>
          </div>
          
          {showCreateForm && (
            <div className="card mt-3">
              <div className="card-header">
                <h3 className="card-title">Crear Nuevo Tipo Movimiento</h3>
                <button 
                  className="btn btn-secondary btn-sm float-right"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </button>
              </div>
              <div className="card-body">
                <CrearTipoMovimientoCC onSuccess={handleCreateSuccess} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PageTipoMovimientoCC;