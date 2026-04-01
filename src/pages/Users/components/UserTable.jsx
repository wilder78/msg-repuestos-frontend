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
import { Eye, Edit2, Trash2, Mail, Loader2 } from "lucide-react";
import EstadoBadge from "./EstadoBadge"; // Se asume que está en la misma carpeta

const UserTable = ({
  users,
  roleMap,
  loading,
  getAvatarColor,
  getInitials,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t">
        <p className="text-slate-500 font-medium">No se encontraron usuarios</p>
        <p className="text-slate-400 text-sm">
          Prueba con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow>
          <TableHead className="pl-6 w-[80px]">Foto</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Cargo / Rol</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow
            key={u.idUsuario}
            className="group hover:bg-slate-50/50 transition-colors"
          >
            <TableCell className="pl-6">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getAvatarColor(u.idUsuario)}`}
              >
                {getInitials(u.nombreUsuario)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">
                  {u.nombreUsuario}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  ID: {u.idUsuario}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {roleMap[u.id_rol] || "User"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {u.email}
              </div>
            </TableCell>
            <TableCell>
              <button
                onClick={() => onToggleStatus(u)}
                className="hover:scale-105 transition-transform active:scale-95 focus:outline-none"
              >
                <EstadoBadge usuario={u} size="small" />
              </button>
            </TableCell>
            <TableCell className="text-right pr-6">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  onClick={() => onView(u)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                  onClick={() => onEdit(u)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(u)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
