import { NavLink } from "react-router-dom";
import { ListadoCompras } from "../Components/Lists/ListadoCompras";

const PageCompras = () => {
  let listadoCompras = ListadoCompras();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Compras</h3>
        <div className="card-tools">
          
          <NavLink to="/crearCompras" className="btn btn-sm btn-info float-right">Crear</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoCompras}
      </div>
    </div>
  );
};

export default PageCompras;
