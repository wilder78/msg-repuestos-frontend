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
import { Trash2, AlertTriangle } from "lucide-react";

const EmployeeDeleteModal = ({
  isOpen,
  onClose,
  empleado,
  onConfirm,
  loading,
  error = null, // Captura error de backend (ej: historial ventas)
}) => {
  if (!empleado) return null;

  // ─── RESTRICCIÓN DE NEGOCIO (ROLES CRÍTICOS POR NOMBRE O ID) ───
  const restrictedRoles = [
    "Administrador",
    "Asistente Administrativo",
    "Vendedor",
  ];
  const restrictedIds = [1, 2, 3];

  const isRestrictedRole = 
    restrictedRoles.some(role => empleado.cargo?.toLowerCase() === role.toLowerCase()) ||
    restrictedIds.includes(Number(empleado.idRol));

  // Definir el mensaje de error final (Prioriza restricción de rol o error de backend)
  const displayError = isRestrictedRole
    ? `No se puede eliminar un empleado con el cargo de "${empleado.cargo}" (Rol ID: ${empleado.idRol}) por motivos de seguridad y operatividad del sistema.`
    : error;

  const initials = empleado.nombres
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[420px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {displayError ? (
          /* ─── VISTA DE RESTRICCIÓN (Si hay error de BD o Rol Crítico) ─── */
          <>
            <div className="bg-white px-6 pt-8 pb-4">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-amber-50 rounded-full">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Acción Restringida
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 px-4 italic leading-relaxed">
                    {displayError}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <p className="text-[11px] text-slate-500 text-center leading-relaxed font-medium">
                  Para mantener la integridad operativa y financiera, los registros 
                  críticos o con historial vinculado no pueden ser borrados del sistema.
                </p>
              </div>
              <Button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-[46px] rounded-xl transition-all"
              >
                Entendido
              </Button>
            </div>
          </>
        ) : (
          /* ─── VISTA NORMAL DE CONFIRMACIÓN ─── */
          <>
            <div className="bg-white px-6 pt-6 pb-4">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 rounded-xl">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Eliminar Empleado
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm mt-0.5">
                      Esta acción es permanente y eliminará el registro de la
                      base de datos.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="px-6 pb-5 space-y-4 bg-white">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    ¿Estás seguro de que deseas eliminar permanentemente al
                    empleado{" "}
                    <span className="font-bold text-gray-900">
                      {empleado.nombres} {empleado.apellidos}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    Esta acción no se puede deshacer. Los datos del empleado se
                    perderán para siempre.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-sm font-bold">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {empleado.nombres} {empleado.apellidos}
                  </p>
                  <p className="text-xs text-gray-400">
                    {empleado.email || "Sin email"}
                  </p>
                </div>
                <span className="ml-auto text-xs text-gray-400 font-medium">
                  ID: #{empleado.id?.toString().padStart(4, "0")}
                </span>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-[44px]"
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-[44px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Eliminando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </div>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDeleteModal;
