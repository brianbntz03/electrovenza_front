import { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import FlashMessage from "./tiny/FlashMessage";
import { convertIsoToDMY } from "../miscellaneus/aux";

export const ComisionesPorVentaPendientesVendedor = () => {
  const [comisionesVentas, setComisionesVentas] = useState([]);
  const [comisionesCreditos, setComisionesCreditos] = useState([]);
  const [error, setError] = useState(null);
  const [idVendedor, setIdVendedor] = useState(null);
  const [totalComisionesPorVenta, setTotalComisionesPorVenta] = useState(0);
  const [totalCobradoPorVenta, setTotalCobradoPorVenta] = useState(0);
  const [saldoCuentaCorriente, setSaldoCuentaCorriente] = useState(0);
  const [totalComisionesPorCredito, setTotalComisionesPorCredito] = useState(0);
  const [lastMovements, setLastMovements] = useState([]);
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);
  const [selectedVendedorId, setSelectedVendedorId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");


  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setError('No hay sesión activa');
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const role = payload.role || payload.user_role || 'vendedor';
      setUserRole(role);
      
      if (role === 'vendedor') {
        // Usar directamente vendedorId y vendedorName del token
        const vendedorId = payload.vendedorId;
        const vendedorName = payload.vendedorName;        
        if (vendedorId && vendedorName) {
          setNombreVendedor(vendedorName);
          setSelectedVendedorId(vendedorId);
          setIdVendedor(vendedorId);
          ComisionesPorVendedor(vendedorId);
          updateCuentaCorriente(vendedorId);
        } 
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      setError('Error procesando la sesión');
    }
  };

  const handleRetry = () => {
    setError(null);
    obtenerDatosUsuario();
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

  const ComisionesPorVendedor = async (vededorId) => {
    setIdVendedor(Number(vededorId));

    //Comisiones por ventas
    try {
      // Probar diferentes endpoints para comisiones por ventas
      let url = `${apiRest}/ventas/comisiones/get-comisiones-pendientes/${vededorId}`;
      let response = await fetch(url);
      
      if (response.ok) {
        const comisionesVentas = await response.json();
        setTotalComisionesPorVenta(0);
        const totalComisionesVentas = comisionesVentas.reduce(
          (sum, comision) => sum + Number(comision.monto),
          0
        );
        setTotalComisionesPorVenta(totalComisionesVentas);

        const totalCobradoVentas = comisionesVentas.reduce(
          (sum, comision) => sum + Number(comision.cuota_venta.monto_cobrado),
          0
        );
        setTotalCobradoPorVenta(totalCobradoVentas);
        setComisionesVentas(comisionesVentas);
      } 
    } catch (error) {
      console.error(
        "Error cargando listado de comisiones por venta pendientes:",
        error
      );
    }

    //Comisiones por creditos
    try {
      const url = `${apiRest}/credito/comisiones/get-comisiones-pendientes/${vededorId}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const comisionesCreditos = await response.json();
        
        const total = comisionesCreditos.reduce(
          (sum, comision) => sum + Number(comision.monto),
          0
        );
        setTotalComisionesPorCredito(total);
        setComisionesCreditos(comisionesCreditos);
      } 
    } catch (error) {
      console.error(
        "Error cargando listado de comisiones por credito pendientes:",
        error
      );
    }

    //Ultimos movimientos cuenta corriente
    try {
      const url = `${apiRest}/cuenta-corriente/last-ten-movements-by-vendedor/${vededorId}`;
      const response = await fetch(url);
      if (response.ok) {
        const last_ten_movements = await response.json();
        setLastMovements(last_ten_movements);
      } 
    } catch (error) {
      console.error("Error cargando saldo de la cuenta corriente:", error);
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
                  <td>{convertIsoToDMY(comision.fecha)}</td>
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
            </tfoot>
          </table>

      <br/>
      <br/>
          <h1>Comisiones pendientes por créditos</h1>
          <table className="table table-striped table-valign-middle table-bordered">
            <tbody>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Comision</th>
                <th>monto cobrado</th>
              </tr>
              {comisionesCreditos.map((comision, index) => (
                <tr key={index}>
                  <td>{convertIsoToDMY(comision.fecha)}</td>
                  <td>{comision.cuota_credito.credito.cliente?.nombre}</td>
                  <td>{Number(comision.cuota_credito.comision_vendedor).toLocaleString()}</td>
                  <td>{Number(comision.cuota_credito.monto_cobrado).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total:</td>
                <td>{totalComisionesPorCredito.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
            <h1>Total comisiones: {(totalComisionesPorVenta + totalComisionesPorCredito).toLocaleString()}</h1>
         
        <br />
        <br />
          <h1>Saldo actual de la cuenta corriente:</h1>
            <h2>{Number(saldoCuentaCorriente).toLocaleString()}</h2>

          <br/>
          <br/>
        
          <h1>Últimos 10 movimientos</h1>
          <table className="table table-striped table-valign-middle table-bordered">
            <tbody>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Saldo</th>
              </tr>
              {lastMovements.map((movement, index) => (
                <tr key={index}>
                  <td>{convertIsoToDMY(movement.fecha)}</td>
                  <td>{movement?.tipoMovimiento?.nombre} ({movement?.tipoMovimiento?.signo})</td>
                  <td>{movement.monto}</td>
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