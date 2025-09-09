import { NavLink } from "react-router-dom";
import { ListadoCategoria } from "../Components/tablasListado/listado_categoria"

const Categorias = () => {
  let categoriasListado =  ListadoCategoria();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Categorias</h3>
            <div className="card-tools">
              
              <NavLink to="/crearcategorias" className="btn btn-sm btn-info float-right">Crear Categoria</NavLink>
              
              
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {categoriasListado}
          </div>
        </div>
    )
}

export default Categorias