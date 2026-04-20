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
import { Trash2, AlertTriangle, Tag } from "lucide-react";

const CategoryDeleteModal = ({ isOpen, onClose, categoria, onConfirm, loading, error }) => {
  if (!categoria) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] sm:max-w-[500px] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 bg-red-100 rounded-xl shrink-0">
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
            <div className="overflow-hidden">
              <p className="text-sm text-slate-700 leading-relaxed">
                ¿Seguro que deseas eliminar la categoría 
                <span className="font-bold text-slate-900 break-words ml-1">
                  "{categoria.nombre}"
                </span>?
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Al eliminar esta categoría, los productos asociados podrían quedar sin clasificación. Solo puedes eliminar categorías que no tengan productos vinculados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 break-words leading-tight">
                {categoria.nombre}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed break-words">
                {categoria.descripcion || "Sin descripción"}
              </p>
            </div>
            <div className="shrink-0 ml-3">
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap">
                ID: #{categoria.id?.toString().padStart(3, "0")}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] rounded-xl text-center font-medium">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-slate-300 text-slate-600 bg-white hover:bg-slate-50 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Eliminando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Eliminar Categoría
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDeleteModal;
