import React, { useState } from "react";
import { apiRest } from "./service/apiRest";
import FlashMessage from "./Components/tiny/FlashMessage"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function FormularioLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      console.log("Por favor, completa todos los campos.");
      FlashMessage("Login", "Por favor, completa todos los campos.", 2000, "error");
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
        const userId = data.user ? data.user.id : null; // Se asume que el id está en data.user.id
        const vendedorId = data.vendedor ? data.vendedor.id : null;
        const vendedorName = data.vendedor ? data.vendedor.name : null;


        if (token && userRole) {
          localStorage.setItem("jwt_token", token);
          localStorage.setItem("user_role", userRole); // Guardar el rol en localStorage
          localStorage.setItem("user_id", userId); // Guardar el rol en localStorage
          localStorage.setItem("vendedor_id", vendedorId); // Guardar el rol en localStorage
          localStorage.setItem("vendedor_nombre", vendedorName); // Guardar el rol en localStorage
          onLoginSuccess(userRole);
        } else {
          console.log("No se recibió el token o el rol de autenticación. Por favor, verifica la respuesta de tu API.");
        }
      } else {
        FlashMessage("Login", "Verifique el usuario y contraseña ingresado", 2000, "error");
        console.log(data.message || "Error en el login.");
      }
    } catch (error) {
      FlashMessage("Login", "Error en servidor, intente más tarde o contactese con el soporte técnico", 2000, "error");
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
               <div className="input-group mb-3">
      <input
        type={showPassword ? 'text' : 'password'}
        className="form-control"
        name="pass"
        id="pass"
        data-testid="royal-pass"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Contraseña"
        tabIndex="0"
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={togglePasswordVisibility}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
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
