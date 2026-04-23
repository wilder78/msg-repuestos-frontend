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
import { Trash2, AlertTriangle, ShieldX, Package } from "lucide-react";

const ProductDeleteModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  loading,
  error
}) => {
  if (!product) return null;

  // Si hay un error del backend (como el 409 de integridad), lo priorizamos.
  const displayError = error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 text-left">
              <div className={`p-2.5 ${displayError ? "bg-amber-100" : "bg-red-100"} rounded-xl text-center shrink-0`}>
                {displayError ? (
                  <ShieldX className="h-5 w-5 text-amber-600" />
                ) : (
                  <Trash2 className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {displayError ? "Acción Restringida" : "Confirmar Eliminación"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  {displayError ? "Restricción de Sistema" : "Esta acción no se puede deshacer"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-6 pb-5 space-y-4 bg-white">
          {displayError ? (
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-bold leading-tight">
                  No se permite eliminar este producto
                </p>
                <p className="text-[12px] text-amber-700 mt-2 leading-relaxed">
                  {displayError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  ¿Estás seguro de que deseas eliminar el producto{" "}
                  <span className="font-bold text-gray-900">
                    {product.nombre}
                  </span>?
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  El registro será borrado físicamente de la base de datos. Si el producto tiene registros de inventario o facturas asociadas, la operación podría fallar.
                </p>
              </div>
            </div>
          )}

          {/* Mini Card de Producto */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <div className={`h-10 w-10 rounded-xl ${displayError ? "bg-amber-100" : "bg-red-100"} flex items-center justify-center shrink-0 border border-white shadow-sm font-bold overflow-hidden`}>
              {(() => {
                const imgUrl = product.imagenUrl || product.imagen_url;
                if (imgUrl && imgUrl !== "default_producto.png") {
                  const src = imgUrl.startsWith('http') ? imgUrl : `http://localhost:8080/uploads/${imgUrl}`;
                  return (
                    <img 
                      src={src} 
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  );
                }
                return null;
              })()}
              <Package 
                className={`h-5 w-5 ${displayError ? "text-amber-600" : "text-red-600"}`} 
                style={{ display: ((product.imagenUrl || product.imagen_url) && (product.imagenUrl || product.imagen_url) !== "default_producto.png") ? 'none' : 'block' }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 break-words leading-tight">
                {product.nombre}
              </p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed break-words">
                Ref: {product.referencia || "N/A"}
              </p>
            </div>
            <div className="shrink-0 ml-3">
              <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap">
                ID: {product.idProducto || product.id_producto}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-xl h-11"
          >
            {displayError ? "Entendido" : "Cancelar"}
          </Button>
          
          {/* ✅ Solo se muestra el botón de eliminar si no hay error de restricción */}
          {!displayError && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-xl h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Eliminar Registro
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDeleteModal;
