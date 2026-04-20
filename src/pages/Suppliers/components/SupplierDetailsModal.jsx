import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Truck, Mail, Phone, MapPin, Building2, UserCircle, Globe } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";

const SupplierDetailsModal = ({ isOpen, onClose, proveedor }) => {
  if (!proveedor || !isOpen) return null;

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
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-100">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles del Proveedor
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información detallada de la entidad comercial
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Perfil del Proveedor */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {proveedor.nombre}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  NIT/RUT: <span className="text-slate-700 font-bold">{proveedor.nit || "No registrado"}</span>
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full font-semibold ${
                      proveedor.statusId === 1
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {proveedor.estado || (proveedor.statusId === 1 ? "activo" : "inactivo")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información de Ubicación */}
            <InfoCard icon={MapPin} iconColor="blue" title="Ubicación y Sede">
              <div>
                <p className="text-xs text-slate-500 mb-1">Dirección Principal</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {proveedor.direccion || "No especificada"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Ciudad / Ciudadela</p>
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-800 lowercase first-letter:uppercase">
                    {proveedor.ciudad || "No registrada"}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Información de Contacto */}
            <InfoCard icon={UserCircle} iconColor="blue" title="Datos de Contacto">
              <div>
                <p className="text-xs text-slate-500 mb-1">Persona de Contacto</p>
                <p className="text-sm font-semibold text-slate-800 uppercase">
                  {proveedor.contactoNombre || "No asignado"}
                </p>
              </div>
              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-800">
                    {proveedor.telefono || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-800 break-all">
                    {proveedor.email || "-"}
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Condiciones Comerciales */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
             <h3 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
               <Separator className="w-4 bg-amber-200" />
               Condiciones Comerciales
             </h3>
             <p className="text-sm text-slate-700 leading-relaxed italic">
               "{proveedor.condiciones || "Sin condiciones comerciales definidas"}"
             </p>
          </div>

          {/* Información Adicional/Sistema */}
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
             <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                 <span>ID DEL SISTEMA: <span className="font-mono text-slate-500">#{proveedor.id}</span></span>
               </div>
               <span>VERIFICADO</span>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDetailsModal;
