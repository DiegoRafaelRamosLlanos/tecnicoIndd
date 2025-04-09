import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import './Login.css';
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const users = [
    { username: "administrador", password: "administrador" },
    { username: "secretario", password: "secretario" },
    { username: "preceptor", password: "preceptor" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      onLogin();
      if (user.username === "secretario") {
        navigate("/secretaryDashboard"); // Cambiado para coincidir con la ruta en App.js
      } else {
        navigate("/dashboard");
      }
    } else {
      setErrorMessage("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="background">
      <div className="shape shape-custom"></div> {/* Cambiado a shape-custom */}
      <form onSubmit={handleLogin}>
        <h3>Login</h3>
        <label>Nombre de usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="User"
          required
        />
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {errorMessage && <div style={{ color: "#e65353" }}>{errorMessage}</div>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
