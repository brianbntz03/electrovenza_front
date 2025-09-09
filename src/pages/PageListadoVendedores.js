import { NavLink } from "react-router-dom";
import { ListadoVendedores } from "../Components/tablasListado/listadoVendedores";

const PageListadoVendedores = () => {
  let Listado_Vendedores = ListadoVendedores();
  return (
    <div className="card">
      <div class="card-header">
        <h3 class="card-title">vendedores</h3>
        <div className="card-tools">
          
          
          <NavLink to="/crearvendedores" className="btn btn-sm btn-info float-right">Crear Vendedor</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">{Listado_Vendedores}</div>
    </div>
  );
};

export default PageListadoVendedores;
