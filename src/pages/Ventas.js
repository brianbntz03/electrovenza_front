import React from "react";
import { ListadoVentas } from "../Components/ListadoVentas";

const Ventas = () => {
  let listado_ventas = ListadoVentas();
  return (
    <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Ventas</h3>
        <div className="card-tools">
          <a href="#" className="btn btn-tool btn-sm">
            <i className="fas fa-download" />
          </a>
          <a href="#" className="btn btn-tool btn-sm">
            <i className="fas fa-bars" />
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">{listado_ventas}</div>
    </div>
  );
};

export default Ventas;
