import { useEffect, useState } from "react";

const ListaPresupuesto = ( ) => {
 
    const [presupuesto, setPresupuesto] = useState([]);

useEffect(() => {
  const datos = JSON.parse(localStorage.getItem("presupuesto")) || [];
  setPresupuesto(datos);
}, []);


    const total = presupuesto.reduce((sum, item) => sum + item.precio, 0);

    return (
        <div className="card">
            <div className="card-header border-0">
                <h2 className="card-title">Lista de Presupuestos</h2>
            </div>
        </div>
    )
}

export default ListaPresupuesto