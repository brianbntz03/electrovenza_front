import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "./FormularioLogin";
import Header from "./Components/Header";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import Aside from "./Components/Aside";
import { useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();

   const hideLayoutRoutes = [
    "/catalogo-mayorista",
    "/catalogo-minorista",
    "/catalogo-vendedor-mayorista"
   ];

  const hideLayout = hideLayoutRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("user_role", role);
    navigate("/index");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const role = localStorage.getItem("user_role");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && window.AdminLTE) {
      window.AdminLTE.init();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // Agregar overlay para cerrar menú en móviles
      const handleOverlayClick = (e) => {
        // Solo cerrar si el clic es en el overlay, no en el sidebar
        if (e.target.classList.contains('sidebar-overlay') && window.innerWidth <= 991.98) {
          document.body.classList.remove('sidebar-open');
        }
      };

      // Crear overlay si no existe
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', handleOverlayClick);
        document.body.appendChild(overlay);
      }

      return () => {
        if (overlay) {
          overlay.removeEventListener('click', handleOverlayClick);
        }
      };
    }
  }, [isAuthenticated]);

  if (checkingAuth) {
    return <div>Cargando...</div>
  }

return (
  <div>
    {hideLayout ? (
      <Content />
    ) : isAuthenticated ? (
      <>
        <Header onLogout={handleLogout} />
        <Aside />
        <Content />
        <Footer />
      </>
    ) : (
      <FormularioLogin onLoginSuccess={handleLoginSuccess} />
    )}
  </div>
);
}
