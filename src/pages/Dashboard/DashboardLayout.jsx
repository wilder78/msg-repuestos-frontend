import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Temporal */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8">MSG Panel</h1>
        <nav className="space-y-4">
          <div className="p-3 bg-blue-600 rounded-lg cursor-pointer">Inicio</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">Inventario</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">Ventas</div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <span className="font-medium text-gray-600">Bienvenido, {user?.name || 'Empleado'}</span>
          <button 
            onClick={logout}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Cerrar Sesión
          </button>
        </header>
        
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800">Resumen del Sistema</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Ventas hoy</p>
              <p className="text-3xl font-bold">$1,250,000</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Repuestos bajos</p>
              <p className="text-3xl font-bold text-orange-500">12</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Pedidos pendientes</p>
              <p className="text-3xl font-bold text-blue-500">5</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};