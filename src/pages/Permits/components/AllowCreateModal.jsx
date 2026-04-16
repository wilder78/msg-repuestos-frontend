import React, { useState, useEffect } from "react";
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
import {
  Key,
  Loader2,
  CheckCircle2,
  Layout,
  FileText,
} from "lucide-react";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

const authFetch = (url, options = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const AllowCreateModal = ({ isOpen, onClose, onPermitCreated }) => {
  const [nombrePermiso, setNombrePermiso] = useState("");
  const [modulo, setModulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setNombrePermiso("");
      setModulo("");
      setDescripcion("");
      setErrors({});
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!nombrePermiso.trim()) newErrors.nombrePermiso = "El nombre del permiso es obligatorio";
    if (!modulo.trim()) newErrors.modulo = "El módulo es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const permitPayload = {
        nombrePermiso: nombrePermiso.trim(),
        modulo: modulo.trim(),
        descripcion: descripcion.trim(),
        idEstado: 1,
      };

      const res = await authFetch("http://localhost:8080/api/permissions", {
        method: "POST",
        body: JSON.stringify(permitPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear el permiso");

      setSaveSuccess(true);
      const nombreFinal = nombrePermiso.trim();

      setTimeout(() => {
        onClose();
        if (onPermitCreated) onPermitCreated(nombreFinal);
      }, 700);
    } catch (err) {
      setErrors({ submit: err.message });
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-2">
          <div className="flex items-center gap-3 text-blue-500">
            <Key className="h-6 w-6" />
            <DialogTitle className="text-[#0f172a] text-xl font-bold">
              Crear Nuevo Permiso
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Registra una nueva acción o acceso en el sistema
          </p>
        </DialogHeader>

        {/* ── Form ── */}
        <div className="px-7 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-blue-500" /> Nombre del Permiso <span className="text-blue-500">*</span>
              </label>
              <Input
                placeholder="Ej: Gestionar Usuarios"
                value={nombrePermiso}
                onChange={(e) => setNombrePermiso(e.target.value)}
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500 ${errors.nombrePermiso ? "border-red-400" : ""}`}
              />
              {errors.nombrePermiso && (
                <p className="text-[11px] text-red-500">{errors.nombrePermiso}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Layout className="h-3.5 w-3.5 text-blue-500" /> Módulo <span className="text-blue-500">*</span>
              </label>
              <Input
                placeholder="Ej: Administración"
                value={modulo}
                onChange={(e) => setModulo(e.target.value)}
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500 ${errors.modulo ? "border-red-400" : ""}`}
              />
              {errors.modulo && (
                <p className="text-[11px] text-red-500">{errors.modulo}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-blue-500" /> Descripción
            </label>
            <Textarea
              placeholder="Describe qué permite hacer este permiso..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="resize-none h-28 rounded-xl border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-6" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-7 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSaving || saveSuccess || !nombrePermiso.trim() || !modulo.trim()}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-500 shadow-none text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
            }`}
          >
            {saveSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Creado</>
            ) : isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              "Crear Permiso"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving || saveSuccess}
            className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllowCreateModal;

