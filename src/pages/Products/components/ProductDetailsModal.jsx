import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Separator } from "../../../components/ui/separator";
import {
  Package,
  Tag,
  DollarSign,
  Archive,
  BarChart3,
  Calendar,
  Layers,
  FileText,
  BadgeAlert,
  Info,
  Layers2
} from "lucide-react";
import InfoCard from "./InfoCard";
import StatusBadge from "../../../components/shared/StatusBadge";

const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  categoryMap,
}) => {
  if (!product) return null;

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "No registrada";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Encabezado con gradiente azul/indigo para productos */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-100">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles del Producto
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Especificaciones técnicas y existencias en inventario
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Sección de Producto Principal */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {(() => {
                    const imgUrl = product.imagenUrl || product.imagen_url;
                    if (imgUrl && imgUrl !== "default_producto.png") {
                      const src = imgUrl.startsWith('http') ? imgUrl : `http://localhost:8080/uploads/${imgUrl}`;
                      return (
                        <img 
                          src={src} 
                          alt={product.nombre}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                  <Layers2 
                    className="h-10 w-10 text-indigo-500" 
                    style={{ display: ((product.imagenUrl || product.imagen_url) && (product.imagenUrl || product.imagen_url) !== "default_producto.png") ? 'none' : 'block' }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {product.referencia || "SIN REF"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      ID: #{(product.idProducto || product.id_producto)?.toString().padStart(4, "0")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    {product.nombre}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">
                        {product.categoria?.nombre_categoria || categoryMap?.[product.idCategoria || product.id_categoria] || "Sin categoría"}
                      </span>
                    </div>
                    {product.marca && (
                       <>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-600 font-medium">
                            {product.marca}
                          </span>
                        </div>
                       </>
                    )}
                  </div>
                </div>
              </div>
              <StatusBadge statusId={product.idEstado || product.id_estado} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Información de Costos - Color Esmeralda */}
            <InfoCard
              icon={DollarSign}
              iconColor="emerald"
              title="Información Financiera"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Precio de Compra</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {formatCurrency(product.precioCompra || product.precio_compra)}
                  </p>
                </div>
                <Separator className="bg-emerald-100/50" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Precio de Venta Sugerido</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(product.precioVenta || (product.precioCompra || product.precio_compra) * 1.3)}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Inventario - Color Blue/Indigo */}
            <InfoCard
              icon={Archive}
              iconColor="blue"
              title="Control de Stock"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Stock Buen Estado</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-2xl font-black ${(product.stockBuenEstado ?? product.stock_buen_estado) <= (product.stockMinimo || 5) ? 'text-rose-600' : 'text-blue-700'}`}>
                        {(product.stockBuenEstado ?? product.stock_buen_estado) || 0}
                      </p>
                      <span className="text-xs font-medium text-slate-500">uds</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Defectuoso</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <p className={`text-lg font-bold ${(product.stockDefectuoso ?? product.stock_defectuoso) > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {(product.stockDefectuoso ?? product.stock_defectuoso) || 0}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">uds</span>
                    </div>
                  </div>
                </div>
                <Separator className="bg-blue-100/50" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Stock Mínimo</p>
                    <p className="text-sm font-bold text-slate-700">{product.stockMinimo || 5} uds</p>
                  </div>
                  {(product.stockBuenEstado ?? product.stock_buen_estado) <= (product.stockMinimo || 5) && (
                    <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-md animate-pulse">
                      <BadgeAlert className="h-3 w-3" />
                      <span className="text-[10px] font-bold">REABASTECER</span>
                    </div>
                  )}
                </div>
              </div>
            </InfoCard>

            {/* Detalles Técnicos - Color Slate */}
            <InfoCard
              icon={Info}
              iconColor="slate"
              title="Datos Técnicos"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Referencia Fábrica</p>
                  <p className="text-sm font-semibold text-slate-800 font-mono">
                    {product.referencia || "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Modelo / Año</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {product.modelo || "Genérico"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Ubicación Almacén</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {product.ubicacion || "Bodega Principal"}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Registro - Color Amber */}
            <InfoCard
              icon={Calendar}
              iconColor="amber"
              title="Registro y Tiempos"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Fecha de Ingreso</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    {formatFecha(product.fechaIngreso || product.fechaCreacion || product.fecha_registro)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Última Actualización</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Hoy (Sincronizado)
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Descripción */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-tight">
                Descripción del Producto
              </h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {product.descripcion || "No hay una descripción detallada disponible para este producto en este momento."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
