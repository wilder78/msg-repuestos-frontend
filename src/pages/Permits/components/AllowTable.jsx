import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Key, Loader2, Info } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";
import ActionButtons from "../../../components/shared/ActionButtons";

const AllowTable = ({
  permissions,
  loading,
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

  if (permissions.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t">
        <p className="text-slate-500 font-medium">No se encontraron permisos</p>
        <p className="text-slate-400 text-sm">
          Asegúrate de que existan registros en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow>
          <TableHead className="pl-6 w-[100px]">ID</TableHead>
          <TableHead>Permiso</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((p) => (
          <TableRow
            key={p.idPermiso}
            className="group hover:bg-slate-50/50 transition-colors"
          >
            <TableCell className="pl-6">
              <span className="text-xs font-mono text-slate-400">#{p.idPermiso}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                  <Key size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 uppercase tracking-tight">
                    {p.nombrePermiso}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                {p.descripcion || "Sin descripción disponible"}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge
                statusId={p.idEstado}
                onClick={() => onToggleStatus(p)}
              />
            </TableCell>
            <TableCell className="text-right pr-6">
              <ActionButtons
                item={p}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                disabledEdit={p.idEstado !== 1}
                disabledDelete={p.idEstado !== 1}
                labels={{
                  view: "Ver detalle",
                  edit: "Editar permiso",
                  delete: "Inactivar",
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AllowTable;