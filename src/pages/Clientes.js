import { NavLink } from "react-router-dom";
import { ListadoClientes } from "../Components/tablasListado/listadoClientes";

const Clientes = () => {
  let listadoclientes = ListadoClientes();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Clientes</h3>
        <div className="card-tools">
          
          <NavLink to="/crearcliente" className="btn btn-sm btn-info float-right">Crear Cliente</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoclientes}
      </div>
    </div>
  );
};

export default Clientes;
