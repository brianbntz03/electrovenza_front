import CuotaVencida from "../Components/cuotasVencidas";

const PageCuotasPorCobrar = () => {
  let CuotasVencidas = CuotaVencida();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Cuotas vencidas</h3>
        <div className="card-tools">
          
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {CuotasVencidas}
      </div>
    </div>
  );
};

export default PageCuotasPorCobrar;
