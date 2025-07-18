import { useParams } from "react-router-dom";
import { apiRest } from "../../service/apiRest";
import { useEffect, useState } from 'react';
import { convertIsoToDMY } from "../../miscellaneus/aux";
import './cuotas_imprimir.css';


export default function PrintCuotas() {
  const { id } = useParams();
  const [cuotas, setCuotas] = useState([]);

  const fetchCuotas = async () =>{
    const response = await fetch(`${apiRest}/ventas/cuotas/${id}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    setCuotas(data);
  }

  useEffect(() => {   fetchCuotas();   }, []);

  
  // Podés cargar datos aquí si necesitás
  return (
    <div className="print-container">
    <h1>Electronvenza</h1>
    <h2>Te: 11.6398.5857</h2>
    <h2>@electrovenza</h2>
    
    <div className="row">
      {cuotas.map((cuota) => (
        <div className="col-md-3">
          <p><strong>Cuota id #{cuota.id}</strong></p>
          <p>Fecha: {convertIsoToDMY(cuota.fecha)}</p>
          <p>Estado: {cuota.estado}</p>
          <p>monto: .............</p>
          <p>firma: .............</p>
        </div>
      ))}
    </div>
    </div>
    
  
  );

    
};
