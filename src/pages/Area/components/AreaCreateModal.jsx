import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";

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

  // Payload para la API (usando snake_case para compatibilidad con el backend)
  const payload = {
    nombre_zona: form.nombreZona.trim(),
    descripcion: form.descripcion.trim(),
    id_estado: 1,
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
      <DialogContent
        className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-6 pb-0">
          <div className="flex items-center gap-2.5 text-[#10b981]">
            <MapPin className="h-5 w-5" />
            <DialogTitle className="text-[#0f172a] text-lg font-bold">
              Crear Nueva Zona
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Completa los datos para registrar una nueva área en el sistema.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 bg-white">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Nombre de zona <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                value={form.nombreZona}
                onChange={(event) => handleChange("nombreZona", event.target.value)}
                placeholder="Ej: Zona Sur Colombia"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Descripción <span className="text-[#10b981]">*</span>
              </Label>
              <Textarea
                value={form.descripcion}
                onChange={(event) => handleChange("descripcion", event.target.value)}
                placeholder="Empresas y bodegas ubicadas en el sector sur"
                className="min-h-[100px] rounded-xl border-slate-200 focus-visible:ring-[#10b981] resize-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}

          <div className="h-px bg-slate-100 my-5" />

          {/* ── Footer ── */}
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              type="submit"
              disabled={isSaving || saveSuccess || !form.nombreZona.trim() || !form.descripcion.trim()}
              className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 shadow-none"
                  : (isSaving || !form.nombreZona.trim() || !form.descripcion.trim())
                    ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none hover:bg-slate-300"
                    : "bg-[#10b981] hover:bg-[#0da673] shadow-[0_4px_14px_rgba(16,185,129,0.3)] text-white"
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Creado
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Área"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving || saveSuccess}
              className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaCreateModal;
