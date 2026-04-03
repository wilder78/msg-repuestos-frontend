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
import ActionButtons from "../../../components/shared/ActionButtons";

const RolesTable = ({ roles, isLoading, onView, onEdit, onDelete }) => {
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
        <span className="ml-2 text-slate-500 font-medium">
          Cargando roles...
        </span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent bg-slate-50/50">
          <TableHead className="w-[300px]">Rol</TableHead>
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
            <TableRow
              key={rol.id} // Usamos el ID normalizado por el hook
              className="group transition-colors hover:bg-slate-50/50"
            >
              <TableCell>
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-3 w-3 rounded-full shrink-0 shadow-sm ${getRoleColor(rol.nombre)}`}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 leading-none mb-1">
                      {rol.nombre}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">
                      {rol.descripcion}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 text-[11px] font-bold bg-white text-slate-600 shadow-xs">
                  {rol.permisosCount}{" "}
                  {rol.permisosCount === 1 ? "permiso" : "permisos"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="h-3 w-3" />
                  {rol.estado}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-sm font-medium">
                {rol.fechaCreacion}
              </TableCell>
              <TableCell className="text-right">
                <ActionButtons
                  item={rol}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  labels={{
                    view: "Ver detalles",
                    edit: "Editar rol",
                    delete: "Eliminar rol",
                  }}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RolesTable;
