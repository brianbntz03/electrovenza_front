import React from 'react'
import { ComisionesPorVentaPendientesVendedor } from '../Components/ComisionesPorVentaPendientesVendedor';

const PageComisionesPorVentaPendientesVendedor = () => {
    return (
        <>
        <div className="card">
            <div className="card-header border-0">
                <h1 className="card-title">Comisiones pendientes de liquidación del vendedor</h1>
            </div>
            <div className="card-body table-responsive p-0">
               <ComisionesPorVentaPendientesVendedor />
            </div>
        </div>
        </>
    )
}

export default PageComisionesPorVentaPendientesVendedor;