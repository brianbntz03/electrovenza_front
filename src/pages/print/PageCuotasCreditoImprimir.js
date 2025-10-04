import { useParams } from "react-router-dom";
import { apiRest } from "../../service/apiRest";
import { useEffect, useState } from "react";
import { convertIsoToDMY } from "../../miscellaneus/aux";
import BottonImprimirPaginaActual from "./BotonImprimir";
import "../../pages/print/cuotas_imprimir.css";

export default function PrintCuotasCredito() {
  const { credito_id } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [cliente, setCliente] = useState([""]);
  const [vendedor, setVendedor] = useState([""]);
  const [montoOtorgado, setMontoOtorgado] = useState([0]);

  const fetchCuotas = async () => {
    const response = await fetch(`${apiRest}/credito/cuotas/${credito_id}`, {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });

    const data = await response.json();
    setCuotas(data);
  };

  const fetchCredito = async () => {
    const response = await fetch(`${apiRest}/credito/${credito_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    setCliente(data.cliente.nombre);
    setVendedor(data.vendedor.nombre);
    setMontoOtorgado(data.monto);
  };

  useEffect(() => {
    fetchCuotas();
    fetchCredito();
  }, []);

  return (
    <div>
      <div className="print-container">
        <h1>Electrovenza</h1>
        <h2>Te: 11.6398.5857 - Instagram/Facebook: @electrovenza</h2>
        <p>Cliente: {cliente}</p>
        <p>Vendedor: {vendedor}</p>
        <p>Monto otorgado: {montoOtorgado}</p>
        <p>valor de cuota: {cuotas && cuotas[0] && cuotas[0].valor}</p>

        <div className="row cuotas">
          {cuotas.map((cuota) => (
            <div className="col-md-2">
              <p>({cuota.numero.toString().padStart(2, "0")}) {convertIsoToDMY(cuota.fecha)} &nbsp;</p>
              <p>{cuota.monto_cobrado > 0 ? cuota.monto_cobrado.toString().padStart(8, " ") : ". ".repeat(16)}</p>
            </div>
          ))}
        </div>
        <hr></hr>
      </div>
      <BottonImprimirPaginaActual />
    </div>
  );
}
