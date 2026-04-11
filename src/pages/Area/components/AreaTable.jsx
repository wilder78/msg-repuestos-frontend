import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Loader2 } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";
import ActionButtons from "../../../components/shared/ActionButtons";

const AreaTable = ({
  zones,
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

  if (!zones || zones.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t">
        <p className="text-slate-500 font-medium">No se encontraron zonas</p>
        <p className="text-slate-400 text-sm">Intenta con otro término de búsqueda.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow>
          <TableHead className="pl-6 w-[100px]">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => (
          <TableRow key={zone.id} className="group hover:bg-slate-50/50 transition-colors">
            <TableCell className="pl-6 font-medium text-slate-700">{zone.id}</TableCell>
            <TableCell>
              <span className="font-semibold text-slate-900">{zone.name}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-slate-500">{zone.description}</span>
            </TableCell>
            <TableCell>
              <StatusBadge statusId={zone.statusId} onClick={() => onToggleStatus(zone)} />
            </TableCell>
            <TableCell className="text-right pr-6">
              <ActionButtons
                item={zone}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                disabledEdit={zone.statusId !== 1}
                disabledDelete={zone.statusId !== 1}
                labels={{
                  view: "Ver zona",
                  edit: "Editar zona",
                  delete: "Eliminar zona",
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AreaTable;
