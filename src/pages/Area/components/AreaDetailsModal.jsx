import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { MapPin, X } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";

const AreaDetailsModal = ({ isOpen, onClose, zone }) => {
  if (!zone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="relative bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-b border-emerald-100">
          <DialogHeader className="relative p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    Detalles de la zona
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500">
                    Consulta la información completa del registro seleccionado.
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full text-slate-500 hover:bg-slate-100"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="bg-white px-7 pb-7 pt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ID
              </p>
              <p className="text-sm font-semibold text-slate-900">{zone.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estado
              </p>
              <StatusBadge statusId={zone.statusId} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nombre
            </p>
            <p className="text-sm text-slate-700">{zone.name}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Descripción
            </p>
            <p className="text-sm text-slate-700">
              {zone.description || "Sin descripción asignada."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AreaDetailsModal;
