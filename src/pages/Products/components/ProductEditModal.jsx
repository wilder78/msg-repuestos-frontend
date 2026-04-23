import React, { useState, useRef } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import {
  Edit2, Package, Tag, DollarSign, Archive, BarChart3, Image as ImageIcon,
  AlertCircle
} from "lucide-react";

const ProductEditModal = ({
  isOpen,
  onClose,
  product,
  formData,
  listaCategorias,
  onInputChange,
  onSelectChange,
  onFileChange,
  onSubmit,
  loading,
  onSaveSuccess,
}) => {
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  if (!product) return null;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (onFileChange) onFileChange(file);
  };

  const handleSave = async () => {
    setError(null);
    const result = await onSubmit();

    if (result === true) {
      setSaveSuccess(true);
      const updatedName = formData.nombre;

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          onSaveSuccess(updatedName);
          setTimeout(() => {
            setSaveSuccess(false);
          }, 4500);
        }, 300);
      }, 800);
    } else {
      setError("Error al guardar cambios. Verifique la consola o sus permisos.");
    }
  };

  // Detecta si hay cambios en los campos editables
  const hasChanges = () => {
    if (!product || !formData) return false;
    if (preview) return true; // File changed

    const f = formData;
    const p = product;

    return (
      (f.nombre || "").trim() !== (p.nombre || "").trim() ||
      (f.referencia || "").trim() !== (p.referencia || "").trim() ||
      (f.idCategoria?.toString() || "") !== ((p.idCategoria || p.id_categoria)?.toString() || "") ||
      (f.marca || "").trim() !== (p.marca || "").trim() ||
      (f.modelo || "").trim() !== (p.modelo || "").trim() ||
      Number(f.precioCompra || 0) !== Number(p.precioCompra ?? p.precio_compra ?? 0) ||
      Number(f.stockBuenEstado || 0) !== Number(p.stockBuenEstado ?? p.stock_buen_estado ?? 0) ||
      Number(f.stockDefectuoso || 0) !== Number(p.stockDefectuoso ?? p.stock_defectuoso ?? 0) ||
      (f.descripcion || "").trim() !== (p.descripcion || "").trim()
    );
  };

  const isFormValid = () => {
    return (
      formData.nombre?.trim() &&
      formData.referencia?.trim() &&
      formData.idCategoria &&
      formData.precioCompra &&
      formData.stockBuenEstado !== undefined
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[750px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl shadow-sm">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Producto
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Actualiza la información y existencias del producto
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col md:flex-row bg-white max-h-[65vh] overflow-hidden">
          {/* ── Lateral Izquierdo: Resumen y Foto ── */}
          <div className="md:w-1/3 bg-slate-50/50 p-6 border-r border-slate-100 flex flex-col items-center overflow-y-auto">
            <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-100 transition-colors group relative"
                 onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (() => {
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
                className="h-10 w-10 text-slate-300" 
                style={{ display: (!preview && (!(product.imagenUrl || product.imagen_url) || (product.imagenUrl || product.imagen_url) === "default_producto.png")) ? 'block' : 'none' }}
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="h-6 w-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Cambiar</span>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <div className="w-full mt-6 space-y-3">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 break-words line-clamp-2">{product.nombre}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">ID: #{(product.idProducto || product.id_producto)?.toString().padStart(4, "0")}</p>
              </div>
            </div>
          </div>

          {/* ── Lateral Derecho: Formulario ── */}
          <div className="md:w-2/3 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-semibold text-gray-700">
                  Nombre del Producto <span className="text-emerald-500">*</span>
                </label>
                <Input
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Referencia / SKU <span className="text-emerald-500">*</span>
                </label>
                <Input
                  name="referencia"
                  value={formData.referencia || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400 font-mono text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Categoría <span className="text-emerald-500">*</span>
                </label>
                <Select
                  value={formData.idCategoria ? formData.idCategoria.toString() : ""}
                  onValueChange={(val) => onSelectChange("idCategoria", val)}
                >
                  <SelectTrigger className="focus:ring-emerald-400 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#fff" }}>
                    {(listaCategorias || [])
                      .filter((cat) => (cat.idCategoria || cat.id_categoria) != null)
                      .map((cat) => {
                        const catId = (cat.idCategoria || cat.id_categoria).toString();
                        return (
                          <SelectItem key={`cat-${catId}`} value={catId}>
                            {cat.nombreCategoria || cat.nombre_categoria || "Sin nombre"}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Marca</label>
                <Input
                  name="marca"
                  value={formData.marca || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Modelo / Año</label>
                <Input
                  name="modelo"
                  value={formData.modelo || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Precio Compra
                </label>
                <Input
                  name="precioCompra"
                  type="number"
                  step="0.01"
                  value={formData.precioCompra || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Archive className="h-3.5 w-3.5 text-blue-500" /> Stock (Buen Estado)
                </label>
                <Input
                  name="stockBuenEstado"
                  type="number"
                  value={formData.stockBuenEstado || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> Stock Defectuoso
                </label>
                <Input
                  name="stockDefectuoso"
                  type="number"
                  value={formData.stockDefectuoso || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs font-semibold text-gray-700">Descripción</label>
                <Textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={onInputChange}
                  className="focus-visible:ring-emerald-400 resize-none min-h-[60px]"
                />
              </div>

            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            onClick={handleSave}
            disabled={loading || saveSuccess || !hasChanges() || !isFormValid()}
            className={`flex-1 font-semibold ${
              saveSuccess ? "bg-emerald-600 shadow-none text-white" : "bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-200 text-white"
            }`}
          >
            {loading ? "Guardando..." : saveSuccess ? "Actualizado" : "Guardar Cambios"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 font-semibold text-slate-600">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
