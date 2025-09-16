import { NavLink } from "react-router-dom";
import { ListadoCreditos } from "../Components/Lists/ListadoCreditos";

const PageCreditos = () => {
  let listadoCreditos = ListadoCreditos();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Creditos</h3>
        <div className="card-tools">
          
          <NavLink to="/crearCreditos" className="btn btn-sm btn-info float-right">Crear</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoCreditos}
      </div>
    </div>
  );
};

export default PageCreditos;
