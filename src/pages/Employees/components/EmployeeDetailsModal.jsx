import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import { User, Mail, Phone, Briefcase, Smartphone, Shield } from "lucide-react";
import { X } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";

const DetailItem = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-300">{icon}</span>
        {value || "-"}
      </div>
    </div>
  );
};

const EmployeeDetailsModal = ({ isOpen, onClose, empleado, getCargoStyle }) => {
  if (!empleado) return null;

  const getInitials = (nombres, apellidos) => {
    return `${nombres?.charAt(0) || ""}${apellidos?.charAt(0) || ""}`.toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-emerald-500",
      "bg-blue-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-sky-500",
    ];
    return colors[(id || 0) % colors.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[650px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Encabezado */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Perfil del Empleado
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información registrada del colaborador
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Sección de Perfil Principal */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                <AvatarImage src={empleado.foto} />
                <AvatarFallback
                  className={`${getAvatarColor(empleado.id)} text-white font-bold text-xl`}
                >
                  {getInitials(empleado.nombres, empleado.apellidos)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {empleado.nombres} {empleado.apellidos}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`${getCargoStyle(empleado.cargo)} border-none`}
                  >
                    {empleado.cargo}
                  </Badge>
                  <span className="text-slate-400 text-sm">•</span>
                  <span
                    className={`text-sm font-bold ${
                      empleado.estado === "activo"
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {empleado.estado?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información Personal */}
            <InfoCard icon={User} iconColor="blue" title="Información Personal">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Número de Documento
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {empleado.numeroDocumento || "-"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">ID Empleado</p>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  #{empleado.id?.toString().padStart(4, "0") || "0000"}
                </p>
              </div>
            </InfoCard>

            {/* Datos Laborales */}
            <InfoCard
              icon={Briefcase}
              iconColor="emerald"
              title="Datos Laborales"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">Cargo Actual</p>
                <p className="text-sm font-semibold text-slate-800">
                  {empleado.cargo || "-"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado</p>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full font-semibold ${
                    empleado.estado === "activo"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {empleado.estado?.toUpperCase() || "INACTIVO"}
                </Badge>
              </div>
            </InfoCard>

            {/* Medios de Contacto */}
            <InfoCard
              icon={Smartphone}
              iconColor="violet"
              title="Medios de Contacto"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-800 break-all">
                  {empleado.email || "-"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-violet-600" />
                  {empleado.telefono || "-"}
                </p>
              </div>
            </InfoCard>

            {/* Información Adicional */}
            <InfoCard
              icon={Shield}
              iconColor="amber"
              title="Información del Sistema"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">Usuario Asociado</p>
                <p className="text-sm font-semibold text-slate-800">
                  {empleado.idUsuario
                    ? `ID: ${empleado.idUsuario}`
                    : "Sin usuario asignado"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Disponibilidad</p>
                <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md">
                  {empleado.disponibilidad ? "Disponible" : "No disponible"}
                </span>
              </div>
            </InfoCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
