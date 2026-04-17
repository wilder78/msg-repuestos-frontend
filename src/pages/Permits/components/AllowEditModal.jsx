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
  Edit2,
  Loader2,
  CheckCircle2,
  Layout,
  FileText,
  Key,
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

const AllowEditModal = ({ isOpen, onClose, permiso, onPermitUpdated }) => {
  const [nombrePermiso, setNombrePermiso] = useState("");
  const [modulo, setModulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && permiso) {
      setNombrePermiso(permiso.nombrePermiso || "");
      setModulo(permiso.modulo || "");
      setDescripcion(permiso.descripcion || permiso.description || "");
      setErrors({});
      setSaveSuccess(false);
    }
  }, [isOpen, permiso]);

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
        idEstado: permiso.idEstado || 1,
      };

      const id = permiso.idPermiso || permiso.id;
      const res = await authFetch(`http://localhost:8080/api/permissions/${id}`, {
        method: "PUT",
        body: JSON.stringify(permitPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar el permiso");

      setSaveSuccess(true);
      const nombreFinal = nombrePermiso.trim();

      setTimeout(() => {
        onClose();
        if (onPermitUpdated) onPermitUpdated(nombreFinal);
      }, 700);
    } catch (err) {
      setErrors({ submit: err.message });
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    permiso &&
    (nombrePermiso.trim() !== (permiso.nombrePermiso || "") ||
     modulo.trim() !== (permiso.modulo || "") ||
     descripcion.trim() !== (permiso.descripcion || permiso.description || ""));

  if (!permiso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header Estilo Premium ── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Permiso del Sistema
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Modifica los detalles técnicos y descriptivos del permiso
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Form ── */}
        <div className="px-7 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-emerald-500" /> Nombre del Permiso <span className="text-emerald-500">*</span>
              </label>
              <Input
                placeholder="Ej: Gestionar Usuarios"
                value={nombrePermiso}
                onChange={(e) => setNombrePermiso(e.target.value)}
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.nombrePermiso ? "border-red-400" : ""}`}
              />
              {errors.nombrePermiso && (
                <p className="text-[11px] text-red-500">{errors.nombrePermiso}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Layout className="h-3.5 w-3.5 text-emerald-500" /> Módulo <span className="text-emerald-500">*</span>
              </label>
              <Input
                placeholder="Ej: Administración"
                value={modulo}
                onChange={(e) => setModulo(e.target.value)}
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.modulo ? "border-red-400" : ""}`}
              />
              {errors.modulo && (
                <p className="text-[11px] text-red-500">{errors.modulo}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-emerald-500" /> Descripción
            </label>
            <Textarea
              placeholder="Describe qué permite hacer este permiso..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="resize-none h-28 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
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
            disabled={isSaving || saveSuccess || !hasChanges || !nombrePermiso.trim() || !modulo.trim()}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-600 shadow-none text-white"
                : !hasChanges
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
            }`}
          >
            {saveSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Guardado</>
            ) : isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              "Guardar Cambios"
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

export default AllowEditModal;
