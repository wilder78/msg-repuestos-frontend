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
import { Edit2, X } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white">
        <div className="bg-white border-b border-slate-100 px-6 py-5">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500 rounded-xl">
                  <Edit2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Editar Zona
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 mt-1">
                    Modifica los datos del registro seleccionado.
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full text-slate-500 hover:bg-slate-100"
                onClick={handleModalClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <form className="space-y-5 px-7 py-6 bg-white" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Nombre de zona</Label>
            <Input
              name="nombreZona"
              value={formData.nombreZona}
              onChange={onInputChange}
              placeholder="Nombre de la zona"
              className="h-[44px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Descripción</Label>
            <Textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onInputChange}
              placeholder="Describe la zona"
              className="min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading || saveSuccess}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || saveSuccess}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saveSuccess ? "Guardado" : loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaEditModal;
