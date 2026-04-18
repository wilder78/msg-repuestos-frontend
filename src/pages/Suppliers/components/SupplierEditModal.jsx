import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Loader2, CheckCircle2, Edit2 } from "lucide-react";
import { SupplierForm } from "./SupplierForm";

// --- Helpers ---
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

const SupplierEditModal = ({
  isOpen,
  onClose,
  proveedor,
  onSupplierUpdated,
}) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const initState = useCallback(() => {
    if (proveedor) {
      setFormData({
        id_tipo_documento: proveedor.id_tipo_documento || 2,
        numero_documento: proveedor.nit || "",
        nombre_empresa: proveedor.nombre || "",
        contacto: proveedor.contactoNombre || "",
        telefono: proveedor.telefono || "",
        email: proveedor.email || "",
        direccion: proveedor.direccion || "",
        condiciones_comerciales: proveedor.condiciones || "",
        id_estado: proveedor.statusId || 1,
      });
      setErrors({});
      setSaveSuccess(false);
    }
  }, [proveedor]);

  useEffect(() => {
    if (isOpen) {
      initState();
    }
  }, [isOpen, initState]);

  const handleInputChange = (newFormData) => {
    setFormData(newFormData);
  };

  const hasChanges = () => {
    if (!proveedor) return false;
    
    const initialData = {
      id_tipo_documento: proveedor.id_tipo_documento || 2,
      numero_documento: proveedor.nit || "",
      nombre_empresa: proveedor.nombre || "",
      contacto: proveedor.contactoNombre || "",
      telefono: proveedor.telefono || "",
      email: proveedor.email || "",
      direccion: proveedor.direccion || "",
      condiciones_comerciales: proveedor.condiciones || "",
      id_estado: proveedor.statusId || 1,
    };

    return JSON.stringify(initialData) !== JSON.stringify(formData);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.nombre_empresa?.trim()) {
      setErrors({ nombre: "El nombre de la empresa es obligatorio" });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await authFetch(`http://localhost:8080/api/suppliers/${proveedor.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al actualizar el proveedor");

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSupplierUpdated) onSupplierUpdated(formData.nombre_empresa);
      }, 700);
    } catch (err) {
      setErrors({ submit: err.message || "No se pudo actualizar el proveedor" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!proveedor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[650px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header Premium ── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Proveedor
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Actualiza la información comercial del registro seleccionado
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="px-7 py-6 space-y-6 max-h-[65vh] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-slate-200">
          <SupplierForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isEditing={true}
            loading={isSaving}
          />

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] rounded-xl text-center">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-6" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSaving || saveSuccess || !formData.nombre_empresa?.trim() || !hasChanges()}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-500 shadow-none text-white border-0"
                : (!formData.nombre_empresa?.trim() || !hasChanges())
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border-0"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] border-0"
            }`}
          >
            {saveSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Cambios Guardados</>
            ) : isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...</>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving || saveSuccess}
            className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierEditModal;
