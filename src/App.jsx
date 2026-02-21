import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. Verificación de ruta para Home (Asegúrate de que la extensión sea .jsx)
import Home from "./pages/Home";

// 2. Verificación de ruta para ProtectedRoute
import { ProtectedRoute } from "./components/ProtectedRoute";

// 3. Verificación de DashboardLayout (Importación nombrada con llaves)
import { DashboardLayout } from "./pages/Dashboard/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal pública */}
        <Route path="/" element={<Home />} />

        {/* Ruta protegida para empleados (idRol !== 7) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Redirección automática si la ruta no existe */}
        {/* Requiere que 'Navigate' esté importado de react-router-dom */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
