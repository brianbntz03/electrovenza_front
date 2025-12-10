import { VentaCuotasPendientes } from "../Components/VentaCuotasPendientes";

const PageVentaCuotasPendientes = () => {
  let listadoVentaCuotasPendientes = VentaCuotasPendientes();
  return (
    <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Cuotas Pendientes del Producto</h3>
      </div>
      <div className="card-body table-responsive p-0">{listadoVentaCuotasPendientes}</div>
    </div>
  );
};

export default PageVentaCuotasPendientes;