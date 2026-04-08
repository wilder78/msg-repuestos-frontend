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
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  ShieldCheck,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  CheckCircle2,
  X,
} from "lucide-react";

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

const groupPermissionsByModule = (permissions) => {
  if (!permissions) return {};
  return permissions.reduce((acc, perm) => {
    const nombre = perm.nombre || "";
    const module =
      perm.modulo ||
      perm.module ||
      (nombre.includes("_") ? nombre.split("_")[0] : "General");
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {});
};

const COLOR_OPTIONS = [
  { label: "Esmeralda", value: "bg-emerald-500", hex: "#10b981" },
  { label: "Azul", value: "bg-blue-500", hex: "#3b82f6" },
  { label: "Rojo", value: "bg-red-500", hex: "#ef4444" },
  { label: "Ámbar", value: "bg-amber-500", hex: "#f59e0b" },
  { label: "Violeta", value: "bg-violet-500", hex: "#8b5cf6" },
  { label: "Rosa", value: "bg-rose-500", hex: "#f43f5e" },
  { label: "Cian", value: "bg-cyan-500", hex: "#06b6d4" },
  { label: "Slate", value: "bg-slate-400", hex: "#94a3b8" },
];

// --- Toast de notificación ---
const SuccessToast = ({ message, subMessage, onClose, visible }) => (
  <div
    style={{
      position: "fixed",
      top: "1.5rem",
      right: "1.5rem",
      zIndex: 9999,
      transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: visible
        ? "translateY(0) scale(1)"
        : "translateY(-20px) scale(0.95)",
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
    }}
  >
    <div className="flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl shadow-xl px-5 py-4 min-w-[320px] max-w-sm">
      <div className="p-2 bg-emerald-50 rounded-xl shrink-0">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm">{message}</p>
        {subMessage && (
          <p className="text-xs text-slate-500 mt-0.5">{subMessage}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    {/* Barra de progreso */}
    <div className="h-1 bg-emerald-100 rounded-b-2xl overflow-hidden -mt-1 mx-1">
      <div
        className="h-full bg-emerald-500 rounded-full"
        style={{
          animation: visible ? "shrink 4s linear forwards" : "none",
        }}
      />
    </div>
    <style>{`
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `}</style>
  </div>
);

// --- Sub-componente PermissionGroup ---
const PermissionGroup = ({
  moduleName,
  permissions,
  selectedIds,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const selectedCount = permissions.filter((p) =>
    selectedIds.includes(p.idPermiso || p.id),
  ).length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-slate-700 capitalize text-sm">
              {moduleName}
            </span>
            <span className="ml-2 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              {selectedCount}/{permissions.length}
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-slate-100 bg-white">
          {permissions.map((perm) => {
            const permId = perm.idPermiso || perm.id;
            const isSelected = selectedIds.includes(permId);
            return (
              <div
                key={permId}
                onClick={() => onToggle(permId)}
                className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-slate-50 transition-colors duration-150"
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 bg-white hover:border-emerald-400"
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    {perm.nombre || perm.name}
                  </p>
                  {(perm.descripcion || perm.description) && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {perm.descripcion || perm.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Componente Principal ---
const RolCreateModal = ({ isOpen, onClose, onRolCreated }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedPermIds, setSelectedPermIds] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado del toast
  const [toast, setToast] = useState({ visible: false, rolName: "" });

  const showToast = (rolName) => {
    setToast({ visible: true, rolName });
    setTimeout(() => setToast({ visible: false, rolName: "" }), 4500);
  };

  const fetchPermissions = useCallback(async () => {
    setLoadingPerms(true);
    try {
      const res = await authFetch("http://localhost:8080/api/permissions");
      if (!res.ok) throw new Error("Error al obtener permisos");
      const data = await res.json();
      setAllPermissions(data.data || data.permissions || data || []);
    } catch (err) {
      console.error("Error cargando permisos:", err);
    } finally {
      setLoadingPerms(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
      setNombre("");
      setDescripcion("");
      setSelectedColor(COLOR_OPTIONS[0]);
      setSelectedPermIds([]);
      setErrors({});
      setSaveSuccess(false);
    }
  }, [isOpen, fetchPermissions]);

  const handleTogglePerm = (permId) => {
    setSelectedPermIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId],
    );
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setErrors({ nombre: "El nombre del rol es obligatorio" });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      // 1. Crear el Rol
      const rolPayload = {
        nombreRol: nombre.trim(),
        idEstado: "1",
      };

      const rolRes = await authFetch("http://localhost:8080/api/roles", {
        method: "POST",
        body: JSON.stringify(rolPayload),
      });

      const rolData = await rolRes.json();

      if (!rolRes.ok) {
        throw new Error(
          rolData.message || "Error al crear el rol en el servidor",
        );
      }

      // 2. Extraer ID del nuevo rol
      const nuevoRolId =
        rolData.idRol ||
        rolData.id ||
        (rolData.data && (rolData.data.idRol || rolData.data.id));

      if (!nuevoRolId) {
        throw new Error("Rol creado, pero no se recibió el ID.");
      }

      // 3. Asignar Permisos
      if (selectedPermIds.length > 0) {
        const assignPromises = selectedPermIds.map((permId) =>
          authFetch("http://localhost:8080/api/role-permissions/assign", {
            method: "POST",
            body: JSON.stringify({
              idRol: Number(nuevoRolId),
              idPermiso: Number(permId),
            }),
          }),
        );
        await Promise.all(assignPromises);
      }

      // 4. Mostrar estado de éxito en el botón brevemente
      setSaveSuccess(true);

      // 5. Refrescar registros en el componente padre
      if (onRolCreated) {
        await onRolCreated();
      }

      // 6. Cerrar modal con pequeño delay para que el usuario vea el check
      setTimeout(() => {
        onClose();
        // 7. Mostrar toast DESPUÉS de que el modal cierre
        setTimeout(() => {
          showToast(nombre.trim());
        }, 150);
      }, 700);
    } catch (err) {
      console.error("Error en el proceso de creación:", err);
      setErrors({ submit: err.message });
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const groupedPermissions = groupPermissionsByModule(allPermissions);
  const totalSelected = selectedPermIds.length;

  return (
    <>
      {/* Toast de éxito — se renderiza fuera del modal */}
      <SuccessToast
        visible={toast.visible}
        message="Rol registrado exitosamente"
        subMessage={`"${toast.rolName}" ha sido creado y ya está disponible en el sistema.`}
        onClose={() => setToast({ visible: false, rolName: "" })}
      />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-b border-emerald-100">
            <DialogHeader className="relative p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    Crear Nuevo Rol
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Define un nuevo rol con permisos específicos
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Nombre del Rol <span className="text-emerald-500">*</span>
                </label>
                <Input
                  placeholder="Ej: Supervisor"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`border-slate-200 focus:border-emerald-400 ${
                    errors.nombre ? "border-red-400" : ""
                  }`}
                />
                {errors.nombre && (
                  <p className="text-xs text-red-500">{errors.nombre}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Palette className="h-3.5 w-3.5" /> Color
                </label>
                <div className="flex gap-1.5 flex-wrap max-w-[160px]">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-6 w-6 rounded-full border-2 transition-all ${color.value} ${
                        selectedColor.value === color.value
                          ? "ring-2 ring-emerald-400 border-white scale-110"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Descripción
              </label>
              <Textarea
                placeholder="Descripción del rol..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="resize-none h-20"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Permisos
                </label>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                  {totalSelected} seleccionados
                </span>
              </div>

              {loadingPerms ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-emerald-500" />
                </div>
              ) : (
                Object.entries(groupedPermissions).map(([module, perms]) => (
                  <PermissionGroup
                    key={module}
                    moduleName={module}
                    permissions={perms}
                    selectedIds={selectedPermIds}
                    onToggle={handleTogglePerm}
                  />
                ))
              )}
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 bg-slate-50 border-t gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving || saveSuccess}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || saveSuccess || !nombre.trim()}
              className={`min-w-[140px] transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Rol creado
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...
                </>
              ) : (
                "Crear Rol"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RolCreateModal;
