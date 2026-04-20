import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Trash2, AlertTriangle, ShieldX } from "lucide-react";

const AreaDeleteModal = ({ isOpen, onClose, zone, onConfirm, loading, error }) => {
  if (!zone) return null;

  const displayError = error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff", width: "440px", maxWidth: "440px" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-3">
          <DialogHeader>
            <div className="flex items-start gap-4 text-left">
              <div className={`p-2.5 ${displayError ? "bg-amber-100" : "bg-red-100"} rounded-xl shrink-0 mt-0.5`}>
                {displayError ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : (
                  <Trash2 className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {displayError ? "Acción Restringida" : "Confirmar eliminación"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-sm mt-1 leading-snug">
                  {displayError
                    ? "Seguridad del Sistema"
                    : "Esta acción es permanente y no se puede deshacer."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo del Modal */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {displayError ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm text-amber-800 font-semibold">
                  No se permite eliminar esta zona
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed break-words">
                  {displayError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm text-gray-700 leading-snug break-words">
                  ¿Seguro que deseas eliminar la zona{" "}
                  <span className="font-bold text-gray-900">
                    {zone.name || zone.nombreZona}
                  </span>?
                </p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed break-words">
                  Al eliminarlo, se perderán los datos asociados y podría afectar a los registros relacionados.
                </p>
              </div>
            </div>
          )}

          {/* Mini Card de la Zona */}
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-gray-100">
              <span className="text-red-500 text-xs font-bold uppercase">
                {(zone.name || zone.nombreZona)?.substring(0, 2).toUpperCase() || "??"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 break-words leading-tight">
                {zone.name || zone.nombreZona}
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed break-words">
                {zone.description || "Sin descripción"}
              </p>
            </div>
            <div className="shrink-0 ml-3">
              <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                ID: #{zone.id || zone.idZona}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-white border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-11 text-sm font-medium"
          >
            {displayError ? "Entendido" : "Cancelar"}
          </Button>

          {!displayError && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl h-11 text-sm transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreaDeleteModal;
