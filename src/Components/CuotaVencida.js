import { apiRest } from "../service/apiRest";
export default function CuotaVencida(cuota){

  const registrarPago = async () => {
    try {
          // Corregido el endpoint - asegúrate de que esta URL sea correcta para tu API
          const confirmacion = window.confirm("¿Esta seguro de que quiere marcar como pagada la cuota?")
          if(!confirmacion){
            return; 
          }
          
          const response = await fetch(`${apiRest}/cuota_venta/${cuota.id}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          cuota.incrementarContador()
          return data;
        } catch (error) {
          console.error("Error detallado:", error);
        }

  };

  return (
    <div class="col-md-3 col-sm-6 col-12">
        <div className='info-box bg-warning'>
            <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>

            <div class="info-box-content">
                <span class="info-box-text">{cuota.fecha} ({cuota.id})</span>
                <span class="progress-description">{cuota.articulo}</span>
                <span class="info-box-number">${cuota.valor}</span>
                <span class="progress-description">{cuota.vendedor}</span>
                <div className='row'>
                    <div className='col-6'>
                        <button className="btn btn-sm btn-success">Pago parcial</button>
                    </div>
                    <div className='col-6'>
                        <button 
                        onClick={registrarPago}
                        className="btn btn-sm btn-primary">Pagar</button>
                    </div>
                </div>
                
                
            </div>

            
        </div>
    </div>
    )
}