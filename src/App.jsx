import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import GestionUsuarios from "./pages/Users/GestionUsuarios";
import GestionZona from "./pages/Area/GestionZona";
// Importamos el nuevo componente de Roles
import GestionRoles from "./pages/Roles/GestionRoles";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ─── Rutas del Dashboard ─────────────────────────────────────── */}

      {/* Inicio del Dashboard */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        }
      />

      {/* Gestión de Usuarios */}
      <Route
        path="/dashboard/usuarios"
        element={
          <DashboardLayout>
            <GestionUsuarios />
          </DashboardLayout>
        }
      />

      {/* Gestión de Zonas */}
      <Route
        path="/dashboard/zonas"
        element={
          <DashboardLayout>
            <GestionZona />
          </DashboardLayout>
        }
      />
      <Route path="/zonas" element={<Navigate to="/dashboard/zonas" replace />} />

      {/* Gestión de Roles y Permisos */}
      <Route
        path="/dashboard/roles"
        element={
          <DashboardLayout>
            <GestionRoles />
          </DashboardLayout>
        }
      />

      {/* ─── Manejo de Error 404 ─────────────────────────────────────── */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-slate-800">
            404 - Página no encontrada
          </div>
        }
      />
    </Routes>
  );
}
