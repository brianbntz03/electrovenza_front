import { ListadoClientes } from "../Components/listadoClientes";

const Clientes = () => {
  let listadoclientes = ListadoClientes();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Clientes</h3>
        <div className="card-tools">
          <a class="btn btn-sm btn-success float-right">
            {" "}
            Excel <i className="fas fa-download" />{" "}
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {listadoclientes}
      </div>
    </div>
  );
};

export default Clientes;
