import React from "react";
import { Eye, Edit, Trash2, Mail, Phone, Calendar, Globe, UserCheck, Megaphone } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";

export function CustomerTable({ customers }) {
  // Datos de ejemplo para que veas el diseño si la lista está vacía
  const displayData = customers.length > 0 ? customers : [
    { id: 1, nombres: "Carlos Eduardo", apellidos: "Mendoza García", email: "carlos@email.com", telefono: "+51 987654321", estado: "activo", medioRegistro: "Visita de Vendedor" }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4">Foto</th>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Contacto</th>
            <th className="px-6 py-4">Origen</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {displayData.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                    {customer.nombres[0]}{customer.apellidos[0]}
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">{customer.nombres} {customer.apellidos}</span>
                  <div className="flex items-center text-[11px] text-slate-400 mt-1">
                    <Calendar size={12} className="mr-1" /> 14/1/2024
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {customer.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {customer.telefono}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <UserCheck size={14} className="text-blue-500" /> {customer.medioRegistro}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={
                  customer.estado === "activo" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 px-3" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
                }>
                  {customer.estado === "activo" ? "● Activo" : "○ Inactivo"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50"><Eye size={18} /></Button>
                  <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-50"><Edit size={18} /></Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50"><Trash2 size={18} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}