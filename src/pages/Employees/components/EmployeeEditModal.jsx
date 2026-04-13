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
  User,
  IdCard,
  Phone,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const DOCUMENT_TYPES = [
  { value: "1", label: "Cédula de Ciudadanía" },
  { value: "2", label: "Cédula de Extranjería" },
  { value: "3", label: "Pasaporte" },
];

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
  onEmpleadoUpdated,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({
    idTipoDocumento: "1",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    cargo: "",
    disponibilidad: true,
    activo: true,
    idUsuario: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const buildInitialData = (emp) => ({
    idTipoDocumento:
      emp.idTipoDocumento?.toString() || emp.tipoDocumento?.toString() || "1",
    numeroDocumento: emp.numeroDocumento || emp.numero_documento || "",
    nombres: emp.nombres || emp.nombre || "",
    apellidos: emp.apellidos || emp.apellido || "",
    telefono: emp.telefono || "",
    cargo: emp.cargo || emp.rolOperativo || "",
    disponibilidad: emp.disponibilidad === true || emp.disponibilidad === 1,
    activo: emp.activo === true || emp.activo === 1 || emp.statusId !== 0,
    idUsuario: emp.idUsuario ? String(emp.idUsuario) : "",
  });

  useEffect(() => {
    if (!isOpen || !empleado) return;

    const initialData = buildInitialData(empleado);
    setOriginalData(initialData);
    setFormData(initialData);
    setErrors({});
    setSaveSuccess(false);
  }, [isOpen, empleado]);

  if (!empleado) return null;

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.nombres.trim())
      nextErrors.nombres = "El nombre es obligatorio.";
    if (!formData.apellidos.trim())
      nextErrors.apellidos = "El apellido es obligatorio.";
    if (!formData.numeroDocumento.trim())
      nextErrors.numeroDocumento = "El número de documento es obligatorio.";
    if (!formData.telefono.trim())
      nextErrors.telefono = "El teléfono es obligatorio.";
    if (!formData.cargo.trim())
      nextErrors.cargo = "El rol operativo es obligatorio.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasChanges()) {
      setErrors({
        submit: "No se han realizado cambios para actualizar.",
      });
      return;
    }

    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});

    const payload = {
      idTipoDocumento: Number(formData.idTipoDocumento),
      numeroDocumento: formData.numeroDocumento,
      nombre: formData.nombres,
      apellido: formData.apellidos,
      telefono: formData.telefono,
      rolOperativo: formData.cargo,
      idUsuario: formData.idUsuario ? Number(formData.idUsuario) : null,
      disponibilidad: Boolean(formData.disponibilidad),
      activo: Boolean(formData.activo),
    };

    try {
      const response = await authFetch(`${EMPLOYEE_ENDPOINT}/${empleado.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const serverText = await response.text();
        throw new Error(
          serverText || `Error al actualizar empleado (${response.status})`,
        );
      }

      await response.json();
      setSaveSuccess(true);

      const updatedEmpleado = {
        ...empleado,
        idTipoDocumento: payload.idTipoDocumento,
        numeroDocumento: payload.numeroDocumento,
        nombres: payload.nombre,
        apellidos: payload.apellido,
        telefono: payload.telefono,
        cargo: payload.rolOperativo,
        disponibilidad: payload.disponibilidad,
        activo: payload.activo,
      };

      if (onEmpleadoUpdated) {
        onEmpleadoUpdated(updatedEmpleado);
      }

      if (onSaveSuccess) {
        onSaveSuccess(`${payload.nombre} ${payload.apellido}`.trim());
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      setErrors({
        submit: error.message || "No se pudo actualizar el empleado.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Editar Empleado
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Modifica los datos registrados del empleado.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Tipo de Documento
              </Label>
              <Select
                value={formData.idTipoDocumento}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, idTipoDocumento: value }))
                }
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-slate-900 shadow-sm focus:border-emerald-400 focus:ring-emerald-400">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-950 shadow-lg">
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="bg-white text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Número de Documento
              </Label>
              <Input
                value={formData.numeroDocumento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numeroDocumento: e.target.value,
                  }))
                }
                className="border-gray-300"
                placeholder="10203050"
              />
              {errors.numeroDocumento && (
                <p className="text-xs text-red-500">{errors.numeroDocumento}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Nombre
              </Label>
              <Input
                value={formData.nombres}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nombres: e.target.value }))
                }
                className="border-gray-300"
                placeholder="Carlos Andres"
              />
              {errors.nombres && (
                <p className="text-xs text-red-500">{errors.nombres}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Apellido
              </Label>
              <Input
                value={formData.apellidos}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    apellidos: e.target.value,
                  }))
                }
                className="border-gray-300"
                placeholder="Gómez Zapata"
              />
              {errors.apellidos && (
                <p className="text-xs text-red-500">{errors.apellidos}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Teléfono
              </Label>
              <Input
                value={formData.telefono}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, telefono: e.target.value }))
                }
                className="border-gray-300"
                placeholder="3005228978"
              />
              {errors.telefono && (
                <p className="text-xs text-red-500">{errors.telefono}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-slate-700">
                Rol Operativo
              </Label>
              <Input
                value={formData.cargo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cargo: e.target.value }))
                }
                className="border-gray-300"
                placeholder="Vendedor"
              />
              {errors.cargo && (
                <p className="text-xs text-red-500">{errors.cargo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                ID de Usuario
              </Label>
              <Input
                value={formData.idUsuario || "Sin usuario"}
                disabled
                className="border-gray-200 bg-slate-100 text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Disponibilidad
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="disponibilidad"
                  type="checkbox"
                  checked={formData.disponibilidad}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      disponibilidad: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label
                  htmlFor="disponibilidad"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Disponible
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Activo
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="activo"
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      activo: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label
                  htmlFor="activo"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Activo
                </Label>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving || saveSuccess}
              className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || saveSuccess || !hasChanges()}
              className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } text-white disabled:bg-slate-300 disabled:cursor-not-allowed`}
            >
              {isSaving
                ? "Guardando..."
                : saveSuccess
                  ? "Guardado"
                  : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditModal;
