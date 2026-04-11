import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { MapPin } from "lucide-react";

const AreaCreateModal = ({ isOpen, onClose, onCreateArea, onSaveSuccess, isSaving }) => {
  const [form, setForm] = useState({
    nombreZona: "",
    descripcion: "",
  });
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ nombreZona: "", descripcion: "" });
      setError("");
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!form.nombreZona.trim() || !form.descripcion.trim()) {
    setError("Todos los campos son obligatorios.");
    return;
  }

  // Payload limpio — ajusta los keys según lo que espera tu API
  const payload = {
    nombre_zona: form.nombreZona.trim(),
    descripcion: form.descripcion.trim(),
    activo: 1,
  };
  console.log("Enviar payload de zona", payload);

  try {
    const result = await onCreateArea(payload);
    console.debug("Resultado de creación de zona", result);

    if (result === true || result?.success) {
      setSaveSuccess(true);
      const zoneName = form.nombreZona.trim();
      setTimeout(() => {
        onClose();
        if (onSaveSuccess) onSaveSuccess(zoneName);
        setSaveSuccess(false);
      }, 700);
    } else {
      // Maneja tanto string como objeto de error
      const msg =
        typeof result === "string"
          ? result
          : result?.message || result?.error || "No se pudo crear la zona.";
      setError(msg);
    }
  } catch (err) {
    console.error("Error inesperado creando zona:", err);
    setError("Error inesperado. Intenta de nuevo.");
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="relative bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-b border-emerald-100">
          <DialogHeader className="relative p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  Crear nueva zona
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Completa los datos para registrar una nueva área en el sistema.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-5 bg-white">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Nombre de zona</Label>
              <Input
                value={form.nombreZona}
                onChange={(event) => handleChange("nombreZona", event.target.value)}
                placeholder="Zona sur Colombia"
                className="h-[44px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Descripción</Label>
              <Textarea
                value={form.descripcion}
                onChange={(event) => handleChange("descripcion", event.target.value)}
                placeholder="Empresas y bodegas ubicadas en el sector sur"
                className="min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || saveSuccess}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saveSuccess ? "Guardado" : isSaving ? "Guardando..." : "Guardar área"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaCreateModal;
