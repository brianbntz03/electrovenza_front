import { ListadoSettingCuotas } from "../Components/listadoSettingCuotas";

const PageListadoCuotas = () => {
  let settingCuotas =  ListadoSettingCuotas();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Categorias</h3>
            <div className="card-tools">
              <a class="btn btn-sm btn-info float-right" href='/crearcategorias' > Crear Cuota</a>
              <a class="btn btn-sm btn-success float-right" >  Excel <i className="fas fa-download" /> </a>
              
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {settingCuotas}
          </div>
        </div>
    )
}

export default PageListadoCuotas;