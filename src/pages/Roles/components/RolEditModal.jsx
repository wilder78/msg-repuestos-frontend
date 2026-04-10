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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Palette,
  X,
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

const groupPermissionsByModule = (permissions) => {
  if (!permissions) return {};
  return permissions.reduce((acc, perm) => {
    const nombre = perm.nombre || perm.name || "";
    const module =
      perm.modulo ||
      perm.module ||
      (nombre.includes("_") ? nombre.split("_")[0] : "General");
    const moduleName = module.charAt(0).toUpperCase() + module.slice(1);
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(perm);
    return acc;
  }, {});
};

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
                  {isSelected && (
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  )}
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

const RolEditModal = ({
  isOpen,
  onClose,
  rol,
  allPermissions = [],
  assignedPermissions = [],
  onRolUpdated,
}) => {
  const [nombre, setNombre] = useState(rol?.nombre || "");
  const [descripcion, setDescripcion] = useState(rol?.descripcion || "");
  const [selectedPermIds, setSelectedPermIds] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [permissionsList, setPermissionsList] = useState(allPermissions || []);

  const initState = useCallback(() => {
    setNombre(rol?.nombre || "");
    setDescripcion(rol?.descripcion || "");
    const assignedIds = assignedPermissions
      .map((perm) => perm.idPermiso || perm.id_permiso || perm.id)
      .filter(Boolean);
    setSelectedPermIds(assignedIds);
    setPermissionsList(allPermissions || []);
    setErrors({});
    setSaveSuccess(false);
  }, [rol, assignedPermissions, allPermissions]);

  useEffect(() => {
    if (isOpen) {
      initState();
    }
  }, [isOpen, initState]);

  const handleTogglePerm = (permId) => {
    setSelectedPermIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId],
    );
  };

  const fetchPermissions = useCallback(async () => {
    if (permissionsList && permissionsList.length > 0) return;
    setLoadingPerms(true);
    try {
      const res = await authFetch("http://localhost:8080/api/permissions");
      if (!res.ok) throw new Error("Error al obtener permisos");
      const data = await res.json();
      setPermissionsList(data.data || data.permissions || data || []);
    } catch (err) {
      console.error("Error cargando permisos:", err);
    } finally {
      setLoadingPerms(false);
    }
  }, [permissionsList]);

  useEffect(() => {
    if (isOpen && (!permissionsList || permissionsList.length === 0)) {
      fetchPermissions();
    }
  }, [isOpen, permissionsList, fetchPermissions]);

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setErrors({ nombre: "El nombre del rol es obligatorio" });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const updatedRole = {
        nombreRol: nombre.trim(),
        descripcion: descripcion.trim(),
        idEstado: rol?.idEstado || 1,
      };

      const response = await authFetch(
        `http://localhost:8080/api/roles/${rol?.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedRole),
        },
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Error al actualizar el rol");

      const currentAssignedIds = assignedPermissions
        .map((perm) => perm.idPermiso || perm.id_permiso || perm.id)
        .filter(Boolean);
      const idsToAdd = selectedPermIds.filter(
        (id) => !currentAssignedIds.includes(id),
      );
      const idsToRemove = currentAssignedIds.filter(
        (id) => !selectedPermIds.includes(id),
      );

      if (idsToRemove.length > 0) {
        await Promise.all(
          idsToRemove.map((permId) =>
            authFetch("http://localhost:8080/api/role-permissions/", {
              method: "DELETE",
              body: JSON.stringify({ idRol: rol?.id, idPermiso: permId }),
            }),
          ),
        );
      }

      if (idsToAdd.length > 0) {
        await Promise.all(
          idsToAdd.map((permId) =>
            authFetch("http://localhost:8080/api/role-permissions/assign", {
              method: "POST",
              body: JSON.stringify({ idRol: rol?.id, idPermiso: permId }),
            }),
          ),
        );
      }

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
        if (onRolUpdated) onRolUpdated(nombre.trim());
      }, 700);
    } catch (err) {
      setErrors({ submit: err.message || "No se pudo actualizar el rol" });
    } finally {
      setIsSaving(false);
    }
  };

  const groupedPermissions = groupPermissionsByModule(permissionsList);
  const totalSelected = selectedPermIds.length;

  if (!rol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100">
          <DialogHeader className="relative p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  Editar Rol
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm mt-1">
                  Modifica el nombre, la descripción y los permisos del rol.
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
        </div>

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
                className={`border-slate-200 focus:border-emerald-400 ${errors.nombre ? "border-red-400" : ""}`}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5" /> Estado actual
              </label>
              <div className="text-sm text-slate-500">
                {rol.estado || "Activo"}
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
                ? "bg-emerald-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Guardado
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolEditModal;
