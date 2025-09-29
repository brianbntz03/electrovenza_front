import CuotasVencidas from '../Components/cuotasVencidas';

const PageCuotasVencidas = () => {
    let CuotaVencidas = CuotasVencidas();
    return (
        <div className="card">
          <div className="card-header border-0">
            <h3 className="card-title">otorgar credito</h3>
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
            {CuotaVencidas}
          </div>
        </div>
      )
    }

export default PageCuotasVencidas;