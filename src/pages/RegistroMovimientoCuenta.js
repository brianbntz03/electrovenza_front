import { RegistrarMovimieto } from "../Components/RegistrarMovimiento";

const RegistroMovimientoCuenta = () => {
  let Registro_Movimieto = RegistrarMovimieto()
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Proveedores</h3>
        <div className="card-tools">
          <a class="btn btn-sm btn-success float-right">
            {" "}
            Excel <i className="fas fa-download" />{" "}
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {Registro_Movimieto}
      </div>
    </div>
  );
};

export default RegistroMovimientoCuenta;
