import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import GestionUsuarios from "./pages/Users/GestionUsuarios";
import GestionZona from "./pages/Area/GestionZona";
import GestionRoles from "./pages/Roles/GestionRoles";
import GestionEmpleados from "./pages/Employees/GestionEmpleados";
import GestionClientes from "./pages/Customers/GestionClientes";
import GestionPermisos from "./pages/Permits/GestionPermisos";
import GestionProveedor from "./pages/Suppliers/GestionProveedor";
import GestionCategorias from "./pages/Category/GestionCategorias";

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
      <Route
        path="/zonas"
        element={<Navigate to="/dashboard/zonas" replace />}
      />

      {/* Gestión de Roles */}
      <Route
        path="/dashboard/roles"
        element={
          <DashboardLayout>
            <GestionRoles />
          </DashboardLayout>
        }
      />

      {/* ✅ Nueva Ruta: Gestión de Permisos */}
      <Route
        path="/dashboard/permisos"
        element={
          <DashboardLayout>
            <GestionPermisos />
          </DashboardLayout>
        }
      />

      {/* Gestión de Empleados */}
      <Route
        path="/dashboard/empleados"
        element={
          <DashboardLayout>
            <GestionEmpleados />
          </DashboardLayout>
        }
      />

      {/* Gestión de Clientes */}
      <Route
        path="/dashboard/customers"
        element={
          <DashboardLayout>
            <GestionClientes />
          </DashboardLayout>
        }
      />

      {/* Gestión de Proveedores */}
      <Route
        path="/dashboard/suppliers"
        element={
          <DashboardLayout>
            <GestionProveedor />
          </DashboardLayout>
        }
      />
      <Route
        path="/proveedores"
        element={<Navigate to="/dashboard/suppliers" replace />}
      />

      {/* Gestión de Categorías */}
      <Route
        path="/dashboard/categorias"
        element={
          <DashboardLayout>
            <GestionCategorias />
          </DashboardLayout>
        }
      />
      <Route
        path="/categorias"
        element={<Navigate to="/dashboard/categorias" replace />}
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
