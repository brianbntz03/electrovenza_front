import { publicUrl } from "../../service/apiRest";

export function BotonImprimirCuotasCredito(credito){
  
  const handlePrint = () => {
    window.open(`${publicUrl}/print/cuotas-credito/${credito.id}`, '_blank');
  };

  return (
    <button className="btn btn-primary" onClick={() => handlePrint()}>
      Imprimir
    </button>
  );
}