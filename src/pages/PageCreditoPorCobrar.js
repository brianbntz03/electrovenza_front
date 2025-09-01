import { CreditosVencidos } from "../Components/CreditosVencidas";

const PageCreditosPorCobrar = () => {
let creditoVencidos = CreditosVencidos();
  return (
    <div className="card">
      <div class="card-header">
        <h3 className="card-title">Creditos vencidas</h3>
        <div className="card-tools">
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {creditoVencidos}
      </div>
    </div>
  );
};

export default PageCreditosPorCobrar;
