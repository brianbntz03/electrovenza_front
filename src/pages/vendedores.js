import { ListadoVendedores } from "../Components/listadoVendedores";

const vendedores = () => {
  let Listado_Vendedores = ListadoVendedores();
  return (
    <div className="card">
      <div class="card-header">
        <h3 class="card-title">vendedores</h3>
        <div className="card-tools">
          <a class="btn btn-sm btn-success float-right">
            {" "}
            Excel <i className="fas fa-download" />{" "}
          </a>
          <a class="btn btn-sm btn-info float-right" href="/crearvendedores">
            {" "}
            Crear Vendedores
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">{Listado_Vendedores}</div>
    </div>
  );
};

export default vendedores;
