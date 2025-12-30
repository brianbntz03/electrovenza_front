import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function   Aside() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [electroOpen, setElectroOpen] = useState(false);
  const [creditosOpen, setCreditosOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [cuentaCorrienteOpen, setCuentaCorrienteOpen] = useState(false);
  const [comprasOpen, setComprasOpen] = useState(false);
  const [electroConfigOpen, setElectroConfigOpen] = useState(false);
  const [reporteOpen, setReporte] = useState(false)
  const [Clientes_filtrado_vendedor_Open, setClientes_filtrado_vendedor_Open] = useState(false);
  const [Cuenta_corrente_de_vendedor_Open, setCuenta_corrente_de_vendedor_Open] = useState(false)

  const electroPaths = [
    "/buscar-articulos-presupuesto",
    "/ventas-listado",
    "/cuotas-por-cobrar-electro",
  ];
  const creditosPaths = [
    "/otorgar-credito",
    "/creditos-cuotas-por-cobrar",
    "/creditos-listado",
    "/cuota-vencida",
  ];

  const Clientes_filtrado_vendedor_Paths = [
    "/clientes-filtrado-vendedor",
  ];

  const configPaths = [
    "/settingCuotasElectoListado",
    "/SettingCuotasCreditoListado",
    "/SettingBandasPreciosListado",
    "/tipo-movimiento-cc",
  ];
  
  const cuentaCorrientePaths = [
    "/registrar-movimiento",
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
  const reportesConfigPaths = [
    "/reporte-cobranza",
    "/reporte-ganancia",
  ]

  useEffect(() => {
    // Leer el rol del usuario del localStorage al cargar el componente
    const role = localStorage.getItem("user_role");
    if (role) {
      setUserRole(role);
    }
    setElectroOpen(
      electroPaths.some((path) => location.pathname.startsWith(path))
    );
    setCreditosOpen(
      creditosPaths.some((path) => location.pathname.startsWith(path))
    );
    setClientes_filtrado_vendedor_Open(
      Clientes_filtrado_vendedor_Paths.some((path) => location.pathname.startsWith(path))
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
    setReporte(
      reportesConfigPaths.some((path) => location.pathname.startsWith(path))
    );
  }, [location]);

  const toggleElectro = (e) => {
    e.preventDefault();
    setElectroOpen(!electroOpen);
  };

  const Toggle_cliente_filtrado_vendedor = (e) => {
    e.preventDefault();
    setClientes_filtrado_vendedor_Open(!Clientes_filtrado_vendedor_Open);
  };
  
  const Toggle_cuenta_corriente_vendedor = (e) => {
    e.preventDefault();
    setCuenta_corrente_de_vendedor_Open(!Cuenta_corrente_de_vendedor_Open);
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
  
  const togglesReportes = (e) => {
    e.preventDefault();
    setReporte(!reporteOpen);
  }

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 991.98) {
      document.body.classList.remove('sidebar-open');
    }
  };

 const renderVendedorMenu = () => (
    <>
      <li className="nav-header"><i>VISTA VENDEDOR</i></li>
      <li className="nav-item">
        <NavLink to="/cuotas-por-cobrar" className={({ isActive }) => `nav-link ${isActive ? "active-custom-style" : ""}`} onClick={closeMobileSidebar} >
          <i className="nav-icon fas fa-dollar-sign" />
          <p>CUOTAS POR COBRAR</p>
        </NavLink>
      </li>
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
            <NavLink to="/buscar-articulos-presupuesto" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-dollar-sign" />
              <p>Vender</p>
            </NavLink>
          </li>
        <li className="nav-item">
            <NavLink to="/venta-al-contado?venta_contado=true" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-dollar-sign" />
              <p>Venta Al Contado</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cuotas-por-cobrar-electro" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Cuotas por cobrar</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/ventas-listado" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-list-alt" />
              <p>Ventas</p>
            </NavLink>
          </li>
           <li className="nav-item">
            <NavLink to="/articulos-listado" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-list-alt" />
              <p>Articulos</p>
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
            <NavLink to="/otorgar-credito" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-hand-holding-usd"></i>
              <p>Otorgar Credito</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/creditos-cuotas-por-cobrar" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Cuotas por cobrar</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/creditos-listado" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-file-invoice-dollar" />
              <p>Creditos Asignados</p>
            </NavLink>
          </li>
          
        </ul>
      </li>
      <li
        className={`nav-item ${
          Clientes_filtrado_vendedor_Open ? "menu-is-opening menu-open" : ""
        }`}
      >
        <a href="#" className="nav-link" onClick={Toggle_cliente_filtrado_vendedor}>
          <i className="nav-icon fas fa-user-friends" />
          <p>
            CLIENTES
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
            <li className="nav-item">
                <NavLink to="/clientes-filtrado-vendedor" className="nav-link" onClick={closeMobileSidebar}>
                <i className="nav-icon fas fa-users"></i>
                <p>Listado de Clientes</p>
                </NavLink>
            </li>
        </ul>
      </li>
      <li
        className={`nav-item ${
          Cuenta_corrente_de_vendedor_Open ? "menu-is-opening menu-open" : ""
        }`}
      >
        <a href="#" className="nav-link" onClick={Toggle_cuenta_corriente_vendedor}>
          <i className="nav-icon fas fa-user-tag" /> 
          <p>
            Cuenta Corriente
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
            <li className="nav-item">
                <NavLink to="/ventas-comisiones-pendientes-vendedor" className="nav-link" onClick={closeMobileSidebar}>
              <i className="nav-icon fas fa-paperclip"></i>
                <p>Comisiones </p>
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
        <NavLink to="/vendedores" className="nav-link" onClick={closeMobileSidebar}>
          <i className="nav-icon fas fa-briefcase" />
          <p>Vendedores</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/clientes" className="nav-link" onClick={closeMobileSidebar}>
          <i className="nav-icon fas fa-users" />
          <p>Clientes</p>
        </NavLink>
      </li>
      
      <li className={`nav-item ${cuentaCorrienteOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleCuentaCorriente}>
          <i className="nav-icon fas fa-file-invoice-dollar" />
          <p>
            CUENTA CORRIENTE
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
          <NavLink to="/registrar-movimiento" className="nav-link">
            <i className="nav-icon fas fa-plus-circle"/>
            <p> Registrar movimento </p>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/ventas-comisiones-pendientes" className="nav-link">
            <i className="nav-icon fas fa-percent" />
            <p>Comisiones Pendientes</p>
          </NavLink>
        </li>
        </ul>
      
      </li>
      <li className={`nav-item ${comprasOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleCompras}>
          <i className="nav-icon fas fa-shopping-cart" />
          <p>
            COMPRAS
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
        <li className="nav-item">
          <NavLink to="/compras-listado" className="nav-link">
            <i className="nav-icon fas fa-list-alt" />
            <p>Compras</p>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/proveedores" className="nav-link">
            <i className="nav-icon fas fa-handshake" />
            <p>Proveedores</p>
          </NavLink>
        </li>
        </ul>
      </li>

      <li className={`nav-item ${electroConfigOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={toggleElectroConfig}>
          <i className="nav-icon fas fa-tools" />
          <p>
            ELECTRO
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/categoriasListado" className="nav-link">
              <i className="nav-icon fas fa-sitemap" />
              <p>Categorias</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/productosListado" className="nav-link">
              <i className="nav-icon fas fa-barcode" />
              <p>Productos</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/actualizacion-masiva" className="nav-link">
              <i className="nav-icon fas fa-barcode" />
              <p>Actualización Masiva</p>
            </NavLink>
          </li>
        
        </ul>
      
      </li>
      
      <li className={`nav-item ${reporteOpen ? "menu-is-opening menu-open" : ""}`}>
        <a href="#" className="nav-link" onClick={togglesReportes}>
          <i className="nav-icon fas fa-tools" />
          <p>
            REPORTES
            <i className="fas fa-angle-left right"></i>
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <NavLink to="/reporte-cobranza" className="nav-link">
              <i className="nav-icon fas fa-sitemap" />
              <p>Reporte de Cobranza</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/reporte-ganancia" className="nav-link">
              <i className="nav-icon fas fa-barcode" />
              <p>Reporte de Ganancias</p>
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
              <i className="nav-icon fas fa-calendar-alt" />
              <p>Cuotas Electro</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/SettingCuotasCreditoListado" className="nav-link">
              <i className="nav-icon fas fa-calendar-alt" />
              <p>Cuotas Credito</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/SettingBandasPreciosListado" className="nav-link">
              <i className="nav-icon fas fa-percent" />
              <p>Bandas Margen Precio</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/tipo-movimiento-cc" className="nav-link">
              <i className="nav-icon fas fa-exchange-alt" />
              <p>Tipo Mov CC</p>
            </NavLink>
          </li>
        </ul>
      </li>
    </>
  );

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <NavLink to="/index" className="brand-link" onClick={closeMobileSidebar}>
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">EletroVenza</span>
        </NavLink>
        <div className="sidebar" style={{ height: 'calc(100vh - 57px)', overflowY: 'auto' }}>
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink to="/index" className="nav-link" onClick={closeMobileSidebar}>
                 <i className="fas fa-home" />
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