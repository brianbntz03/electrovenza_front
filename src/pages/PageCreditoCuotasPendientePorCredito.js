import { CreditosCuotasVencidas } from "../Components/CreditosCuotasVencidas";

const PageCreditoCuotasPendientesPorCredito = () => {
  let creditosCuotasVencidas = CreditosCuotasVencidas();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Cuotas vencidas</h3>
        <div className="card-tools">
          
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {creditosCuotasVencidas}
      </div>
    </div>
  );
};

export default PageCreditoCuotasPendientesPorCredito;
