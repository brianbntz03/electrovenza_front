import {  publicUrl } from "../../service/apiRest";
export function BotonImprimirCuotas(venta){
  
  const handlePrint = () => {
    window.open(`${publicUrl}/print/cuotas/${venta.id}`, '_blank');
  };

  return (
    <button className="btn btn-primary" onClick={() => handlePrint()}>
      Imprimir
    </button>
  );


}