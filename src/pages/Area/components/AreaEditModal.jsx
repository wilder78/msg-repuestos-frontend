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
      <DialogContent
        className="sm:max-w-[500px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl bg-white"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Editar Zona
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-0.5">
                  Modifica los datos del registro seleccionado.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          className="px-6 py-5 space-y-5 bg-white max-h-[65vh] overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Nombre de zona
            </Label>
            <Input
              name="nombreZona"
              value={formData.nombreZona}
              onChange={onInputChange}
              placeholder="Nombre de la zona"
              className="h-[44px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Descripción
            </Label>
            <Textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onInputChange}
              placeholder="Describe la zona"
              className="min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || saveSuccess}
              className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || saveSuccess}
              className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } text-white`}
            >
              {saveSuccess
                ? "Guardado"
                : loading
                  ? "Guardando..."
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaEditModal;
