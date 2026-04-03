import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Shield, CheckCircle2, X } from "lucide-react";

const RoleDetailsModal = ({ isOpen, onClose, rol, permisos = [] }) => {
  if (!rol || !isOpen) return null;

  // Agrupación de permisos por módulo
  const permisosAgrupados = permisos.reduce((acc, p) => {
    const modulo = p.permiso?.modulo || p.modulo || "General";
    if (!acc[modulo]) acc[modulo] = [];
    acc[modulo].push(p);
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Se eliminó [&>button]:hidden para permitir que los botones internos funcionen */}
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white p-0 rounded-2xl border border-slate-200 shadow-lg"
        style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)" }}
      >
        {/* Header — fondo blanco con botón de cerrar manual */}
        <DialogHeader className="px-7 pt-6 pb-4 border-b border-slate-100/60 bg-white rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                  Detalles del Rol — {rol.nombre}
                </DialogTitle>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Información completa del rol y sus permisos asignados
                </p>
              </div>
            </div>

            {/* Botón de cerrar personalizado */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Cuerpo */}
        <div className="px-7 pb-7 pt-5 space-y-6 bg-white rounded-b-2xl">
          {/* Panel de información del rol */}
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">
                Información del Rol
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Nombre
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {rol.nombre}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Estado
                </span>
                <div className="mt-0.5">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full"
                  >
                    {rol.estado || "activo"}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Descripción
                </span>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  {rol.descripcion || "Sin descripción asignada"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Fecha Creación
                </span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {rol.fechaCreacion || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Permisos Totales
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {rol.permisosCount || 0}
                </p>
              </div>

              {rol.usuariosAsignados !== undefined && (
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Usuarios Asignados
                  </span>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {rol.usuariosAsignados}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sección de permisos */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base tracking-tight">
              Permisos Asignados ({rol.permisosCount || 0})
            </h3>

            {Object.keys(permisosAgrupados).length > 0 ? (
              <div className="space-y-5">
                {Object.entries(permisosAgrupados).map(([modulo, lista]) => (
                  <div
                    key={modulo}
                    className="border border-slate-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    {/* Cabecera del módulo */}
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {modulo} ({lista.length})
                      </span>
                    </div>

                    {/* Grid de permisos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
                      {lista.map((p, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-slate-700 leading-tight uppercase">
                              {p.permiso?.nombrePermiso ||
                                p.nombre_permiso ||
                                "Permiso"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                              {p.descripcion ||
                                "Descripción breve de la acción permitida."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm italic">
                No hay permisos específicos para visualizar en este rol.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDetailsModal;
