import React from 'react'
import { ComisionesPorCreditoPendientes } from '../Components/comisionesPorCreditoPendientes';

const PageComisionesPorCreditoPendientes = () => {
    let comisionesPorCredito = ComisionesPorCreditoPendientes();
    return (
        <>
        <div className="card">
            <div className="card-header border-0">
                <h1 className="card-title">Comisiones por credito pendientes</h1>
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
               {comisionesPorCredito}
            </div>
        </div>
        </>
    )
}

export default PageComisionesPorCreditoPendientes;