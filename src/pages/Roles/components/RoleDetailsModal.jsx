import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Shield, CheckCircle2, Award } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";

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
      <DialogContent
        className="sm:max-w-[650px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles del Rol
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información completa del rol y sus permisos
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Perfil del Rol */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {rol.nombre}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {rol.descripcion || "Sin descripción asignada"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full font-semibold ${
                      rol.estado === "activo" || !rol.estado
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {rol.estado || "activo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información Básica */}
            <InfoCard icon={Shield} iconColor="blue" title="Información Básica">
              <div>
                <p className="text-xs text-slate-500 mb-1">ID del Rol</p>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  #{rol.idRol || rol.id || "N/A"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Fecha Creación</p>
                <p className="text-sm font-semibold text-slate-800">
                  {rol.fechaCreacion || "N/A"}
                </p>
              </div>
            </InfoCard>

            {/* Estadísticas */}
            <InfoCard icon={Award} iconColor="violet" title="Estadísticas">
              <div>
                <p className="text-xs text-slate-500 mb-1">Permisos Totales</p>
                <p className="text-sm font-bold text-slate-800">
                  {rol.permisosCount || permisos.length || 0}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Usuarios Asignados
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {rol.usuariosAsignados || "0"}
                </p>
              </div>
            </InfoCard>
          </div>

          {/* Sección de permisos */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-600" />
              Permisos Asignados ({rol.permisosCount || permisos.length || 0})
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
