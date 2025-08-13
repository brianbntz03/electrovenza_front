import { ListadoSettingCuotasCredito } from "../Components/tablasListado/listadoSettingCuotasCredito";


const PageSettingCuotasCreditoListado = () => {
  let settingCuotas =  ListadoSettingCuotasCredito();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Configuracion de Cuotas e Interes aplicable a créditos</h3>
            <div className="card-tools">
              <a class="btn btn-sm btn-info float-right" href='/crearcategorias' > Crear Cuota</a>
              <a class="btn btn-sm btn-success float-right" href="/" >  Excel <i className="fas fa-download" /> </a>
              
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {settingCuotas}
          </div>
        </div>
    )
}

export default PageSettingCuotasCreditoListado;