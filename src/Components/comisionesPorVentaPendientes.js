import { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import FlashMessage from "./tiny/FlashMessage";
import { convertIsoToDMY } from "../miscellaneus/aux";



export const ComisionesPorVentaPendientes = () => {
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);
  const [comisionesVentas, setComisionesVentas] = useState([]);
  const [comisionesCreditos, setComisionesCreditos] = useState([]);
  const [error, setError] = useState(null);
  const [idVendedor, setIdVendedor] = useState(0);
  const [totalComisionesPorVenta, setTotalComisionesPorVenta] = useState(0);
  const [totalCobradoPorVenta, setTotalCobradoPorVenta] = useState(0);
  const [totalCobradoPorCredito, setTotalCobradoPorCredito] = useState(0);
  const [saldoCuentaCorriente, setSaldoCuentaCorriente] = useState(0);
  const [totalComisionesPorCredito, setTotalComisionesPorCredito] = useState(0);
  const [lastMovements, setLastMovements] = useState([]);

  useEffect(() => {
    cargarVendedores();
  }, []);
  
  
 
  const handleRetry = () => {
    setError(null);
  };

  const updateCuentaCorriente = async (vededorId) => {
      try {
      const response = await fetch(`${apiRest}/cuenta-corriente/get-by-vendedor/${vededorId}`);
      if (response.ok) {
        const { saldo } = await response.json();
        setSaldoCuentaCorriente(saldo);
      }
    } catch (error) {
      console.error("Error cargando saldo de la cuenta corriente:", error);
    }
  }


  const liquidarComisionesVentas = async () => {
    try {
      if (!idVendedor) {
        FlashMessage("Liquidar Comisiones", "Debe seleccionar un vendedor", 2000, "warning");
        return;
      }
      const responseVentas = await fetch(`${apiRest}/ventas/comisiones/marcar-comisiones-como-pagadas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendedor_id: Number(idVendedor) }),
      });

      if (!responseVentas.ok) {
        throw new Error(`Error al pagar las comisiones por ventas: ${responseVentas.status}`);
      }

      const resultado = await responseVentas.text();
      console.log(resultado);
      FlashMessage("Registro de pago de comisiones", "Las comisiones fueron pagadas", 2000, "success", "ventas-comisiones-pendientes" );


    } catch (error) {
      console.error("Error al registrar las comisiones:", error);
    }
  };

  const liquidarComisionesCreditos = async () => {
    try {
      if (!idVendedor) {
        FlashMessage("Liquidar Comisiones", "Debe seleccionar un vendedor", 2000, "warning");
        return;
      }

      const responseCreditos = await fetch(`${apiRest}/credito/comisiones/marcar-comisiones-como-pagadas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendedor_id: Number(idVendedor) }),
      });

      if (!responseCreditos.ok) {
        throw new Error(`Error al pagar las comisiones por creditos: ${responseCreditos.status}`);
      }


      const resultado = await responseCreditos.text();
      console.log(resultado);
      FlashMessage("Registro de pago de comisiones", "Las comisiones fueron pagadas", 2000, "success", "ventas-comisiones-pendientes" );


    } catch (error) {
      console.error("Error al registrar las comisiones por creditos:", error);
    }
  };

  const registrarLiquidacionCobranza = async () => {
    try {
      if (!idVendedor) {
        FlashMessage("Registrar Liquidacion de Cobranza", "Debe seleccionar un vendedor", 2000, "warning");
        return;
      }

      const registroLiquidacionCobranza = await fetch(`${apiRest}/cuenta-corriente-movimiento/liquidar-cobranza`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
          vendedorId: parseInt(idVendedor),
        }),
      });

      if (!registroLiquidacionCobranza.ok) {
        throw new Error(`Error al registrar la liquidación de cobranza: ${registroLiquidacionCobranza.status}`);
      }


      await registroLiquidacionCobranza.text();
      updateCuentaCorriente(idVendedor);
      FlashMessage("Registro de liquidación de cobranza", "La liquidación fue registrada", 2000, "success", );


    } catch (error) {
      console.error("Error al registrar la liquidación de cobranza:", error);
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
    console.log("Vendedor ID seleccionado:", vededorId);
    setIdVendedor(Number(vededorId));
    
    //Comisiones por ventas
    try {
      const response = await fetch(
        `${apiRest}/ventas/comisiones/get-comisiones-pendientes/${vededorId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.ok) {
        const comisionesVentas = await response.json();
        setTotalComisionesPorVenta(0);
        const totalComisionesVentas = comisionesVentas.reduce((sum, comision) => sum + Number(comision.monto), 0);
        setTotalComisionesPorVenta(totalComisionesVentas);

        const totalCobradoVentas = comisionesVentas.reduce((sum, comision) => sum + Number(comision.cuota_venta.monto_cobrado), 0);
        setTotalCobradoPorVenta(totalCobradoVentas);
        setComisionesVentas(comisionesVentas);
      }
    } catch (error) {
      console.error("Error cargando listado de comisiones por venta pendientes:", error);
    }

    //Comisiones por creditos
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(
        `${apiRest}/credito/comisiones/get-comisiones-pendientes/${vededorId}`,
        {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.ok) {
        const comisionesCreditos = await response.json();
        const total = comisionesCreditos.reduce((sum, comision) => sum + Number(comision.monto), 0);
        

        setTotalComisionesPorCredito(total);
        setComisionesCreditos(comisionesCreditos);

        const totalCobradoCreditos = comisionesCreditos.reduce((sum, comision) => sum + Number(comision.cuota_credito.monto_cobrado), 0);
        setTotalCobradoPorCredito(totalCobradoCreditos);


      }
    } catch (error) {
      console.error("Error cargando listado de comisiones por credito pendientes:", error);
    }

    //Saldo cuenta corriente
    updateCuentaCorriente(vededorId);

    //Ultimos movimientos cuenta corriente
    try {
      const response = await fetch(`${apiRest}/cuenta-corriente/last-ten-movements-by-vendedor/${vededorId}`);
      if (response.ok) {
        const last_ten_movements = await response.json();
        setLastMovements(last_ten_movements);
      }
    } catch (error) {
      console.error("Error cargando saldo de la cuenta corriente:", error);
    }

  }
  useEffect(() => {
    ComisionesPorVendedor(idVendedor);
  }, [idVendedor,]);


  const cargarVendedores = async () => {
    try {
      const response = await fetch(`${apiRest}/vendedor`);
      if (response.ok) {
        const { data } = await response.json();
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
            <h1>Comisiones pendientes por ventas</h1>
            <table className="table table-striped table-valign-middle table-bordered">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Articulo</th>
                  <th>Comision</th>
                  <th>monto cobrado</th>
                </tr>
                {comisionesVentas.map((comision, index) => (
                  <tr key={index}>
                    <td>{convertIsoToDMY( comision.fecha)}</td>
                    <td>{comision.cuota_venta.venta.cliente?.nombre}</td>
                    <td>{comision.cuota_venta.venta.articulo?.nombre}</td>
                    <td>{Number(comision.monto).toLocaleString()}</td>
                    <td>{Number(comision.cuota_venta.monto_cobrado).toLocaleString()}</td>
                    
                  </tr>
                ))}
                
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Total:</td>
                    <td>{totalComisionesPorVenta.toLocaleString()}</td>
                    <td>{totalCobradoPorVenta.toLocaleString()}</td>
                    
                  </tr>
                  <tr>
                    <td colSpan={5} className="text-right">
                      <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => liquidarComisionesVentas()}
                  >
                    Liquidar Comisiones por Ventas
                  </button>
                    </td>
                  </tr>
                </tfoot>
            </table>
            
            <br/>
            <br/>
            <h1>Comisiones pendientes por creditos</h1>
            <table className="table table-striped table-valign-middle table-bordered">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>cuota numero</th>
                  <th>Comision</th>
                  <th>Monto cobrado</th>
                </tr>
                {comisionesCreditos.map((comision, index) => (
                  <tr key={index}>
                    <td>{convertIsoToDMY( comision.fecha)}</td>
                    <td>{comision.cuota_credito.credito.cliente?.nombre}</td>
                    <td>{comision.cuota_credito.numero}</td>
                    
                    <td>{Number(comision.monto).toLocaleString()}</td>
                    <td>{Number(comision.cuota_credito.monto_cobrado).toLocaleString()}</td>
                  </tr>
                ))}
                
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} >Total:</td>
                    <td >{totalComisionesPorCredito.toLocaleString()}</td>
                    <td >{totalCobradoPorCredito.toLocaleString()}</td>
                    
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">
                      <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => liquidarComisionesCreditos()}
                  >
                    Liquidar Comisiones por Créditos
                  </button>
                    </td>
                  </tr>
                </tfoot>
            </table>
            <h1>Total comisiones: {(totalComisionesPorVenta + totalComisionesPorCredito).toLocaleString()}</h1>
            
            <br/>
            <br/>
            <h1>Saldo actual de la cuenta corriente:</h1>
            <h2>{Number(saldoCuentaCorriente).toLocaleString()}</h2>
            <div className="row">
              <div className="col-md-4">
              
              <table className="table table-striped table-valign-middle table-bordered">
                <tr>
                  <td>
                    <label>Registrar liquidacion de cobranza: </label> 
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => registrarLiquidacionCobranza()}
                      >
                        Crear movimiento por el total
                      </button>
                  </td>
                </tr>
            </table>
            <a href="">ver más</a>
              </div>
            </div>


            <br/>
            <br/>

            <h1>Ultimos 10 movimientos:</h1>
            <table className="table table-striped table-valign-middle table-bordered">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <th>tipo</th>
                  <th>monto</th>
                  <th>signo</th>
                </tr>
                {lastMovements.map((movimiento, index) => (
                  <tr key={index}>
                    <td>{convertIsoToDMY( movimiento.fecha)}</td>
                    <td>{movimiento.tipoMovimiento?.nombre}</td>
                    <td>{movimiento.monto}</td>
                    <td>{movimiento.tipoMovimiento?.signo}</td>
                  </tr>
                ))}
                </tbody>
            </table>
            <a href="">ver más</a>
            </>
      
    </div>
    </>
  );
};
