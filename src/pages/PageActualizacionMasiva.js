import { NavLink } from "react-router-dom";
import ActualizacionMasiva from "../Components/ActualizacionMasiva";


const PageActualizacionMasiva = () => {
  let actualizacionMasiva =  ActualizacionMasiva();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Actualizacion Masiva</h3>
            <div className="card-tools">           
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {actualizacionMasiva}
          </div>
        </div>
    )
}

export default PageActualizacionMasiva;