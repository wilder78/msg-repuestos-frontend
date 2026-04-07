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
  Eye,
  Lock,
  Users,
  Key,
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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
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
        <div className="divide-y divide-slate-100">
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
                  {perm.descripcion && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {perm.descripcion}
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
  const [errors, setErrors] = useState({});

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
    }
  }, [isOpen, fetchPermissions]);

  const handleTogglePerm = (permId) => {
    setSelectedPermIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId],
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre del rol es obligatorio";
    else if (nombre.trim().length < 3) newErrors.nombre = "Mínimo 3 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const rolRes = await authFetch("http://localhost:8080/api/roles", {
        method: "POST",
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          idEstado: 1,
          color: selectedColor.value,
        }),
      });

      if (!rolRes.ok) throw new Error("Error al crear el rol");
      const rolData = await rolRes.json();
      const nuevoRolId = rolData.data?.id || rolData.id || rolData.idRol;

      if (selectedPermIds.length > 0 && nuevoRolId) {
        await Promise.all(
          selectedPermIds.map((permId) =>
            authFetch("http://localhost:8080/api/role-permissions/", {
              method: "POST",
              body: JSON.stringify({ idRol: nuevoRolId, idPermiso: permId }),
            }),
          ),
        );
      }

      onRolCreated?.();
      onClose();
    } catch (err) {
      console.error("Error creando rol:", err);
      setErrors({ submit: "No se pudo crear el rol. Intenta nuevamente." });
    } finally {
      setIsSaving(false);
    }
  };

  const groupedPermissions = groupPermissionsByModule(allPermissions);
  const totalSelected = selectedPermIds.length;

  // Categorías de seguridad para mostrar
  const securityItems = [
    {
      icon: <Users className="h-4 w-4 text-emerald-600" />,
      text: "Permite registrar nuevos usuarios en el sistema y asignar sus credenciales básicas.",
    },
    {
      icon: <Key className="h-4 w-4 text-amber-600" />,
      text: "Permite modificar los usuarios existentes en el sistema y asignar sus credenciales básicas.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        {/* Header con fondo claro y acento verde */}
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
                  Define un nuevo rol con permisos específicos para el sistema
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body con fondo completamente claro */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-white">
          {/* Fila: Nombre + Color */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Nombre del Rol <span className="text-emerald-500">*</span>
              </label>
              <Input
                placeholder="Ej: Supervisor de Ventas"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white ${
                  errors.nombre ? "border-red-400" : ""
                }`}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500 mt-0.5">{errors.nombre}</p>
              )}
            </div>

            {/* Selector de color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-slate-500" /> Color
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 flex-wrap max-w-[160px]">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-6 w-6 rounded-full border-2 transition-all duration-200 ${color.value} ${
                        selectedColor.value === color.value
                          ? "border-slate-700 scale-110 shadow-md ring-2 ring-offset-2 ring-emerald-400"
                          : "border-white hover:scale-105"
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">
                  <div
                    className={`h-3 w-3 rounded-full ${selectedColor.value}`}
                  />
                  <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <Eye className="h-3 w-3 text-slate-400" /> Vista previa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Descripción
            </label>
            <Textarea
              placeholder="Describe qué puede hacer este rol en el sistema..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none h-20 bg-white"
            />
          </div>

          {/* Sección de Seguridad */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <label className="text-sm font-semibold text-slate-700">
                Seguridad
              </label>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                0/2
              </span>
            </div>
            <div className="space-y-2">
              {securityItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="p-1.5 rounded-lg bg-white shadow-sm">
                    {item.icon}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Permisos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Permisos del Rol
              </label>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                {totalSelected} seleccionado{totalSelected !== 1 ? "s" : ""}
              </span>
            </div>

            {loadingPerms ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin h-6 w-6 text-emerald-500" />
              </div>
            ) : allPermissions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50">
                No hay permisos disponibles
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <PermissionGroup
                    key={module}
                    moduleName={module}
                    permissions={perms}
                    selectedIds={selectedPermIds}
                    onToggle={handleTogglePerm}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error de submit */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer con fondo claro */}
        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-200 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !nombre.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 min-w-[140px] shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Rol"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolCreateModal;
