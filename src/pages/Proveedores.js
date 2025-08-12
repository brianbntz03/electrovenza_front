import { Listadoproveedores } from "../Components/Listadoproveedores";

const Proveedores = () => {
  let lista_provedores = Listadoproveedores()
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Proveedores</h3>
        <div className="card-tools">
          <a class="btn btn-sm btn-success float-right">
            {" "}
            Excel <i className="fas fa-download" />{" "}
          </a>
          <a class="btn btn-sm btn-info float-right" href="/crearproveedor">
            {" "}
            Crear Proveedor
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {lista_provedores}
      </div>
    </div>
  );
};

export default Proveedores;
