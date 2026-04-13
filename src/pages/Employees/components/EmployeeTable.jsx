import React from "react";
import { Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import ActionButtons from "../../../components/shared/ActionButtons";
import StatusBadge from "../../../components/shared/StatusBadge";

export function EmployeeTable({
  empleados,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  getCargoStyle,
}) {
  // Función para obtener iniciales
  const getInitials = (nombres, apellidos) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[80px] px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              Foto
            </TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              Empleado
            </TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider text-center">
              Cargo
            </TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              Contacto
            </TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              Estado
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[11px] tracking-wider text-right pr-10">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleados.length > 0 ? (
            empleados.map((empleado) => (
              <TableRow
                key={empleado.id}
                className="hover:bg-slate-50/80 transition-all group border-b border-slate-100"
              >
                {/* Foto/Avatar */}
                <TableCell className="px-6 py-4">
                  <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-1 ring-slate-100">
                    {empleado.foto ? <AvatarImage src={empleado.foto} /> : null}
                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                      {getInitials(empleado.nombres, empleado.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                {/* Información Principal */}
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-800 text-[14px]">
                      {empleado.nombres} {empleado.apellidos}
                    </span>
                    <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                      <span>ID: {empleado.idUsuario ?? empleado.id}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Cargo con Badge Estilizado */}
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    variant="outline"
                    className={`${getCargoStyle(empleado.cargo)} border-none px-3 py-1 rounded-full font-bold text-[11px]`}
                  >
                    {empleado.cargo}
                  </Badge>
                </TableCell>

                {/* Contacto */}
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-[13px] text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-300" />{" "}
                      {empleado.telefono || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-300" />{" "}
                      {empleado.email || "-"}
                    </div>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell className="px-6 py-4">
                  <StatusBadge
                    statusId={empleado.statusId}
                    onClick={() => onToggleStatus(empleado)}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell className="px-6 py-4 text-right pr-6">
                  <ActionButtons
                    item={empleado}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    disabledEdit={empleado.statusId !== 1}
                    disabledDelete={empleado.statusId !== 1}
                    labels={{
                      view: "Ver empleado",
                      edit: "Editar empleado",
                      delete: "Eliminar empleado",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-slate-400 font-medium"
              >
                No se encontraron colaboradores que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
