import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  UserCog,
  Contact,
  Phone,
  Briefcase,
  FileText,
  CheckCircle2,
  Loader2,
  User as UserIcon,
} from "lucide-react";

const EmployeeCreateModal = ({
  isOpen,
  onClose,
  formData,
  roles = [],
  availableUsers = [],
  usedUserIds = [],       // ← NUEVA PROP: IDs ya ocupados por otro empleado o cliente
  onInputChange,
  onSelectChange,
  onSubmit,
  loading,
  onSaveSuccess,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // ── Filtrado de usuarios disponibles ──────────────────────────────────────
  // Normaliza usedUserIds a strings para comparación uniforme.
  const usedSet = new Set(usedUserIds.map((id) => String(id)));

  const filteredUsers = availableUsers.filter((user) => {
    const userId = String(user.idUsuario ?? user.id);

    // Si este usuario ya es el seleccionado actualmente en el formulario,
    // lo mantenemos visible (edición sin perder la selección actual).
    const currentSelected =
      formData.idUsuario !== null && formData.idUsuario !== undefined
        ? String(formData.idUsuario)
        : null;

    if (currentSelected && userId === currentSelected) return true;

    // Excluir usuarios ya asignados a otro empleado o cliente
    return !usedSet.has(userId);
  });
  // ─────────────────────────────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await onSubmit();
    if (result === true) {
      setSaveSuccess(true);
      const registeredName = formData.nombre;

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          if (onSaveSuccess) {
            onSaveSuccess(registeredName);
          }
          setSaveSuccess(false);
        }, 300);
      }, 800);
    }
  };

  const isFormValid =
    formData.idTipoDocumento &&
    formData.numeroDocumento?.trim() !== "" &&
    formData.nombre?.trim() !== "" &&
    formData.apellido?.trim() !== "" &&
    formData.telefono?.trim() !== "" &&
    formData.rolOperativo?.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl bg-white"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        <DialogHeader className="px-7 pt-6 pb-0">
          <div className="flex items-center gap-2.5 text-[#10b981]">
            <UserCog className="h-5 w-5" />
            <DialogTitle className="text-[#0f172a] text-lg font-bold">
              Registrar Nuevo Empleado
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Completa la información básica para dar de alta al personal en el sistema.
          </p>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col">
          <div className="px-7 py-6 grid grid-cols-2 gap-x-5 gap-y-4">

            {/* ── SECCIÓN: IDENTIFICACIÓN ── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Contact className="h-3.5 w-3.5 text-slate-400" />
                Tipo Documento <span className="text-[#10b981]">*</span>
              </Label>
              <Select
                value={formData.idTipoDocumento?.toString()}
                onValueChange={(val) => onSelectChange("idTipoDocumento", val)}
              >
                <SelectTrigger
                  className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                >
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
                  <SelectItem value="1">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="2">Cédula de Extranjería</SelectItem>
                  <SelectItem value="3">NIT</SelectItem>
                  <SelectItem value="4">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Número de Documento <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={onInputChange}
                placeholder="Ej: 1020304050"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            {/* ── SECCIÓN: DATOS PERSONALES ── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                Nombres <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                placeholder="Juan Pérez"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Apellidos <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="apellido"
                value={formData.apellido}
                onChange={onInputChange}
                placeholder="García López"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            {/* ── SECCIÓN: CONTACTO Y CARGO ── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Teléfono <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={onInputChange}
                placeholder="Ej: 3205697845"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                Rol Operativo <span className="text-[#10b981]">*</span>
              </Label>
              <Select
                value={formData.rolOperativo}
                onValueChange={(val) => onSelectChange("rolOperativo", val)}
              >
                <SelectTrigger
                  className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                >
                  <SelectValue placeholder="Seleccionar cargo" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
                  {roles.map((rol) => (
                    <SelectItem key={rol.idRol} value={rol.nombreRol}>
                      {rol.nombreRol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── SECCIÓN: USUARIO (OPCIONAL) ── */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                Vincular Cuenta de Usuario (Opcional)
              </Label>
              <Select
                value={
                  formData.idUsuario === null || formData.idUsuario === undefined
                    ? "null"
                    : formData.idUsuario.toString()
                }
                onValueChange={(val) => {
                  onSelectChange("idUsuario", val === "null" ? null : val);
                }}
              >
                <SelectTrigger
                  className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                >
                  <SelectValue placeholder="Ninguno / Sin cuenta" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[250px] overflow-y-auto border-slate-100 shadow-xl"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                >
                  <SelectItem
                    value="null"
                    className="font-semibold text-slate-500 italic"
                  >
                    Ninguno / Sin cuenta
                  </SelectItem>

                  {/* Solo usuarios que NO están asignados a otro empleado o cliente */}
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <SelectItem
                        key={user.idUsuario || user.id}
                        value={(user.idUsuario || user.id).toString()}
                      >
                        {user.nombreUsuario} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-400 italic">
                      No hay usuarios disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-400">
                Solo se muestran usuarios sin empleado ni cliente asignado.
              </p>
            </div>
          </div>

          <div className="mx-7 h-px bg-slate-100 mb-5" />

          <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
            <Button
              type="submit"
              disabled={loading || saveSuccess || !isFormValid}
              className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 shadow-none text-white"
                  : !isFormValid
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-[#10b981] hover:bg-[#0da673] text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Registrado
                </>
              ) : loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                </>
              ) : (
                "Guardar Empleado"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || saveSuccess}
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

export default EmployeeCreateModal;
