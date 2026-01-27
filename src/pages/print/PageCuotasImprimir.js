import { useParams } from "react-router-dom";
import { apiRest } from "../../service/apiRest";
import { useEffect, useState } from "react";
import { convertIsoToDMY } from "../../miscellaneus/aux";
import { authenticatedFetch } from "../../utils/authenticatedFetch";
import "../../pages/print/cuotas_imprimir.css";

import BottonImprimirPaginaActual from "./BotonImprimir";

export default function PrintCuotas() {
  const { venta_id } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [articulo, setArticulo] = useState("");

  const fetchCuotas = async () => {
    const response = await authenticatedFetch(`${apiRest}/ventas/cuotas/${venta_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if(!response.ok) {
      console.error("Error cuotas:", response.status);
      return;
    }

    const data = await response.json();
    setCuotas(Array.isArray(data) ? data : []);
  };

  const fetchVenta = async () => {
    const response = await authenticatedFetch(`${apiRest}/ventas/${venta_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept : "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    if (!response.ok) {
    console.error("Error venta:", response.status);
    return;
  }
  
    const data = await response.json();
    setCliente(data?.cliente?.nombre || "");
    setVendedor(data?.vendedor?.nombre || "");
    setArticulo(data?.articulo?.nombre || "");
  };

  useEffect(() => {
    fetchCuotas();
    fetchVenta();
  }, []);

  return (
    <div>
      <div className="print-container">
        <h1>Electrovenza</h1>
        <h2>Te: 11.6398.5857 - Instagram/Facebook: @electrovenza</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Cliente: {cliente}</h3>
          </div>
          <div className="col-md-6">
            <h3>Vendedor: {vendedor}</h3>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h3>Articulo: {articulo}</h3>
          </div>

          <div className="col-md-6">
            <h3>valor de cuota: {cuotas && cuotas[0] && cuotas[0].valor}</h3>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h3>Numero de venta: {venta_id} </h3>
          </div>
        </div>
        <div>&nbsp;</div>

        <div className="row cuotas">
          {cuotas.map((cuota, ) => (
            <div key={cuota} className="col-md-3">
              <p>
                ({cuota.numero.toString().padStart(2, "0")}){" "}
                {convertIsoToDMY(cuota.fecha)} &nbsp;
                {cuota.monto_cobrado > 0
                  ? cuota.monto_cobrado.toString().padStart(8, " ")
                  : ". ".repeat(16)}
              </p>
            </div>
          ))}
        </div>
        <hr></hr>
      </div>
      <BottonImprimirPaginaActual />
    </div>
  );
}
