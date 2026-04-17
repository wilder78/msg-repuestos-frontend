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
  FileText,
  CheckCircle2,
  Loader2,
  User as UserIcon,
  AlertCircle,
  Edit2, // ✅ NUEVA IMPORTACIÓN
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

const EMPLOYEE_ENDPOINT = "http://localhost:8080/api/employees";

const EmployeeEditModal = ({
  isOpen,
  onClose,
  empleado,
  roles = [],
  availableUsers = [],
  usedUserIds = [],
  onEmpleadoUpdated,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({
    idTipoDocumento: "1",
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rolOperativo: "",
    idUsuario: null,
    disponibilidad: true,
    idEstado: 1,
  });

  const [initialData, setInitialData] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isOpen && empleado) {
      const initialValues = {
        idTipoDocumento: (empleado.idTipoDocumento || 1).toString(),
        numeroDocumento: empleado.numeroDocumento || "",
        nombre: empleado.nombre || empleado.nombres || "",
        apellido: empleado.apellido || empleado.apellidos || "",
        telefono: empleado.telefono || "",
        rolOperativo: empleado.cargo || empleado.rolOperativo || "",
        idUsuario: empleado.idUsuario || null,
        disponibilidad: empleado.disponibilidad === true || empleado.disponibilidad === 1,
        idEstado: empleado.idEstado ?? empleado.statusId ?? 1,
      };
      setFormData(initialValues);
      setInitialData(initialValues);
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, empleado]);

  // ── Filtrado de usuarios disponibles ──────────────────────────────────────
  const usedSet = new Set((usedUserIds || []).map(String));

  const filteredUsers = availableUsers.filter((user) => {
    const userId = String(user.idUsuario ?? user.id);
    const currentSelected = formData.idUsuario !== null && formData.idUsuario !== undefined
      ? String(formData.idUsuario)
      : null;

    // Mantener el usuario actual o incluir si no está usado
    if (currentSelected && userId === currentSelected) return true;
    return !usedSet.has(userId);
  });
  // ──────────────────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setErrorMessage(null);
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "idUsuario" && value === null) {
        newState.rolOperativo = "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const empId = empleado.idEmpleado || empleado.id || empleado.id_empleado;
      if (!empId) throw new Error("ID de empleado no encontrado.");

      const payload = {
        idTipoDocumento: parseInt(formData.idTipoDocumento, 10),
        numeroDocumento: formData.numeroDocumento,
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        telefono: formData.telefono?.trim(),
        rolOperativo: formData.rolOperativo,
        idUsuario: formData.idUsuario ? parseInt(formData.idUsuario, 10) : null,
        disponibilidad: formData.disponibilidad,
        idEstado: parseInt(formData.idEstado, 10),
      };

      const response = await authFetch(`${EMPLOYEE_ENDPOINT}/${empId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = "Error al actualizar el empleado.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          errorMsg = (await response.text()) || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const responseData = await response.json();
      const empleadoActualizado = responseData.data || responseData;

      const updatedMapped = {
        ...empleado,
        idTipoDocumento: payload.idTipoDocumento,
        numeroDocumento: payload.numeroDocumento,
        nombre: payload.nombre,
        apellido: payload.apellido,
        telefono: payload.telefono,
        cargo: payload.rolOperativo,
        idUsuario: payload.idUsuario,
        disponibilidad: payload.disponibilidad,
        idEstado: payload.idEstado,
        ...empleadoActualizado,
      };

      setSaveSuccess(true);
      if (onEmpleadoUpdated) onEmpleadoUpdated(updatedMapped);
      if (onSaveSuccess) onSaveSuccess(payload.nombre);

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return Object.keys(formData).some(key => {
      // Comparación normalizada para idUsuario (evitar discrepancias null vs undefined vs empty string)
      if (key === 'idUsuario') {
        const currentId = formData.idUsuario ? String(formData.idUsuario) : null;
        const initialId = initialData.idUsuario ? String(initialData.idUsuario) : null;
        return currentId !== initialId;
      }
      return formData[key] !== initialData[key];
    });
  };

  const isFormValid =
    formData.nombre?.trim() !== "" &&
    formData.apellido?.trim() !== "" &&
    formData.telefono?.trim() !== "" &&
    (formData.idUsuario === null ? true : formData.rolOperativo?.trim() !== "");

  const canSave = isFormValid && hasChanges();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl bg-white"
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
                  Editar Datos del Empleado
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Actualiza la información básica o vincula una cuenta de usuario diferente
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-7 py-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Contact className="h-3.5 w-3.5 text-slate-400" />
                Tipo Documento
              </Label>
              <Select
                value={formData.idTipoDocumento}
                onValueChange={(val) => handleSelectChange("idTipoDocumento", val)}
                disabled
              >
                <SelectTrigger className="h-[42px] rounded-xl border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="2">Cédula de Extranjería</SelectItem>
                  <SelectItem value="3">NIT</SelectItem>
                  <SelectItem value="4">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Número de Documento
              </Label>
              <Input
                value={formData.numeroDocumento}
                readOnly
                disabled
                className="h-[42px] rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                Nombres <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Teléfono <span className="text-[#10b981]">*</span>
              </Label>
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                required
              />
            </div>

            {/* SECCIÓN USUARIO - REQUERIDA PARA ROL */}
            <div className="flex flex-col gap-1.5 col-span-2 pt-2 border-t border-slate-100 mt-2">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-[#10b981]" />
                Vincular Cuenta de Usuario
              </Label>
              <Select
                value={
                  formData.idUsuario === null || formData.idUsuario === undefined
                    ? "null"
                    : formData.idUsuario.toString()
                }
                onValueChange={(val) =>
                  handleSelectChange("idUsuario", val === "null" ? null : val)
                }
              >
                <SelectTrigger className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]">
                  <SelectValue placeholder="Ninguno / Sin cuenta" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] overflow-y-auto border-slate-100 shadow-xl">
                  <SelectItem value="null" className="font-semibold text-slate-500 italic">
                    Ninguno / Sin cuenta
                  </SelectItem>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const roleId = Number(user.idRol ?? user.id_rol ?? user.rol?.idRol ?? user.rol?.id_rol ?? 0);
                      const isClient = roleId === 4;
                      return (
                        <SelectItem
                          key={user.idUsuario || user.id}
                          value={(user.idUsuario || user.id).toString()}
                        >
                          {user.nombreUsuario} {!isClient && `(${user.email})`} - {user.nombreRol || "Sin rol"}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-400 italic">
                      No hay usuarios internos disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

              {/* ROL OPERATIVO - CONDICIONAL */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className={`text-xs font-semibold flex items-center gap-1.5 ${!formData.idUsuario ? "text-slate-400" : "text-slate-700"}`}>
                Rol Operativo {formData.idUsuario && <span className="text-[#10b981]">*</span>}
              </Label>
              <Select
                value={formData.rolOperativo}
                onValueChange={(val) => handleSelectChange("rolOperativo", val)}
                disabled={!formData.idUsuario}
              >
                <SelectTrigger className={`h-[42px] rounded-xl border-slate-200 ${!formData.idUsuario ? "bg-slate-50 opacity-60 cursor-not-allowed" : "focus-visible:ring-[#10b981]"}`}>
                  <SelectValue placeholder={!formData.idUsuario ? "Vincule un usuario primero" : "Seleccionar cargo"} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.idRol} value={rol.nombreRol}>
                      {rol.nombreRol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {errorMessage && (
              <div className="col-span-2 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="mx-7 h-px bg-slate-100 mb-5" />

          <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
            <Button
              type="submit"
              disabled={isSaving || saveSuccess || !canSave}
              className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 shadow-none text-white"
                  : !canSave
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#10b981] hover:bg-[#0da673] text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
              }`}
            >
              {saveSuccess ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Guardado</>
              ) : isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...</>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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

export default EmployeeEditModal;