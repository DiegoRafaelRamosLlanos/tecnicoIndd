import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./dashboard";
import SecretaryDashboard from "./SecretaryDashboard"; // Asegúrate que el nombre del archivo coincida exactamente

import React, { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/secretary" // Simplificamos la ruta
          element={isAuthenticated ? <SecretaryDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;