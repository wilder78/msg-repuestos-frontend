import React from "react";
import { Mail, Phone, Calendar, UserCheck, Loader2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import ActionButtons from "../../../components/shared/ActionButtons";
import StatusBadge from "../../../components/shared/StatusBadge";

export function CustomerTable({ customers, loading, onView, onEdit, onDelete, onToggleStatus }) {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando base de datos...</p>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <UserCheck className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-slate-800 font-bold text-lg">No hay clientes</h3>
        <p className="text-slate-500 max-w-[250px]">
          No se encontraron registros que coincidan con la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[80px] px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Foto</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Cliente</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Contacto</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Tipo</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Estado</TableHead>
            <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[11px] tracking-wider pr-10">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.idCliente}
              className="hover:bg-slate-50/80 transition-all group border-b border-slate-100"
            >
              {/* AVATAR */}
              <TableCell className="px-6 py-4">
                <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                    {customer.razonSocial?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              {/* CLIENTE */}
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 text-[14px]">
                    {customer.razonSocial || "Sin nombre"}
                  </span>
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                    <Calendar size={12} />
                    {customer.fechaRegistro
                      ? new Date(customer.fechaRegistro).toLocaleDateString()
                      : "Sin fecha"}
                  </div>
                </div>
              </TableCell>

              {/* CONTACTO */}
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1 text-[13px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-300" />
                    {customer.email || "Sin correo"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-300" />
                    {customer.telefono || "Sin teléfono"}
                  </div>
                </div>
              </TableCell>

              {/* TIPO CLIENTE */}
              <TableCell className="px-6 py-4">
                <span className="text-xs font-medium text-slate-600 bg-slate-100/50 px-2 py-1 rounded-md">
                  {customer.tipoCliente || "—"}
                </span>
              </TableCell>

              {/* ESTADO */}
              <TableCell className="px-6 py-4">
                <StatusBadge
                  statusId={customer.activo}
                  onClick={() => onToggleStatus?.(customer)}
                />
              </TableCell>

              {/* ACCIONES */}
              <TableCell className="px-6 py-4 text-right pr-6">
                <ActionButtons
                  item={customer}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  disabledEdit={customer.activo !== 1}
                  disabledDelete={customer.activo !== 1}
                  labels={{
                    view: "Ver cliente",
                    edit: "Editar cliente",
                    delete: "Eliminar cliente",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}