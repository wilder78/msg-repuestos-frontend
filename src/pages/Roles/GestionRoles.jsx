import React, { useState, useMemo } from "react"; // Añadido useMemo a la importación
import { useRoles } from "../../hooks/useRoles";
import RolesTable from "./components/RolesTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, ShieldCheck } from "lucide-react";

const GestionRoles = () => {
  // Obtenemos los roles. El hook ahora debe proveer 'fechaCreacion'
  const { roles, loading, refresh } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filtrado dinámico:
   * Se usa useMemo para evitar cálculos costosos en cada renderizado.
   */
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    return roles.filter(
      (rol) =>
        rol.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [roles, searchTerm]);

  // Manejador de visualización corregido para usar la propiedad correcta
  const handleViewDetails = (rol) => {
    console.log("Consultando detalles del rol:", rol.nombre);
    // Cambiado a fechaCreacion para consistencia
    console.log("Fecha de registro:", rol.fechaCreacion);
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Gestión de Roles y Permisos
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            MSG Repuestos - Panel de control de acceso y seguridad
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all">
          <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Rol
        </Button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Barra de Herramientas Superior */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-700">Roles del Sistema</h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
              {filteredRoles.length} registrados
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Componente de Tabla */}
        <RolesTable
          roles={filteredRoles}
          isLoading={loading}
          onView={handleViewDetails}
          onEdit={(rol) => console.log("Editando rol:", rol.id)}
          onDelete={(rol) => console.log("Eliminando rol:", rol.id)}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
};

export default GestionRoles;
