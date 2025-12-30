import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Unauthorized access page
 * Displayed when user tries to access a route they don't have permission for
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1>Acceso Denegado</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body text-center" style={{ padding: '3em' }}>
              <i className="fas fa-lock fa-3x text-danger mb-3"></i>
              <h3>No tiene permiso para acceder a esta página</h3>
              <p className="text-muted">
                Esta función está restringida a ciertos roles de usuario.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home mr-2"></i>
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
