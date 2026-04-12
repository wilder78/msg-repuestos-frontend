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
import { MapPin, X, Globe } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";
import StatusBadge from "../../../components/shared/StatusBadge";

const AreaDetailsModal = ({ isOpen, onClose, zone }) => {
  if (!zone) return null;

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
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles de la Zona
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información completa del registro seleccionado
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
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {zone.name || zone.nombre || "Zona"}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {zone.description ||
                    zone.descripcion ||
                    "Sin descripción asignada"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <StatusBadge statusId={zone.statusId || zone.status_id} />
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información Básica */}
            <InfoCard
              icon={MapPin}
              iconColor="emerald"
              title="Información Básica"
            >
              <div>
                <p className="text-xs text-slate-500 mb-1">ID de Zona</p>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  #{zone.id?.toString().padStart(4, "0") || "0000"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Nombre</p>
                <p className="text-sm font-semibold text-slate-800">
                  {zone.name || zone.nombre || "-"}
                </p>
              </div>
            </InfoCard>

            {/* Estado y Detalles */}
            <InfoCard icon={Globe} iconColor="blue" title="Estado del Registro">
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado Actual</p>
                <StatusBadge statusId={zone.statusId || zone.status_id} />
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Tipo</p>
                <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md">
                  Zona Geográfica
                </span>
              </div>
            </InfoCard>
          </div>

          {/* Descripción Detallada */}
          {(zone.description || zone.descripcion) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-2">
                📝 Descripción Completa
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {zone.description || zone.descripcion}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AreaDetailsModal;
