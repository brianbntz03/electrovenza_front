import React from 'react' ;
import {CrearCategorias} from '../Components/CrearCategorias' ;

const CreacionCategorias = () => {
    let crear_Categorias = CrearCategorias() ;
    return (
        <div className="card">
          <div className="card-header border-0">
            <h1 className="card-title">Categorias</h1>
            <div className="card-tools">
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-download" />
              </a>
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-bars" />
              </a>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {crear_Categorias}
          </div>
        </div>
      )
    }

export default CreacionCategorias