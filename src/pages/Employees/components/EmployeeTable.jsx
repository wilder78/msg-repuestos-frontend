import React from 'react';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

export function EmployeeTable({ 
  empleados, 
  onView, 
  onEdit, 
  onDelete, 
  getCargoStyle 
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
            <TableHead className="w-[80px] px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Foto</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Empleado</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider text-center">Cargo</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Contacto</TableHead>
            <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Estado</TableHead>
            <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[11px] tracking-wider text-right pr-10">Acciones</TableHead>
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
                    <AvatarImage src={empleado.foto} />
                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                      {getInitials(empleado.nombres, empleado.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                {/* Información Principal */}
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-[14px]">
                      {empleado.nombres} {empleado.apellidos}
                    </span>
                    <div className="flex items-center text-[12px] text-slate-400 mt-0.5 font-medium">
                      <MapPin size={12} className="mr-1 text-slate-300" /> {empleado.ciudad}
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
                      <Mail size={14} className="text-slate-300" /> {empleado.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-300" /> {empleado.telefono}
                    </div>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell className="px-6 py-4">
                  <div className={`flex items-center gap-1.5 font-bold text-[12px] ${
                    empleado.estado === 'activo' ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {empleado.estado === 'activo' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <XCircle size={16} className="text-slate-300" />
                    )}
                    {empleado.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell className="px-6 py-4 text-right pr-6">
                  <div className="flex justify-end items-center gap-1 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onView(empleado)}
                      className="text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-full h-8 w-8"
                    >
                      <Eye size={17} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(empleado)}
                      className="text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-full h-8 w-8"
                    >
                      <Pencil size={17} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(empleado)}
                      className="text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full h-8 w-8"
                    >
                      <Trash2 size={17} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                No se encontraron colaboradores que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}