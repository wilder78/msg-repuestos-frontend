import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { SupplierForm } from "./SupplierForm";

export default function SupplierCreateModal({
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
      onSaveSuccess(formData.nombre_empresa);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[650px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100">
          <DialogHeader className="px-7 pt-6 pb-4">
            <div className="flex items-center gap-2.5 text-emerald-500">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <DialogTitle className="text-[#0f172a] text-lg font-bold">
                Registrar Nuevo Proveedor
              </DialogTitle>
            </div>
            <p className="text-sm text-slate-500 mt-1 ml-10">
              Completa el formulario para dar de alta un nuevo proveedor comercial
            </p>
          </DialogHeader>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="px-7 py-6 max-h-[65vh] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-slate-200">
          <SupplierForm
            formData={formData}
            onChange={onInputChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-6" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.nombre_empresa?.trim()}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] border-0`}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</>
            ) : (
              "Registrar Proveedor"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
