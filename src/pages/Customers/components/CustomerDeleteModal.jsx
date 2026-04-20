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
import { Trash2, AlertTriangle, Building2, Loader2 } from "lucide-react";

/**
 * Componente para confirmar la eliminación de un cliente.
 */
const CustomerDeleteModal = ({
  isOpen,
  onClose,
  cliente,
  onConfirm,
  loading,
}) => {
  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* Header con gradiente de advertencia suave */}
        <div className="bg-white px-6 pt-7 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-100/80 rounded-2xl">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Confirmar Eliminación
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-0.5">
                  Esta acción es permanente y no se puede deshacer.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo del Modal */}
        <div className="px-6 pb-6 space-y-5 bg-white">
          {/* Alerta Visual */}
          <div className="flex items-start gap-4 p-4 bg-red-50/50 border border-red-100 rounded-2xl">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                ¿Estás seguro de que deseas eliminar a{" "}
                <span className="font-bold text-red-700">
                  {cliente.razonSocial}
                </span>
                ?
              </p>
              <p className="text-xs text-slate-500 italic">
                Se eliminarán todos los registros asociados a este cliente en la base de datos.
              </p>
            </div>
          </div>

          {/* Tarjeta de Resumen del Cliente a Eliminar */}
          <div className="flex items-center gap-4 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl transition-all">
            <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 break-words leading-tight">
                {cliente.razonSocial}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider break-words">
                {cliente.tipoDocumento?.sigla || "NIT"}: {cliente.numeroDocumento}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-400 font-bold shadow-sm">
                ID: #{cliente.idCliente?.toString().padStart(4, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones del Footer */}
        <DialogFooter className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-[0_4px_14px_rgba(220,38,38,0.25)] flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Procesando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Eliminar Definitivamente</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDeleteModal;
