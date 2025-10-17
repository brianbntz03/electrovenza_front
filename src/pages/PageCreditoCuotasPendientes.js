import { CreditoCuotasPendientes } from "../Components/CreditoCuotasPendientes";

const PageCreditoCuotasPendientes = () => {
  let listadoCuotasPendientes = CreditoCuotasPendientes();
  return (
    <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Cuotas Pendientes del Crédito</h3>
      </div>
      <div className="card-body table-responsive p-0">{listadoCuotasPendientes}</div>
    </div>
  );
};

export default PageCreditoCuotasPendientes;