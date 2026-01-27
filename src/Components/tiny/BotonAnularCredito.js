import { NavLink } from "react-router-dom";

import { 
  apiRest,
  publicUrl 
} from "../../service/apiRest";
import FlashMessageConfirm from "./ConfirmMessage";
import FlashMessage from "./FlashMessage";

export function BotonAnularCredito(credito){

  const handleAnularCredito = async () => {

    
    const response = await FlashMessageConfirm("Anular credito", "seguro que desea Anular el credito?", "warning", credito.id);
    if(!response){
      return ; 
    }

    try {
      const response = await fetch(`${apiRest}/credito/${credito.id}`, 
        { method: "DELETE", 
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
         });
      if (!response.ok){
        FlashMessage("error", "Error al anular el credito, contiene cuotas pagadas", 3000, "error");
        throw new Error("Error al anular el crédito, verifique que no tenga cuotas pagadas");
      } 
      window.location.href = `${publicUrl}/creditos-listado`;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button type="button" className="btn btn-danger btn-responsive" onClick={handleAnularCredito} >
      <i className="far fa-trash-alt"></i>
    </button>
  );
}