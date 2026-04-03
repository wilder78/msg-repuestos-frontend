import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";

/**
 * Componente reutilizable de botones de acción para tablas.
 * Diseño basado en la tabla de Gestión de Roles y Permisos.
 *
 * @param {function} onView   - Callback al hacer clic en "Ver"
 * @param {function} onEdit   - Callback al hacer clic en "Editar"
 * @param {function} onDelete - Callback al hacer clic en "Eliminar"
 * @param {object}   item     - El objeto de la fila (se pasa al callback)
 * @param {object}   labels   - Textos del tooltip: { view, edit, delete }
 *
 * Uso:
 * <ActionButtons
 *   item={rol}
 *   onView={handleView}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   labels={{ view: "Ver detalles", edit: "Editar rol", delete: "Eliminar rol" }}
 * />
 */
const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  item,
  labels = { view: "Ver detalles", edit: "Editar", delete: "Eliminar" },
}) => {
  return (
    <div className="flex justify-end gap-1">
      {/* Ver */}
      <Button
        variant="ghost"
        size="icon"
        title={labels.view}
        className="h-8 w-8 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          onView(item);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {/* Editar */}
      <Button
        variant="ghost"
        size="icon"
        title={labels.edit}
        className="h-8 w-8 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      {/* Eliminar */}
      <Button
        variant="ghost"
        size="icon"
        title={labels.delete}
        className="h-8 w-8 text-red-400 hover:bg-red-100 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionButtons;
