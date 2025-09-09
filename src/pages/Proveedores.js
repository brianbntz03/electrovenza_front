import { NavLink } from "react-router-dom";
import { Listadoproveedores } from "../Components/Listadoproveedores";

const Proveedores = () => {
  let lista_provedores = Listadoproveedores()
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Proveedores</h3>
        <div className="card-tools">
          
          
          <NavLink to="/crearproveedor" className="btn btn-sm btn-info float-right mr-2"> Crear Proveedor </NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {lista_provedores}
      </div>
    </div>
  );
};

export default Proveedores;
