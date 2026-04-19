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

const RolDeleteModal = ({ isOpen, onClose, rol, onConfirm, loading, error }) => {
  if (!rol) return null;

  // El rol Master no puede ser eliminado (ID 1 o nombre exacto)
  const isMaster = rol.id === 1 || rol.nombre?.toLowerCase() === "master";
  const displayError = error || (isMaster ? "Este es el rol principal del sistema (Master) y no puede ser eliminado para garantizar el acceso administrativo." : null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
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
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {displayError ? "Rol Protegido" : "Confirmar eliminación"}
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-0.5">
                  {displayError ? "Restricción de seguridad" : "Esta acción es permanente y no se puede deshacer."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-5 space-y-4 bg-white">
          {displayError ? (
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  No se puede eliminar este registro
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
                <p className="text-sm text-slate-700 leading-normal">
                  ¿Seguro que deseas eliminar el rol
                  <span className="font-bold text-slate-900"> {rol.nombre}</span>?
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Al eliminarlo, se perderán las asignaciones y podría afectar a los usuarios asociados.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
            <div className={`h-10 w-10 rounded-full ${isMaster ? "bg-amber-100" : "bg-red-50"} flex items-center justify-center shrink-0 border border-white shadow-sm font-bold`}>
              <span className={`${isMaster ? "text-amber-600" : "text-red-500"} text-xs tracking-tighter`}>
                {rol.nombre?.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{rol.nombre}</p>
              <p className="text-xs text-slate-400 truncate tracking-tight">{rol.descripcion || "Sin descripción"}</p>
            </div>
            <span className="ml-auto shrink-0 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
              ID: #{rol.id?.toString().padStart(3, "0")}
            </span>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-slate-300 text-slate-600 bg-white hover:bg-slate-50 rounded-xl h-11 transition-all"
          >
            {displayError ? "Entendido" : "Cancelar"}
          </Button>
          {!displayError && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-11 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Eliminar Rol
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolDeleteModal;
