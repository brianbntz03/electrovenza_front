import React from "react"
import ReporteGanancia from "../Components/Reportes/ReporteGanancia"

const PageReporteGanancia = () => {
  let Reporte_ganancia = ReporteGanancia();
    return (
        <div className="card">
        <div className="card-header border-0">
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
        {Reporte_ganancia}
      </div>
    </div>
    )
}


export default PageReporteGanancia