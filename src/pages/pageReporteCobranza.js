import ReporteCobranza from "../Components/Reportes/ReporteCobranza";

const PageReporteCobranza = () => {
  let Reporte_Cobranza = ReporteCobranza();
    return (
        <div className="card">
        <div className="card-header border-0">
          <h1 className="card-title">Reporte Cobranza</h1>
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
        {Reporte_Cobranza}
      </div>
    </div>
    )
}


export default PageReporteCobranza