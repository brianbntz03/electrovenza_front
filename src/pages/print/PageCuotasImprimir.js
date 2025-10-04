import { useParams } from "react-router-dom";
import { apiRest } from "../../service/apiRest";
import { useEffect, useState } from 'react';
import { convertIsoToDMY } from "../../miscellaneus/aux";

import BottonImprimirPaginaActual from "./BotonImprimir";



export default function PrintCuotas() {
  const { venta_id } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [cliente, setCliente] = useState(['']);
  const [vendedor, setVendedor] = useState(['']);
  const [articulo, setArticulo] = useState(['']);

  const fetchCuotas = async () =>{
    const response = await fetch(`${apiRest}/ventas/cuotas/${venta_id}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    setCuotas(data);
  }

  const fetchVenta = async () =>{
    const response = await fetch(`${apiRest}/ventas/${venta_id}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    setCliente(data.cliente.nombre);
    setVendedor(data.vendedor.nombre);
    setArticulo(data.articulo.nombre);
  }

  useEffect(() => {   fetchCuotas(); fetchVenta(); }, []);

  
  return (
    <div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          h2{
            padding-bottom: 20px;
            font-size: 20px;
          }
          .row{
            flex-wrap: wrap;
            margin-right: -7.5px;
            margin-left: -7.5px;
          }
          .cuotas{
            background-image: url("https://electrovenza.com/gestion/img/logo_para_marca_de_agua.png");
            background-repeat: repeat;
          }
          .col-md-2{
            position: relative;
            flex: 0 0 16%;
            max-width: 16%;
            padding-right: 7.5px;
            padding-left: 7.5px;
            padding-top: 36px;
            border:1px dashed #d3d3d3;
          }
        }
      `}</style>
      <div className="print-container">
      <h1>Electrovenza</h1>
      <h2>Te: 11.6398.5857 - Instagram/Facebook: @electrovenza</h2>
      <p>Articulo: {articulo}</p>
      <p>Cliente: {cliente}</p>
      <p>Vendedor: {vendedor}</p>
      <p>valor de cuota: {cuotas && cuotas[0] && cuotas[0].valor}</p>

      <div className="row cuotas">
        {cuotas.map((cuota) => (
          <div className="col-md-2">
            <p>
              ({cuota.numero.toString().padStart(2, '0')}) 
              {convertIsoToDMY(cuota.fecha)} &nbsp;
              {
                cuota.monto_cobrado>0 ? (
                  cuota.monto_cobrado.toString().padStart(8, ' ') 
                ) : ('. '.repeat(14)) }
              
            </p>
          </div>
        ))}
      </div>
      <hr></hr>
        
      </div>
      <BottonImprimirPaginaActual />
    </div>
  );

    
};
