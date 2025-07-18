export function BotonImprimirCuotas(venta){
  
  const handlePrint = () => {
    window.open(`/print/cuotas/${venta.id}`, '_blank');
  };

  return (
    <button className="btn btn-primary" onClick={() => handlePrint()}>
      Imprimir
    </button>
  );


}