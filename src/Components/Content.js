import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Categorias from "../pages/categoriasListado";
import PageProductosListado from "../pages/productosLIstado";
import CrearPresupuesto from "../Presupuestos/CrearPresupuesto";
import HistorialPresupuesto from "../Presupuestos/HistorialPresupuesto";
import ListaPresupuesto from "../Presupuestos/ListaPresupuesto";
import CreacionCategorias from "../pages/creacionCategorias";
import Articulos from "../pages/Articulos";
import PagePresupuestar from "../Presupuestos/presupuestossss";
import PageListadoVentas from "../pages/PageListadoVentas";
import Dashboard from "../pages/Index";
import { CrearProducto } from "./Crear/CrearProducto";
import ListadoVendedores from "../pages/PageListadoVendedores";
import Clientes from "../pages/Clientes";
import Proveedores from "../pages/Proveedores";
import PageListadoSettingCuotasElectro from "../pages/SettingCuotasElectroListado";
import PageSettingCuotasCreditoListado from "../pages/SettingCuotasCreditoListado";
import PageBandasPrecios from "../pages/PageBandasPrecios";
import { CrearBandasPrecios } from "./Crear/CrearBandasPrecios";
import PageCuotasPorCobrar from "../pages/PageCuotasPorCobrar";
import PageCuotasPorCobrarElectro from "../pages/PageCuotasPorCobrarElectro";
import PrintCuotas from "../pages/print/PageCuotasImprimir";
import PrintCuotasCredito from "../pages/print/PageCuotasCreditoImprimir";
import { CrearVendedor } from "./Crear/CrearVendedor";
import { CrearCliente } from "./Crear/CrearClientes";
import RegistroMovimientoCuenta from "../pages/RegistroMovimientoCuenta";
import { CrearProveedor } from "./Crear/CrearProveedor";
import PageOtorgarCredito from "../pages/PageOtorgarCredito";
import PageCreditosCuotasPorCobrar from "../pages/PageCreditosCuotasPorCobrar";
import PageCreditoCuotasPendientes from "../pages/PageCreditoCuotasPendientes";
import PageComisionesPorVentaPendientes from "../pages/PageComisionesPorVentaPendientes";
import PageComisionesPorCreditoPendientes from "../pages/PageComisionesPorCreditoPendientes";
import PageCreditosPorCobrar from "../pages/PageCreditoPorCobrar";
import { CrearCuotaElectro } from "./Crear/CrearCuota";
import { CrearCuotaCredito } from "./Crear/CrearCuotaCredito";
import PageCompras from "../pages/PageCompras";
import { CrearCompras } from "./Crear/CrearCompras";
import PageCreditos from "../pages/PageCreditos"; 
import Clientes_filtrado_vendedor from "./Clientes-Filtrado-vendedor";
import { CrearClienteFiltrado } from "./Crear/CrearClientesFiltrado";
import PageVentasCuotasPendientes from "../pages/PageVentaCuotasPendientes";
import PageReporteCobranza from "../pages/pageReporteCobranza";
import PageReporteGanancia from "../pages/pageReporteGanancias";
import PageArticulosListado from "../pages/articulosListados";
import PageActualizacionMasiva from "../pages/PageActualizacionMasiva";
import PagePresupuestarAlContado from "../Presupuestos/presupuestossssAlContado";

export default function Content() {
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1 className="m-0">ElectroVenza</h1>
            </div>

            {/* /.col */}
          </div>
          {/* /.row */}
        </div>

        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <Routes>
                {/* Redirección automática de "/" a "/index" */}
                <Route path="/" element={<Navigate to="/index" replace />} />
                <Route path="/index" Component={Dashboard}></Route>
                <Route path="/categoriasListado" Component={Categorias}></Route>
                <Route path="/productosListado" Component={PageProductosListado}></Route>
                <Route path="/crear" Component={CrearPresupuesto}></Route>
                <Route
                  path="/historial"
                  Component={HistorialPresupuesto}
                ></Route>
                <Route path="/lista" Component={ListaPresupuesto}></Route>
                
                {/* Categorias y productos */}
                <Route
                  path="/crearcategorias"
                  Component={CreacionCategorias}
                ></Route>
                <Route path="/articulos" Component={Articulos}></Route>
                
                
                <Route path="/buscar-articulos-presupuesto" Component={PagePresupuestar}></Route>
                <Route path="/buscar-articulos-presupuesto-contado" Component={PagePresupuestarAlContado}></Route>
                <Route path="/cuotas-por-cobrar" Component={PageCuotasPorCobrar} ></Route>
                <Route path="/cuotas-por-cobrar-electro" Component={PageCuotasPorCobrarElectro} ></Route>
                <Route path="/ventas-listado" Component={PageListadoVentas}></Route>
                <Route path="/ventas-comisiones-pendientes" element={<PageComisionesPorVentaPendientes />} />
                <Route path="/creditos-comisiones-pendientes" element={<PageComisionesPorCreditoPendientes />} />
                <Route path="/ventas-cuotas-pendientes/:venta_id" Component={PageVentasCuotasPendientes} ></Route>
                <Route path="/print/cuotas/:venta_id" element={<PrintCuotas />} />
                <Route path="/print/cuotas-credito/:credito_id" element={<PrintCuotasCredito />} />
                
                {/* Relacionados con vendedor: creditos */}
                <Route path="/otorgar-credito" Component={PageOtorgarCredito}></Route>
                <Route path="/creditos-cuotas-por-cobrar" Component={PageCreditosCuotasPorCobrar} ></Route>
                <Route path="/credito-cuotas-pendientes/:credito_id" Component={PageCreditoCuotasPendientes} ></Route>
                <Route path="/creditos-listado" Component={PageCreditos} ></Route>
                


                <Route path="/crearProducto" Component={CrearProducto}></Route>
                <Route path="/vendedores" Component={ListadoVendedores}></Route>
                <Route path="/crearvendedores" Component={CrearVendedor}></Route>
                <Route path="/clientes" Component={Clientes}></Route>
                <Route path="/proveedores" Component={Proveedores}></Route>
                <Route path="/crearproveedor" Component={CrearProveedor}></Route>
                
                <Route path="/settingCuotasElectoListado" Component={PageListadoSettingCuotasElectro}></Route>
                <Route path="/SettingCuotasCreditoListado" Component={PageSettingCuotasCreditoListado}></Route>
                <Route path="/SettingBandasPreciosListado" Component={PageBandasPrecios}></Route>
                <Route path="/crear-setting-bandas-precios" Component={CrearBandasPrecios}></Route>
                <Route path="/crearcliente" Component={CrearCliente}></Route>    
                <Route path="/crearclientefiltrado" Component={CrearClienteFiltrado}></Route>             
                <Route
                path="/registrar-movimento" Component={RegistroMovimientoCuenta}>
                </Route>
                <Route path="/credito-por-cobrar" Component={PageCreditosPorCobrar}></Route>
                <Route path="/crearcuotaelectro" Component={CrearCuotaElectro}></Route>
                <Route path="/crear-cuota-credito" Component={CrearCuotaCredito}></Route>
                <Route path="/articulos-listado" Component={PageArticulosListado}></Route>
                <Route path="/actualizacion-masiva" Component={PageActualizacionMasiva}></Route>
                {/* COMPRAS */}
                <Route path="/compras-listado" Component={PageCompras}></Route>
                <Route path="/compras-registrar" Component={CrearCompras}></Route>
                <Route path="/clientes-filtrado-vendedor" Component={Clientes_filtrado_vendedor}> </Route>
                <Route path="reporte-cobranza" Component={PageReporteCobranza}></Route>
                <Route path="reporte-ganancia" Component={PageReporteGanancia}></Route>
              </Routes>
              <button id="back-to-top" type="button" className="btn btn-primary back-to-top" aria-label="Scroll to top">
                <i className="fas fa-chevron-up"></i>
              </button>
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content */}
    </div>
  );
}

<Route path="/crearcuotaelectro" Component={CrearCuotaElectro}></Route>