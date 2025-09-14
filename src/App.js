import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "./FormularioLogin";
import Header from "./Components/Header";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import Aside from "./Components/Aside";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  }, []);

  useEffect(() => {
    if (isAuthenticated && window.AdminLTE) {
      window.AdminLTE.init();
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Header onLogout={handleLogout} />
          <Aside  />
          <Content />
          <Footer />
        </>
      ) : (
        <FormularioLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
