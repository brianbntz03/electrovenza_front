import { RegistrarMovimieto } from "../Components/RegistrarMovimiento";

const RegistroMovimientoCuenta = () => {
  let Registro_Movimieto = RegistrarMovimieto()
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Cuenta Corriente - Registro de movimiento</h3>
        <div className="card-tools">
          
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {Registro_Movimieto}
      </div>
    </div>
  );
};

export default RegistroMovimientoCuenta;
