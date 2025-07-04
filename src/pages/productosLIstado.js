import { ListadoProducto } from "../Components/ListadoProducto";

const Productos = () => {
  const producto = ListadoProducto();
  return (
    <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Productos</h3>
        <div className="card-tools">
          <a class="btn btn-sm btn-info float-right" href="/crearPrducto">
            {" "}
            Crear Productos
          </a>{" "}
          &nbsp;
          <a class="btn btn-sm btn-success float-right">
            {" "}
            Excel <i className="fas fa-download" />{" "}
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">{producto}</div>
    </div>
  );
};

export default Productos;
