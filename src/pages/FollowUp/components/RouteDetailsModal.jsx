import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Separator } from "../../../components/ui/separator";
import { Map, MapPin, Calendar, Activity, User, Truck, Clock, Users } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";
import StatusBadge from "../../../components/shared/StatusBadge";

const RouteDetailsModal = ({ isOpen, onClose, route }) => {
  if (!route) return null;

  // Formatear fecha si existe
  const formatFecha = (fecha) => {
    if (!fecha) return "No registrada";
    try {
      // Ajuste para evitar desface de zona horaria si viene en formato ISO
      const date = new Date(fecha);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const getRouteColor = (id) => {
    const colors = [
      "from-emerald-500 to-emerald-600",
      "from-blue-500 to-blue-600",
      "from-violet-500 to-violet-600",
      "from-amber-500 to-amber-600",
      "from-rose-500 to-rose-600",
    ];
    return colors[(id || 0) % colors.length];
  };

  const nombreEmpleado = route.empleado ? `${route.empleado.nombre} ${route.empleado.apellido}` : "Sin asignar";
  const nombreZona = route.zona ? route.zona.nombreZona : "Sin zona";

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
                <div className={`p-3 bg-gradient-to-br ${getRouteColor(route.idRuta)} rounded-xl shadow-lg`}>
                  <Map className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles de la Ruta
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información detallada de planificación y asignación
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl bg-gradient-to-br ${getRouteColor(route.idRuta)}`}>
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {route.nombreRuta || "Ruta sin nombre"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">
                      Zona: {nombreZona}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-xs text-slate-500">
                      Asignado a: {nombreEmpleado}
                    </p>
                  </div>
                </div>
              </div>
              <StatusBadge statusId={route.idEstadoRuta} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Planificación */}
            <InfoCard icon={Calendar} iconColor="blue" title="Planificación">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Fecha Planificada
                </p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  {formatFecha(route.fechaPlanificada)}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  ID Ruta #{route.idRuta?.toString().padStart(4, "0") || "0000"}
                </p>
              </div>
            </InfoCard>

            {/* Asignación */}
            <InfoCard icon={Truck} iconColor="violet" title="Asignación">
              <div>
                <p className="text-xs text-slate-500 mb-1">Zona Operativa</p>
                <p className="text-sm font-semibold text-slate-800">
                  {nombreZona}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Encargado / Empleado</p>
                <span className="text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2 py-1 rounded-md">
                  {nombreEmpleado}
                </span>
              </div>
            </InfoCard>

            {/* Estado Operativo */}
            <InfoCard icon={Activity} iconColor="emerald" title="Estado Operativo">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Condición Actual
                </p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  {route.idEstadoRuta === 1 ? "Activo para Operaciones" : "Inactivo / Suspendido"}
                </p>
              </div>
            </InfoCard>

            {/* Registro */}
            <InfoCard icon={Clock} iconColor="slate" title="Registro">
              <div>
                <p className="text-xs text-slate-500 mb-1">Sincronización</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-600" />
                  Actualizado hoy
                </p>
              </div>
            </InfoCard>

            {/* Clientes Asignados */}
            <div className="col-span-2">
              <InfoCard icon={Users} iconColor="blue" title="Clientes a Visitar">
                {route.detalles && route.detalles.length > 0 ? (
                  <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto pr-1">
                    {route.detalles.map((det, idx) => (
                      <div key={det.idCliente || idx} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {det.cliente?.razonSocial || det.nombreCliente || `Cliente #${det.idCliente}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-2">No hay clientes asignados a esta ruta.</p>
                )}
              </InfoCard>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetailsModal;
