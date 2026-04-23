import React from "react";
import { Package, Tag, Loader2, DollarSign, Archive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import StatusToggleButton from "../../../components/shared/StatusToggleButton";
import ActionButtons from "../../../components/shared/ActionButtons";

const ProductsTable = ({
  products,
  categoryMap,
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

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-t border-slate-100">
        <p className="text-slate-500 font-medium">No se encontraron productos</p>
        <p className="text-slate-400 text-sm">
          Prueba con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[80px] pl-6 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Foto</TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">Producto</TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">Categoría</TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">Precio</TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">Stock</TableHead>
            <TableHead className="text-slate-400 font-bold uppercase text-[11px] tracking-wider text-center">Estado</TableHead>
            <TableHead className="text-right pr-6 text-slate-400 font-bold uppercase text-[11px] tracking-wider">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => {
            const precio = p.precioCompra ?? p.precio_compra ?? 0;
            const stock = p.stockBuenEstado ?? p.stock_buen_estado ?? 0;
            const estado = p.idEstado ?? p.id_estado ?? 1;

            return (
              <TableRow
                key={p.idProducto || p.id_producto}
                className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100"
              >
                <TableCell className="pl-6">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-white group-hover:shadow-sm">
                    <Package className="h-5 w-5" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">
                      {p.nombre}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      ID: {p.idProducto || p.id_producto} | {p.referencia}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {p.categoria?.nombre_categoria || categoryMap[p.idCategoria || p.id_categoria] || "Sin categoría"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                    {parseFloat(precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Archive className={`h-3.5 w-3.5 ${stock <= 5 ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className={`font-medium ${stock <= 5 ? 'text-rose-600' : 'text-slate-600'}`}>
                      {stock} uds
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <StatusToggleButton
                    id={p.idProducto || p.id_producto}
                    currentStatus={estado}
                    apiUrl="http://localhost:8080/api/products"
                    onSuccess={onToggleStatus}
                    authFetch={authFetch}
                    fieldName={p.idEstado !== undefined ? "idEstado" : "id_estado"}
                  />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <ActionButtons
                    item={p}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    disabledEdit={estado !== 1}
                    disabledDelete={estado !== 1}
                    labels={{
                      view: "Ver producto",
                      edit: "Editar producto",
                      delete: "Eliminar producto",
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
