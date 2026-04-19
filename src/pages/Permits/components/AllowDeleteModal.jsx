import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Trash2, AlertTriangle, ShieldX, Key } from "lucide-react";

/**
 * getCurrentUser - Obtiene el usuario actual desde el almacenamiento local
 */
const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    );
  } catch (e) {
    return null;
  }
};

const AllowDeleteModal = ({
  isOpen,
  onClose,
  permiso,
  onConfirm,
  loading,
  error,
}) => {
  const user = getCurrentUser();
  // Condición: solo idRol 1 o 2 pueden desasignar permisos
  const hasPermission = user && (user.idRol === 1 || user.idRol === 2);

  if (!permiso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 ${hasPermission ? (error ? "bg-amber-100" : "bg-red-100") : "bg-amber-100"} rounded-xl text-center`}
              >
                {error ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : hasPermission ? (
                  <Trash2 className="h-5 w-5 text-red-600" />
                ) : (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-xl font-bold text-gray-900 leading-none">
                  {error
                    ? "Acción Restringida"
                    : hasPermission
                      ? "Confirmar Revocación"
                      : "Acceso Denegado"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-[13px] mt-1.5 leading-tight">
                  {error
                    ? "Seguridad del Sistema"
                    : hasPermission
                      ? "Deseas quitar este acceso al rol"
                      : "Privilegios insuficientes"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {error ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  Error de Consistencia
                </p>
                <p className="text-[12px] text-amber-700 mt-1.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          ) : !hasPermission ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <ShieldX className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  Sin autorización
                </p>
                <p className="text-[12px] text-amber-700 mt-1.5 leading-relaxed">
                  Tu perfil no cuenta con los permisos necesarios para modificar
                  la estructura de accesos del sistema.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 leading-normal">
                    ¿Estás seguro de que deseas{" "}
                    <span className="font-bold text-red-600">quitar</span> el
                    permiso{" "}
                    <span className="font-bold text-gray-900">
                      {permiso.nombrePermiso || permiso.nombre}
                    </span>{" "}
                    a este rol?
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                    El usuario con este rol perderá acceso inmediato a las
                    funciones ligadas a este permiso específico.
                  </p>
                </div>
              </div>

              {/* Card informativa del permiso */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  <Key className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 break-words leading-tight uppercase">
                    {permiso.nombrePermiso || permiso.nombre}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1 break-words">
                    MODULO: {permiso.modulo || "SISTEMA"}
                  </p>
                </div>
                <div className="shrink-0 ml-3">
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-2 py-1 rounded font-mono font-bold">
                    ID: {permiso.idPermiso || permiso.id}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-11"
          >
            {hasPermission ? "Cancelar" : "Entendido"}
          </Button>

          {hasPermission && !error && (
            <Button
              onClick={() => onConfirm(permiso)}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-11 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Desasignar
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllowDeleteModal;

