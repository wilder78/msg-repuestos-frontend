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
import { CategoryForm } from "./CategoryForm";

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

const CategoryEditModal = ({
  isOpen,
  onClose,
  categoria,
  onCategoryUpdated,
}) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const initState = useCallback(() => {
    if (categoria) {
      setFormData({
        nombre_categoria: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        id_estado: categoria.statusId || 1,
      });
      setErrors({});
      setSaveSuccess(false);
    }
  }, [categoria]);

  useEffect(() => {
    if (isOpen) {
      initState();
    }
  }, [isOpen, initState]);

  const handleInputChange = (newFormData) => {
    setFormData(newFormData);
  };

  const hasChanges = () => {
    if (!categoria) return false;
    
    const initialData = {
      nombre_categoria: categoria.nombre || "",
      descripcion: categoria.descripcion || "",
      id_estado: categoria.statusId || 1,
    };

    return JSON.stringify(initialData) !== JSON.stringify(formData);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.nombre_categoria?.trim()) {
      setErrors({ nombre: "El nombre de la categoría es obligatorio" });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await authFetch(`http://localhost:8080/api/categories/${categoria.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al actualizar la categoría");

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
        if (onCategoryUpdated) onCategoryUpdated(formData.nombre_categoria);
      }, 700);
    } catch (err) {
      setErrors({ submit: err.message || "No se pudo actualizar la categoría" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!categoria) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header Premium ── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Categoría
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Actualiza el nombre o la descripción de la clasificación
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Content ── */}
        <div className="px-7 py-8 bg-white space-y-6">
          <CategoryForm
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
        <DialogFooter className="px-7 pb-7 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSaving || saveSuccess || !formData.nombre_categoria?.trim() || !hasChanges()}
            className={`flex-1 h-[48px] rounded-xl font-bold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-500 shadow-none text-white border-0"
                : (!formData.nombre_categoria?.trim() || !hasChanges())
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border-0"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] border-0"
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
            className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;
