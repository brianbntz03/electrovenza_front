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

export default function Content(){
    return(
            <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0">Tienda</h1>
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
                          <Route path="/categoriasListado" Component={Categorias} ></Route>
                          <Route path="/productosListado" Component={Productos} ></Route>
                          <Route path="/crear" Component={CrearPresupuesto}></Route>  
                          <Route path="/historial" Component={HistorialPresupuesto}></Route>
                          <Route path="/lista" Component={ListaPresupuesto}></Route>
                          <Route path="/crearcategorias" Component={CreacionCategorias}></Route>
                          <Route path="/articulos" Component={Articulos}></Route>
                          <Route path="/buscar-articulos-presupuesto" Component={Presupuestossss}></Route>
                          <Route path="/ventas" Component={Ventas}></Route>
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