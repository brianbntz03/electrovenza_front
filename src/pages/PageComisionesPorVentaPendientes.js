import React from 'react'
import { ComisionesPorVentaPendientes } from '../Components/comisionesPorVentaPendientes';

const PageComisionesPorVentaPendientes = () => {
    let comisionesPorVenta = ComisionesPorVentaPendientes();
    return (
        <>
        <div className="card">
            <div className="card-header border-0">
                <h1 className="card-title">Presupuestos</h1>
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
               {comisionesPorVenta}
            </div>
        </div>
        </>
    )
}

export default PageComisionesPorVentaPendientes;