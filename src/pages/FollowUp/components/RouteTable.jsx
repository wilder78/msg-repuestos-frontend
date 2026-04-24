import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Loader2, MapPin } from "lucide-react";
import StatusToggleButton from "../../../components/shared/StatusToggleButton";
import ActionButtons from "../../../components/shared/ActionButtons";

const getRouteColor = (id) => {
  const colors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
  ];
  return colors[(id || 0) % colors.length];
};

const RouteTable = ({
  routes,
  loading,
  authFetch,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t">
        <p className="text-slate-500 font-medium">No se encontraron rutas</p>
        <p className="text-slate-400 text-sm">
          Prueba con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow>
          <TableHead className="pl-6 w-[80px]">Icono</TableHead>
          <TableHead>Nombre de la Ruta</TableHead>
          <TableHead>Asignación (Zona / Empleado)</TableHead>
          <TableHead>Fecha Planificada</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {routes.map((r) => {
          const id = r.idRuta;
          const status = r.idEstadoRuta || r.idEstado || r.id_estado;
          const nombreEmpleado = r.empleado ? `${r.empleado.nombre} ${r.empleado.apellido}` : "Sin asignar";
          const nombreZona = r.zona ? r.zona.nombreZona : "Sin zona";
          
          return (
            <TableRow
              key={id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm ${getRouteColor(id)}`}
                >
                  <MapPin className="h-5 w-5" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">
                    {r.nombreRuta}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    ID: {id}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">
                    {nombreZona}
                  </span>
                  <span className="text-xs text-slate-500">
                    {nombreEmpleado}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">
                  {r.fechaPlanificada ? new Date(r.fechaPlanificada).toLocaleDateString() : "No definida"}
                </span>
              </TableCell>
              <TableCell>
                <StatusToggleButton
                  id={id}
                  currentStatus={status}
                  apiUrl="http://localhost:8080/api/rutas"
                  onSuccess={onToggleStatus}
                  authFetch={authFetch}
                  fieldName="idEstado"
                  customBody={r}
                />
              </TableCell>
              <TableCell className="text-right pr-6">
                <ActionButtons
                  item={r}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  disabledEdit={!(status === 1)}
                  disabledDelete={!(status === 1)}
                  labels={{
                    view: "Ver ruta",
                    edit: "Editar ruta",
                    delete: "Eliminar ruta",
                  }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RouteTable;
