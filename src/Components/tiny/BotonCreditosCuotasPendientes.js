import { NavLink } from "react-router-dom";

import { publicUrl } from "../../service/apiRest";

export function BotonCreditosCuotasPendientes(credito){
  return (
    <NavLink to={`/credito-cuotas-pendientes/${credito.id}`} className="btn btn-info">
      Impagas
    </NavLink>
  );
}