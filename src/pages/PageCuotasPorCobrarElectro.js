import CuotasVencidas from "../Components/cuotasVencidas";

const PageCuotasPorCobrarElectro = () => {
  const cuotasVencidas = CuotasVencidas();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Cuotas vencidas electro</h3>
        <div className="card-tools">
          
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {cuotasVencidas}
      </div>
    </div>
  );
};

export default PageCuotasPorCobrarElectro;
