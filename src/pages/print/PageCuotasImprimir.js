import { useParams } from "react-router-dom";
import { apiRest } from "../../service/apiRest";
import { useEffect, useState } from 'react';
import { convertIsoToDMY } from "../../miscellaneus/aux";
import './cuotas_imprimir.css';
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

  
  // Podés cargar datos aquí si necesitás
  return (
    <div>
      <div className="print-container">
      <h1>Electrovenza</h1>
      <h2>Te: 11.6398.5857 - Instagram/Facebook: @electrovenza</h2>
      <p>Articulo: {articulo}</p>
      <p>Cliente: {cliente}</p>
      <p>Vendedor: {vendedor}</p>

      <div className="row cuotas">
        {cuotas.map((cuota) => (
          <div className="col-md-3">
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
