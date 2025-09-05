// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Aside from "./Components/Aside";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import FormularioDeLogin from "./FormularioDeLogin";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt_token")
  );
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Ya no es necesario guardar 'isLoggedIn'
    navigate("/index");
  };

  const handleLogout = () => {
    // Cuando el usuario cierra sesión, se elimina el token
    localStorage.removeItem("jwt_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Se ejecuta solo una vez para verificar la autenticación inicial
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("jwt_token"));
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Header onLogout={handleLogout} />
          <Aside />
          <Content />
          <Footer />
        </>
      ) : (
        <FormularioDeLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}