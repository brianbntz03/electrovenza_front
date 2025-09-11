import React, { useState } from "react";
import { apiRest } from "./service/apiRest";

export function FormularioLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    try {
     
      const response = await fetch(`${apiRest}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Exitoso:", data);
        const token = data.access_token;
        const userRole = data.user ? data.user.role : null; // Se asume que el rol está en data.user.role

        if (token && userRole) {
          localStorage.setItem("jwt_token", token);
          localStorage.setItem("user_role", userRole); // Guardar el rol en localStorage
          onLoginSuccess(userRole);
        } else {
          console.log("No se recibió el token o el rol de autenticación. Por favor, verifica la respuesta de tu API.");
        }
      } else {
        console.log(data.message || "Error en el login.");
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud:", error);
      console.log("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box login-custom-box">
        <div className="card">
          <div className="card-body login-card-body custom-login-card">
            <h4 className="login-box-msg">Bienvenido a ElectroVenza</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="emailInput">Correo electronico</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                  placeholder="Email o nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordInput">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="passwordInput"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block login-btn"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioLogin;
