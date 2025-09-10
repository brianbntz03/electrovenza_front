import { NavLink } from "react-router-dom";
import { ListadoBandasPrecios } from "../Components/Lists/ListadoBandasPrecios";

const BandasPrecios = () => {
  let listadoBandasPrecios = ListadoBandasPrecios();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">BandasPrecios</h3>
        <div className="card-tools">
          
          <NavLink to="/crearcliente" className="btn btn-sm btn-info float-right">Crear</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoBandasPrecios}
      </div>
    </div>
  );
};

export default BandasPrecios;
