import React from 'react' ;
import OtorgarCredito from '../Components/OtorgarCredito';

const PageOtorgarCredito = () => {
    let otorgarcredito = OtorgarCredito();
    return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">otorgar credito</h3>
            <div className="card-tools">
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-download" />
              </a>
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-bars" />
              </a>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {otorgarcredito}
          </div>
        </div>
      )
    }

export default PageOtorgarCredito