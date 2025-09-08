import { NavLink } from "react-router-dom";
import { ListadoSettingBandaPrecios } from "../Components/tablasListado/listadoSettingBandaPrecios";



const PageSettingBandasPreciosListado = () => {
  let settingCuotas =  ListadoSettingBandaPrecios();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Configuracion de Cuotas e Interes aplicable a créditos</h3>
            <div className="card-tools">
              <NavLink to="/crearcategorias" className="btn btn-sm btn-info float-right"> Crear Cuota </NavLink>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {settingCuotas}
          </div>
        </div>
    )
}

export default PageSettingBandasPreciosListado;