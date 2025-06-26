import React from "react";
import { NavLink } from "react-router-dom";

export default function Aside() {
  return (
    <div> 
      <NavLink to="" activeClassName=""></NavLink>
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <NavLink to="index3.html" className="brand-link">
      <img
          src="dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">Tienda</span>
      </NavLink >
      {/* Sidebar */}
      <div className="sidebar">

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
            <li className="nav-item">
              <NavLink to="/categoriasListado" className="nav-link">
                <i className="nav-icon far fa-image" />
                <p>
                    Categorias
                  <i className="fas fa-angle-left right"/>
                </p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/productosListado" className="nav-link">
                <i className="nav-icon far fa-image" />
                <p>
                    Productos
                  <i className="fas fa-angle-left right"/>
                </p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/buscar-articulos-presupuesto" className="nav-link">
                <i className="nav-icon far fa-image" />
                <p>
                    Presupuesto & Venta
                  <i className="fas fa-angle-left right"/>
                </p>
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/ventas" className="nav-link">
                <i className="nav-icon far fa-image" />
                <p>
                    Listado ventas
                  <i className="fas fa-angle-left right"/>
                </p>
              </NavLink>
            </li>
            
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
    </div>


  );
}
