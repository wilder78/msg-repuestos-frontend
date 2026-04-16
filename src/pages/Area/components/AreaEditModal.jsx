import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Edit2, ShieldCheck, Palette } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";

const AreaEditModal = ({
  isOpen,
  onClose,
  zone,
  formData,
  onInputChange,
  onSubmit,
  onSaveSuccess,
  loading,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleModalClose = () => {
    setSaveSuccess(false);
    onClose();
  };

  if (!zone) return null;

  const handleSave = async () => {
    const result = await onSubmit();
    if (result === true) {
      setSaveSuccess(true);
      const updatedName = formData.nombreZona;
      setTimeout(() => {
        onClose();
        if (onSaveSuccess) {
          onSaveSuccess(updatedName);
        }
        setSaveSuccess(false);
      }, 700);
    }
  };

  // Helper para cambiar el estado en el formData (que vive en el padre)
  const toggleInternalStatus = () => {
    const nextStatus = formData.activo === 1 ? 0 : 1;
    onInputChange({
      target: {
        name: "activo",
        value: nextStatus,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent 
        className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-6 pb-0">
          <div className="flex items-center gap-2.5 text-emerald-500">
            <Edit2 className="h-5 w-5" />
            <DialogTitle className="text-[#0f172a] text-lg font-bold">
              Editar Zona
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modifica la información comercial de la zona seleccionada
          </p>
        </DialogHeader>

        {/* ── Form Content ── */}
        <form
          className="px-7 py-6 space-y-6 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Nombre de la Zona <span className="text-emerald-500">*</span>
              </Label>
              <Input
                name="nombreZona"
                value={formData.nombreZona}
                onChange={onInputChange}
                placeholder="Ej: Zona Norte"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-slate-400" /> Estado Actual
              </Label>
              <StatusBadge 
                statusId={formData.activo} 
                onClick={toggleInternalStatus}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Descripción
            </Label>
            <Textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onInputChange}
              placeholder="Describe las áreas de cobertura de esta zona..."
              className="min-h-[100px] resize-none rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm"
            />
          </div>

          <div className="h-px bg-slate-100 mt-4" />

          {/* ── Footer ── */}
          <DialogFooter className="pt-2 flex gap-3 sm:gap-3">
            <Button
              type="submit"
              disabled={loading || saveSuccess}
              className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 shadow-none text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
              }`}
            >
              {saveSuccess ? (
                "Cambios Guardados"
              ) : loading ? (
                "Guardando..."
              ) : (
                "Guardar Cambios"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || saveSuccess}
              className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaEditModal;
