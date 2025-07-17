import React from "react"
import { Articulos } from "../Components/articulos"


const PageArticulos = () => {
  let articulos = Articulos();
    return (
        <div className="card">
        <div className="card-header border-0">
          <h1 className="card-title">Articulos</h1>
          <div className="card-tools">      
            <a>Crear categoria</a>
          <a href="#" className="btn btn-tool btn-sm">
            <i className="fas fa-download" />
          </a>
          <a href="#" className="btn btn-tool btn-sm">
            <i className="fas fa-bars" />
          </a>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {articulos}
      </div>
    </div>
    )
}


export default PageArticulos