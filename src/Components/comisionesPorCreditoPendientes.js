import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest } from "../service/apiRest";
import FlashMessage from "./tiny/FlashMessage";
import { convertIsoToDMY } from "../miscellaneus/aux";



export const ComisionesPorCreditoPendientes = () => {
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [error, setError] = useState(null);
  const [idVendedor, setIdVendedor] = useState(0);
  const [totalComisiones, setTotalComisiones] = useState(0);

  useEffect(() => {
    cargarVendedores();
  }, []);
  
 
  const handleRetry = () => {
    setError(null);
  };


  const registrarComisiones = async () => {
    try {
      if (!idVendedor) {
        FlashMessage("Liquidar Comisiones", "Debe seleccionar un vendedor", 2000, "warning");
        return;
      }
      const response = await fetch(`${apiRest}/credito/comisiones/marcar-comisiones-como-pagadas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendedor_id: Number(idVendedor) }),
      });

      if (!response.ok) {
        throw new Error(`Error al pagar las comisiones: ${response.status}`);
      }

      const resultado = await response.text();
      console.log(resultado);
      FlashMessage("Registro de pago de comisiones", "Las comisiones fueron pagadas", 2000, "success", "creditos-comisiones-pendientes" );


    } catch (error) {
      console.error("Error al registrar las comisiones:", error);
    }
  };

  


  const FormVendedor = () => {
    return (
      <div className="row">
        <div className="col-md-2">
          <label style={{ marginRight: "5px" }}>Buscar Vendedor:</label>
        </div>
        <div className="col-md-3 input-group">
          <select
          className="form-control"
          value={Number(idVendedor)}
          name="idVendedor"
          onChange={(e) => ComisionesPorVendedor(e.target.value)}
        >
          <option value="">-- Seleccionar Vendedor --</option>
          {vendedoresFiltrados.map((vendedor) => (
            <option key={vendedor.id} value={vendedor.id}>
              {vendedor.nombre}
            </option>
          ))}
        </select>
        </div>
      </div>
      
    );
  };

  const ComisionesPorVendedor = async(vededorId) =>{
    setIdVendedor(Number(vededorId));
    try {
      const response = await fetch(`${apiRest}/credito/comisiones/get-comisiones-pendientes/${vededorId}`);
      if (response.ok) {
        const data = await response.json();
        setTotalComisiones(0);
        const total = data.reduce((sum, comision) => sum + Number(comision.monto), 0);
        setTotalComisiones(total);
        setComisiones(data);
      }
    } catch (error) {
      console.error("Error cargando listado de comisiones pendientes:", error);
    }
  }
  useEffect(() => {
    ComisionesPorVendedor(idVendedor);
  }, [idVendedor,]);


  const cargarVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      if (response.ok) {
        const data = await response.json();
        setVendedoresFiltrados(data);
      }
    } catch (error) {
      console.error("Error cargando vendedores:", error);
    }
  };

  
  if (error) {
    return (
      <div>
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Reintentar</button>
      </div>
    );
  }

  return (
    <>
    <div className="container-fluid">
      <FormVendedor />
    </div>
    <div className="card-body">
            <>
            <table className="table table-striped table-valign-middle table-bordered">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Comision</th>
                </tr>
                {comisiones.map((comision, index) => (
                  <tr key={index}>
                    <td>{convertIsoToDMY( comision.fecha)}</td>
                    <td>{comision.cuota_credito.credito.cliente.nombre}</td>
                    <td>{comision.monto}</td>
                  </tr>
                ))}
                
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total:</td>
                    <td colSpan={3}>{totalComisiones.toLocaleString()}</td>
                    
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">
                      <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => registrarComisiones()}
                  >
                    Liquidar Comisiones
                  </button>
                    </td>
                  </tr>
                </tfoot>
            </table>
            </>
      
    </div>
    </>
  );
};
