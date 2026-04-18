import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { ClipboardList, Loader2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { CategoryForm } from "./CategoryForm";

export default function CategoryCreateModal({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit,
  loading,
  onSaveSuccess,
}) {
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onSaveSuccess(formData.nombre_categoria);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100">
          <DialogHeader className="px-7 pt-6 pb-5">
            <div className="flex items-center gap-3 text-emerald-500">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <ClipboardList className="h-5 w-5" />
              </div>
              <DialogTitle className="text-[#0f172a] text-xl font-bold">
                Nueva Categoría
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 text-sm mt-1 ml-11">
              Registra una nueva clasificación para organizar los productos del inventario
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ── Content ── */}
        <div className="px-7 py-8 bg-white">
          <CategoryForm
            formData={formData}
            onChange={onInputChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-6" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-7 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.nombre_categoria?.trim()}
            className={`flex-1 h-[48px] rounded-xl font-bold transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] border-0`}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Registrar Categoría</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
