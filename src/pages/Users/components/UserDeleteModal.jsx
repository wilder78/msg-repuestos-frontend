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
import { Trash2, AlertTriangle, ShieldX } from "lucide-react";

const UserDeleteModal = ({
  isOpen,
  onClose,
  usuario,
  onConfirm,
  loading,
  error
}) => {
  if (!usuario) return null;

  // El usuario Master (ID 1) no puede ser eliminado
  const isMaster = usuario.idUsuario === 1 || usuario.nombreUsuario?.toLowerCase() === "master";
  const displayError = error || (isMaster ? "Este es el usuario raíz del sistema (Master) y no puede ser eliminado para evitar el bloqueo total del panel administrativo." : null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 text-left">
              <div className={`p-2.5 ${displayError ? "bg-amber-100" : "bg-red-100"} rounded-xl text-center shrink-0`}>
                {displayError ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : (
                  <Trash2 className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {displayError ? "Usuario Protegido" : "Confirmar Eliminacion"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  {displayError ? "Restricción de seguridad" : "Esta accion no se puede deshacer"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {displayError ? (
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  No se permite eliminar este usuario
                </p>
                <p className="text-[12px] text-amber-700 mt-2 leading-relaxed">
                  {displayError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  ¿Estas seguro de que deseas eliminar al usuario{" "}
                  <span className="font-bold text-gray-900">
                    {usuario.nombreUsuario}
                  </span>?
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  Esta accion no se puede deshacer y el usuario perdera todo el
                  acceso al sistema.
                </p>
              </div>
            </div>
          )}

          {/* Datos del usuario afectado */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <div className={`h-10 w-10 rounded-full ${isMaster ? "bg-amber-100" : "bg-red-100"} flex items-center justify-center shrink-0 border border-white shadow-sm font-bold`}>
              <span className={`${isMaster ? "text-amber-600" : "text-red-600"} text-xs`}>
                {usuario.nombreUsuario?.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {usuario.nombreUsuario}
              </p>
              <p className="text-xs text-gray-400 truncate tracking-tight">{usuario.email}</p>
            </div>
            <span className="ml-auto shrink-0 text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-bold">
              ID: #{usuario.idUsuario?.toString().padStart(4, "0")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-11"
          >
            {displayError ? "Entendido" : "Cancelar"}
          </Button>
          {!displayError && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Eliminar Usuario
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteModal;