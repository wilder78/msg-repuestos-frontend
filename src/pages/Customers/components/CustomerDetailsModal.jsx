import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import {
  User,
  Users, // ✅ SE AGREGÓ ESTA IMPORTACIÓN
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  Globe,
  Calendar, // ✅ SE AGREGÓ ESTA IMPORTACIÓN
} from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";

const CustomerDetailsModal = ({ isOpen, onClose, cliente }) => {
  if (!cliente || !isOpen) return null;

  const getInitials = (name) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
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
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Ficha del Cliente
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm mt-1">
                  Detalles comerciales y de contacto
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
          {/* Perfil principal */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white shadow-sm ring-1 ring-slate-100">
                <AvatarFallback
                  className={`${getAvatarColor(cliente.idCliente)} text-white font-bold text-xl`}
                >
                  {getInitials(cliente.razonSocial)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {cliente.razonSocial}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-100 px-3 font-semibold text-[10px] uppercase tracking-wide rounded-full"
                  >
                    {cliente.tipoCliente || "No definido"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full font-semibold ${
                      cliente.activo === 1
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {cliente.activo === 1 ? "activo" : "inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identificación */}
            <InfoCard icon={User} iconColor="blue" title="Identificación">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  {cliente.tipoDocumento?.descripcion || "Documento"}
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  <span className="text-blue-600 font-bold mr-1">
                    {cliente.tipoDocumento?.sigla || "DOC"}:
                  </span>
                  {cliente.numeroDocumento}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">ID Sistema</p>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  #{cliente.idCliente?.toString().padStart(4, "0")}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Fecha de Registro</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {cliente.fechaRegistro
                    ? new Date(cliente.fechaRegistro).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No disponible"}
                </div>
              </div>
            </InfoCard>

            {/* Cartera y Crédito */}
            <InfoCard
              icon={CreditCard}
              iconColor="emerald"
              title="Cartera y Crédito"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">Cupo de Crédito</p>
                <p className="text-lg font-bold text-emerald-600">
                  $
                  {new Intl.NumberFormat("es-CO").format(
                    cliente.cupoCredito || 0,
                  )}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Tipo de Cliente</p>
                <Badge
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 bg-emerald-50 font-bold text-[10px] uppercase rounded-full"
                >
                  {cliente.tipoCliente}
                </Badge>
              </div>
            </InfoCard>

            {/* Ubicación */}
            <InfoCard
              icon={MapPin}
              iconColor="rose"
              title="Ubicación Geográfica"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Dirección Principal
                </p>
                <p className="text-sm font-semibold text-slate-800 italic">
                  {cliente.direccion || "No registrada"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Zona de Despacho</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Globe className="h-3.5 w-3.5 text-rose-400" />
                  Zona ID: {cliente.idZona || "N/A"}
                </div>
              </div>
            </InfoCard>

            {/* Canales de contacto */}
            <InfoCard icon={Mail} iconColor="violet" title="Canales de Contacto">
              <div>
                <p className="text-xs text-slate-500 mb-1">Persona de Contacto</p>
                <p className="text-sm font-bold text-slate-800">
                  {cliente.personaContacto || "No establecida"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Correo Electrónico</p>
                <p className="text-sm font-semibold text-violet-600 break-all">
                  {cliente.email || "Sin correo"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Teléfono / WhatsApp</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-violet-500" />
                  {cliente.telefono || "Sin teléfono"}
                </p>
              </div>
            </InfoCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
