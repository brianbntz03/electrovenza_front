export default function BottonImprimirPaginaActual() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handlePrint}>Imprimir Talón</button>
    </>
  );
}