import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Aside() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [electroOpen, setElectroOpen] = useState(false);
  const [creditosOpen, setCreditosOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [cuentaCorrienteOpen, setCuentaCorrienteOpen] = useState(false);
  const [comprasOpen, setComprasOpen] = useState(false);
  const [electroConfigOpen, setElectroConfigOpen] = useState(false);

  const electroPaths = [
    "/buscar-articulos-presupuesto",
    "/cuotas-por-cobrar",
    "/ventas-listado",
  ];
  const creditosPaths = [
    "/otorgar-credito",
    "/creditos-cuotas-por-cobrar",
    "/credito-por-cobrar",
  ];
  const configPaths = [
    "/settingCuotasElectoListado",
    "/SettingCuotasCreditoListado",
    "/SettingBandasPreciosListado",
  ];
  
  const cuentaCorrientePaths = [
    "/registrar-movimento",
    "/ventas-comisiones-pendientes",
  ]

  const comprasPaths = [
    "/compras-listado",
    "/crear-compra",
    "/crear-proveedor",
    "/proveedores-listado",
  ];

  const electroConfigPaths = [
    "/categoriasListado",
    "/productosListado",
  ];

  useEffect(() => {
    // Leer el rol del usuario del localStorage al cargar el componente
    const role = localStorage.getItem("user_role");
    if (role) {
      setUserRole(role);
    }
    // Lógica para abrir los menús basándose en la ruta actual
    setElectroOpen(
      electroPaths.some((path) => location.pathname.startsWith(path))
    );
    setCreditosOpen(
      creditosPaths.some((path) => location.pathname.startsWith(path))
    );
    setConfigOpen(
      configPaths.some((path) => location.pathname.startsWith(path))
    );
    setCuentaCorrienteOpen(
      cuentaCorrientePaths.some((path) => location.pathname.startsWith(path))
    );
    setComprasOpen(
      comprasPaths.some((path) => location.pathname.startsWith(path))
    );
    setElectroConfigOpen(
      electroConfigPaths.some((path) => location.pathname.startsWith(path))
    );
  }, [location]);

  const toggleElectro = (e) => {
    e.preventDefault();
    setElectroOpen(!electroOpen);
  };
  const toggleCreditos = (e) => {
    e.preventDefault();
    setCreditosOpen(!creditosOpen);
  };
  const toggleConfig = (e) => {
    e.preventDefault();
    setConfigOpen(!configOpen);
  };

  const toggleCuentaCorriente = (e) => {
    e.preventDefault();
    setCuentaCorrienteOpen(!cuentaCorrienteOpen);
  }

  const toggleCompras = (e) => {
    e.preventDefault();
    setComprasOpen(!comprasOpen);
  }

  const toggleElectroConfig = (e) => {
    e.preventDefault();
    setElectroConfigOpen(!electroConfigOpen);
  }

  const renderVendedorMenu = () => (
    <>
      <li className="nav-header"><i>VISTA VENDEDOR</i></li>
      <li
        className={`nav-item ${electroOpen ? "menu-is-opening menu-open" : ""}`}
      >
        <a href="#" className="nav-link" onClick={toggleElectro}>
          <i className="nav-icon fas fa-bolt" />
          <p>
            ELECTRO
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/buscar-articulos-presupuesto" className="nav-link">
              <i className="nav-icon fas fa-dollar-sign" />
              <p>Vender</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cuotas-por-cobrar" className="nav-link">
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Cuotas por cobrar</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/ventas-listado" className="nav-link">
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Ventas</p>
            </NavLink>
          </li>
        </ul>
      </li>
      <li
        className={`nav-item ${
          creditosOpen ? "menu-is-opening menu-open" : ""
        }`}
      >
        <a href="#" className="nav-link" onClick={toggleCreditos}>
          <i className="nav-icon fas fa-credit-card" />
          <p>
            CREDITOS
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/otorgar-credito" className="nav-link">
              <i className="nav-icon fas fa-table" />
              <p>Otorgar Credito</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/creditos-cuotas-por-cobrar" className="nav-link">
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Cuotas por cobrar</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/credito-por-cobrar" className="nav-link">
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Creditos por cobrar</p>
            </NavLink>
          </li>
        </ul>
      </li>
    </>
  );

  const renderAdminMenu = () => (
    <>
      {renderVendedorMenu()}
      <li className="nav-header"><hr></hr></li>
      <li className="nav-header"><i>VISTA ADMINISTRADOR</i></li>

      <li className="nav-item">
        <NavLink to="/vendedores" className="nav-link">
          <i className="nav-icon fas fa-handshake" />
          <p>Vendedores</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/clientes" className="nav-link">
          <i className="nav-icon fas fa-user" />
          <p>Clientes</p>
        </NavLink>
      </li>
      
      <li className={`nav-item ${cuentaCorrienteOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleCuentaCorriente}>
          <p>
            CUENTA CORRIENTE
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
          <NavLink to="/registrar-movimento" className="nav-link">
            <i className="nav-icon fas fa-table" />
            <p>Registrar movimento</p>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/ventas-comisiones-pendientes" className="nav-link">
            <i className="nav-icon fas fa-file-invoice-dollar" />
            <p>Comisiones Pendientes</p>
          </NavLink>
        </li>
        </ul>
      
      </li>
      <li className={`nav-item ${comprasOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleCompras}>
          <p>
            COMPRAS
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          
        <li className="nav-item">
          <NavLink to="/compras-listado" className="nav-link">
            <i className="nav-icon fas fa-table" />
            <p>Compras</p>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/proveedores" className="nav-link">
            <i className="nav-icon fas fa-truck" />
            <p>Proveedores</p>
          </NavLink>
        </li>
        
        </ul>
      
      </li>

      <li className={`nav-item ${electroConfigOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleElectroConfig}>
          <p>
            ELECTRO
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/categoriasListado" className="nav-link">
              <i className="nav-icon fas fa-table" />
              <p>Categorias</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/productosListado" className="nav-link">
              <i className="nav-icon fas fa-barcode" />
              <p>Productos</p>
            </NavLink>
          </li>
        
        </ul>
      
      </li>
      
      
      
      
      
      <li className="nav-header">SETUP</li>
      <li
        className={`nav-item ${configOpen ? "menu-is-opening menu-open" : ""}`}
      >
        <a href="#" className="nav-link" onClick={toggleConfig}>
          <i className="nav-icon fas fa-cog" />
          <p>
            CONFIGURACION
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/settingCuotasElectoListado" className="nav-link">
              <i className="nav-icon fas fa-table" />
              <p>Cuotas Electro</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/SettingCuotasCreditoListado" className="nav-link">
              <i className="nav-icon fas fa-table" />
              <p>Cuotas Credito</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/SettingBandasPreciosListado" className="nav-link">
              <i className="nav-icon fas fa-table" />
              <p>Bandas Margen Precio</p>
            </NavLink>
          </li>
        </ul>
      </li>
    </>
  );

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <NavLink to="/index" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">EletroVenza</span>
        </NavLink>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink to="/index" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Inicio</p>
                </NavLink>
              </li>
              {userRole === "admin" ? renderAdminMenu() : renderVendedorMenu()}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
