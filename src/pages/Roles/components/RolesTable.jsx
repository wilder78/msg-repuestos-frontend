import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Loader2, ShieldCheck, Calendar } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";
import ActionButtons from "../../../components/shared/ActionButtons";

// --- Funciones de ayuda internas ---
const getRoleColor = (rolName) => {
  const colors = {
    Master: "bg-red-500",
    Administrador: "bg-blue-500",
    Vendedor: "bg-emerald-500",
    Bodeguero: "bg-amber-500",
    Contador: "bg-purple-500",
  };
  return colors[rolName] || "bg-slate-400";
};

const RolesTable = ({ 
  roles, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t">
        <p className="text-slate-500 font-medium">No se encontraron roles registrados</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow>
          <TableHead className="pl-6 w-[300px]">Rol / Descripción</TableHead>
          <TableHead>Permisos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Creación</TableHead>
          <TableHead className="text-right pr-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((rol) => (
          <TableRow
            key={rol.id}
            className="group hover:bg-slate-50/50 transition-colors"
          >
            {/* Columna de Rol con indicador de color */}
            <TableCell className="pl-6">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-3 w-3 rounded-full shrink-0 shadow-sm ${getRoleColor(rol.nombre)}`}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 leading-none mb-1">
                    {rol.nombre}
                  </span>
                  <span className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">
                    {rol.descripcion || "Sin descripción"}
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Columna de Conteo de Permisos */}
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-[11px] font-bold bg-white text-slate-600 shadow-xs">
                  {rol.permisosCount || 0} {rol.permisosCount === 1 ? "permiso" : "permisos"}
                </span>
              </div>
            </TableCell>

            {/* Columna de Estado usando StatusBadge */}
            <TableCell>
              <StatusBadge
                statusId={rol.idEstado}
                onClick={() => onToggleStatus && onToggleStatus(rol)}
              />
            </TableCell>

            {/* Columna de Fecha */}
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {rol.fechaCreacion || "N/A"}
              </div>
            </TableCell>

            {/* Columna de Acciones */}
            <TableCell className="text-right pr-6">
              <ActionButtons
                item={rol}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                disabledEdit={rol.idEstado !== 1}
                disabledDelete={rol.idEstado !== 1}
                labels={{
                  view: "Ver detalles",
                  edit: "Editar rol",
                  delete: "Eliminar rol",
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RolesTable;
