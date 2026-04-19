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

/**
 * getCurrentUser - Obtiene el usuario actual desde el almacenamiento local
 */
const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    } catch (e) {
        return null;
    }
};

const AllowDeleteModal = ({ isOpen, onClose, permiso, onConfirm, loading, error }) => {
  const user = getCurrentUser();
  // Condición: solo idRol 1 o 2 pueden eliminar
  const hasPermission = user && (user.idRol === 1 || user.idRol === 2);

  if (!permiso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[420px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${hasPermission ? (error ? "bg-amber-100" : "bg-red-100") : "bg-amber-100"} rounded-xl text-center`}>
                {error ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : hasPermission ? (
                  <Trash2 className="h-5 w-5 text-red-600" />
                ) : (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {error ? "Restricción de Sistema" : hasPermission ? "Confirmar Eliminación" : "Acceso Denegado"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5 leading-none">
                  {error ? "Acción protegida" : hasPermission ? "Esta acción es irreversible" : "Privilegios insuficientes"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {error ? (
             <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
               <ShieldX className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm text-amber-800 font-bold leading-tight">
                   Protección de Integridad
                 </p>
                 <p className="text-xs text-amber-700 mt-1.5 leading-relaxed font-medium">
                   {error}
                 </p>
               </div>
             </div>
          ) : !hasPermission ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium leading-tight">
                  No tienes permisos para realizar esta acción.
                </p>
                <p className="text-xs text-amber-600 mt-1.5 leading-relaxed">
                  Solo los Administradores y Supervisores tienen autorización para eliminar permisos del sistema.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 leading-normal">
                    ¿Estás seguro de que deseas eliminar el permiso{" "}
                    <span className="font-bold text-gray-900 leading-none">
                      {permiso.nombrePermiso}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Esta acción eliminará el permiso de forma definitiva y afectará a los roles que lo tengan asignado.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0">
                <div className="h-10 w-10 rounded-full bg-white border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {permiso.nombrePermiso}
                  </p>
                  <p className="text-xs text-gray-400 truncate tracking-tight">{permiso.modulo}</p>
                </div>
                <span className="text-[10px] text-gray-400 font-bold bg-white px-1.5 py-0.5 rounded border border-gray-100 tracking-tighter">
                  ID: #{permiso.idPermiso || permiso.id}
                </span>
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
          {hasPermission && (
            <Button
              onClick={() => onConfirm(permiso)}
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
                  Eliminar Permiso
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
