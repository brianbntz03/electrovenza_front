import React from 'react';

/**
 * Placeholder page for wholesale seller account statements (Cuenta Corriente)
 * This functionality will be implemented in a future phase
 */
export default function CuentaCorrienteMayorista() {
  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1>Cuenta Corriente Mayorista</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <p className="text-center text-muted" style={{ fontSize: '1.2em', padding: '3em' }}>
                <i className="fas fa-clock fa-3x mb-3 d-block"></i>
                Esta funcionalidad estará disponible próximamente.
                <br />
                <small className="d-block mt-3">
                  Aquí podrá gestionar la cuenta corriente de sus clientes mayoristas.
                </small>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
