import { ListadoCategoria } from "../Components/listado_categoria"

const Categorias = () => {
  let categorias =  ListadoCategoria();
  return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">Categorias</h3>
            <div className="card-tools">
              <a class="btn btn-sm btn-info float-right" href='/crearcategorias' > Crear Categoria</a>
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-download" />
              </a>
              <a href="#" className="btn btn-tool btn-sm">
                <i className="fas fa-bars" />
              </a>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            {categorias}
          </div>
        </div>
    )
}

export default Categorias