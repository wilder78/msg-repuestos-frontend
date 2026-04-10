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
import { ShieldOff, AlertTriangle } from "lucide-react";

const RolDeleteModal = ({ isOpen, onClose, rol, onConfirm, loading }) => {
  if (!rol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[420px] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <ShieldOff className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Confirmar desactivación
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-0.5">
                  El rol se desactivará y no podrá usarse hasta que se reactive.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-5 space-y-4 bg-white">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-700">
                ¿Seguro que deseas desactivar el rol
                <span className="font-bold text-slate-900"> {rol.nombre}</span>?
              </p>
              <p className="text-xs text-slate-500 mt-1.5">
                Esto no elimina el registro, solo cambia su estado a inactivo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <span className="text-amber-600 text-sm font-bold">
                {rol.nombre
                  ?.trim()
                  .split(/\s+/)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{rol.nombre}</p>
              <p className="text-xs text-slate-400">{rol.descripcion || "Sin descripción"}</p>
            </div>
            <span className="ml-auto text-xs text-slate-400 font-medium">
              ID: #{rol.id?.toString().padStart(4, "0")}
            </span>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Desactivando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldOff className="h-4 w-4" />
                Desactivar Rol
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolDeleteModal;
