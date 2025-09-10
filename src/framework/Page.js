import { NavLink } from "react-router-dom";
import { ListadoTEMPLATE_LISTADO_NAME } from "../Components/Lists/ListadoTEMPLATE_LISTADO_NAME";

const PageTEMPLATE_LISTADO_NAME = () => {
  let listadoTEMPLATE_LISTADO_NAME = ListadoTEMPLATE_LISTADO_NAME();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">TEMPLATE_LISTADO_NAME</h3>
        <div className="card-tools">
          
          <NavLink to="/crearTEMPLATE_LISTADO_NAME" className="btn btn-sm btn-info float-right">Crear</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoTEMPLATE_LISTADO_NAME}
      </div>
    </div>
  );
};

export default PageTEMPLATE_LISTADO_NAME;
