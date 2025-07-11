import React from "react";
import { Routes, Route } from "react-router-dom";
import Categorias from "../pages/categoriasListado";
import Productos from "../pages/productosLIstado";
import CrearPresupuesto from "../Presupuestos/CrearPresupuesto";
import HistorialPresupuesto from "../Presupuestos/HistorialPresupuesto";
import ListaPresupuesto from "../Presupuestos/ListaPresupuesto";
import CreacionCategorias from "../pages/creacionCategorias";
import Articulos from "../pages/Articulos";
import Presupuestossss from "../Presupuestos/presupuestossss";
import Ventas from "../pages/Ventas";
import Dashboard from "../pages/Dashboard";
import { CrearPrducto } from "./CrearProducto";
import vendedores from "../pages/vendedores";
import Clientes from "../pages/Clientes";
import Proveedores from "../pages/Proveedores";
import PageListadoCuotas from "../pages/cuotasListado";

export default function Content(){
    return(
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
                          <Route path="/index" Component={Dashboard} ></Route>
                          <Route path="/categoriasListado" Component={Categorias} ></Route>
                          <Route path="/productosListado" Component={Productos} ></Route>
                          <Route path="/crear" Component={CrearPresupuesto}></Route>  
                          <Route path="/historial" Component={HistorialPresupuesto}></Route>
                          <Route path="/lista" Component={ListaPresupuesto}></Route>
                          <Route path="/crearcategorias" Component={CreacionCategorias}></Route>
                          <Route path="/articulos" Component={Articulos}></Route>
                          <Route path="/buscar-articulos-presupuesto" Component={Presupuestossss}></Route>
                          <Route path="/ventas" Component={Ventas}></Route>
                          <Route path="/crearPrducto" Component={CrearPrducto}></Route>
                          <Route path="/vendedores" Component={vendedores}></Route>
                          <Route path="/clientes" Component={Clientes}></Route>
                          <Route path="/proveedores" Component={Proveedores}></Route>
                          <Route path="/cuotasListado" Component={PageListadoCuotas} ></Route>
                        </Routes>
                    </div>
                  </div>
                  {/* /.row */}
                </div>
                {/* /.container-fluid */}
              </div>
              {/* /.content */}
            </div>
          );
        };