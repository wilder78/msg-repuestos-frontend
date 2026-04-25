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

const RouteDeleteModal = ({
  isOpen,
  onClose,
  route,
  onConfirm,
  loading,
  error
}) => {
  if (!route) return null;

  const displayError = error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 text-left">
              <div className={`p-2.5 ${displayError ? "bg-amber-100" : "bg-red-100"} rounded-xl text-center shrink-0`}>
                {displayError ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : (
                  <Trash2 className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {displayError ? "Acción Restringida" : "Confirmar Eliminación"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  {displayError ? "Integridad de Datos" : "Esta acción no se puede deshacer"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {displayError ? (
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  No se permite eliminar esta ruta
                </p>
                <p className="text-[12px] text-amber-700 mt-2 leading-relaxed">
                  {displayError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  ¿Estás seguro de que deseas eliminar la ruta{" "}
                  <span className="font-bold text-gray-900">
                    {route.nombreRuta}
                  </span>?
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  El registro será borrado permanentemente. Si la ruta ya tiene visitas ejecutadas, la operación podría fallar.
                </p>
              </div>
            </div>
          )}

          {/* Mini Card de Ruta */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <div className={`h-10 w-10 rounded-full ${displayError ? "bg-amber-100" : "bg-red-100"} flex items-center justify-center shrink-0 border border-white shadow-sm font-bold`}>
              <span className={`${displayError ? "text-amber-600" : "text-red-600"} text-xs`}>
                {route.nombreRuta?.substring(0, 2).toUpperCase() || "RT"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 break-words leading-tight">
                {route.nombreRuta}
              </p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed break-words">
                Zona: {route.zona?.nombreZona || "No definida"}
              </p>
            </div>
            <div className="shrink-0 ml-3">
              <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap">
                ID: {route.idRuta}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-11"
          >
            {displayError ? "Entendido" : "Cancelar"}
          </Button>
          
          {!displayError && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Eliminar Ruta
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDeleteModal;
