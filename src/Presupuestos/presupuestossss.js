import React from 'react'
import { ArticuloPresupuesto } from '../Components/articulo-presupuesto';


const Presupuestossss = () => {
    let articulos = ArticuloPresupuesto();
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
               {articulos}
            </div>
        </div>
        </>
    )
}

export default Presupuestossss;