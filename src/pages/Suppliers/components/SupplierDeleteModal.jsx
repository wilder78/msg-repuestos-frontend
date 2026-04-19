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
import { Trash2, AlertTriangle, Building2 } from "lucide-react";

const SupplierDeleteModal = ({ isOpen, onClose, proveedor, onConfirm, loading, error }) => {
  if (!proveedor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Confirmar eliminación
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-0.5">
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-5 space-y-4 bg-white">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-700">
                ¿Seguro que deseas eliminar al proveedor
                <span className="font-bold text-slate-900"> {proveedor.nombre}</span>?
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Al eliminar este registro, se perderá la información de contacto y fiscal. Solo podrás realizar esta acción si el proveedor no tiene transacciones asociadas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-red-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 break-words leading-tight">
                {proveedor.nombre}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-bold break-words uppercase tracking-tighter">
                NIT: {proveedor.nit || "N/A"}
              </p>
            </div>
            <div className="shrink-0 ml-3">
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase whitespace-nowrap">
                ID: #{proveedor.id?.toString().padStart(3, "0")}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] rounded-xl text-center font-medium animate-pulse">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-slate-300 text-slate-600 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm shadow-red-100 rounded-xl transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Eliminando...
              </div>
            ) : (
              <div className="flex items-center gap-2 uppercase text-[11px] tracking-widest">
                <Trash2 className="h-4 w-4" />
                Eliminar Registro
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDeleteModal;
