import React from 'react'
import { Comisionesporventapendientesvendedor } from '../Components/Comisionesporventapendientesvendedor';

const PageComisionesPorVentaPendientesVendedor = () => {
    return (
        <>
        <div className="card">
            <div className="card-header border-0">
                <h1 className="card-title">Comisiones por pendientes de liquidación del vendedor</h1>
            </div>
            <div className="card-body table-responsive p-0">
                <Comisionesporventapendientesvendedor />
            </div>
        </div>
        </>
    )
}

export default PageComisionesPorVentaPendientesVendedor;