import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Eye, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react";

const RolesTable = ({ roles, isLoading, onView, onEdit, onDelete }) => {
  // Función para determinar el color del círculo según el rol (si no viene del backend)
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-500">Cargando roles...</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent bg-slate-50/50">
          <TableHead className="w-[350px]">Rol</TableHead>
          <TableHead>Permisos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-slate-400">
              No se encontraron roles registrados.
            </TableCell>
          </TableRow>
        ) : (
          roles.map((rol) => (
            <TableRow key={rol.id_rol || rol.id} className="group">
              <TableCell>
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-3 w-3 rounded-full shrink-0 ${getRoleColor(rol.nombre_rol || rol.nombre)}`}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">
                      {rol.nombre_rol || rol.nombre}
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed max-w-[280px]">
                      {rol.descripcion || "Sin descripción asignada"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-[11px] font-medium bg-white text-slate-600 shadow-sm">
                  {rol.permisosCount}{" "}
                  {rol.permisosCount === 1 ? "permiso" : "permisos"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {rol.estado || "activo"}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {rol.fechaCreacion || "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:bg-blue-50"
                    onClick={() => onView(rol)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-emerald-500 hover:bg-emerald-50"
                    onClick={() => onEdit(rol)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:bg-red-50"
                    onClick={() => onDelete(rol)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RolesTable;
