import { NavLink } from "react-router-dom";
import { ListadoSettingCuotas } from "../Components/tablasListado/listadoSettingCuotas";

const PageListadoSettingCuotasElectro = () => {
  let settingCuotas =  ListadoSettingCuotas();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Configuración de Cuotas e Interes para Electro</h3>
            <div className="card-tools">
              <NavLink to="/crearcuotaelectro" className="btn btn-sm btn-info float-right"> Crear Cuota </NavLink>
              <a class="btn btn-sm btn-success float-right" >  Excel <i className="fas fa-download" /> </a>
              
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {settingCuotas}
          </div>
        </div>
    )
}

export default PageListadoSettingCuotasElectro;