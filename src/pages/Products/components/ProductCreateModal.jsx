import React, { useRef, useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import {
  Loader2, PackagePlus, Upload, Image as ImageIcon, CheckCircle2,
  Tag, Hash, DollarSign, Archive, BarChart3, Info, Calendar
} from "lucide-react";

const ProductCreateModal = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSelectChange,
  onFileChange,
  onSubmit,
  loading,
  listaCategorias,
}) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreview(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (onFileChange) onFileChange(file);
  };

  const handleSubmit = async () => {
    // ✅ onSubmit en GestionProductos ya maneja el cierre del modal y el toast
    // Este componente solo refleja el estado visual del botón
    const result = await onSubmit();
    if (result === true) {
      setSaveSuccess(true);
      // ✅ Solo reseteamos el estado visual — el cierre lo maneja el padre
      setTimeout(() => setSaveSuccess(false), 1500);
    }
  };

  const isFormValid = () =>
    formData.nombre?.trim() &&
    formData.referencia?.trim() &&
    formData.idCategoria &&
    // ✅ Verificar que precioCompra sea un número válido mayor a 0
    parseFloat(formData.precioCompra) > 0 &&
    formData.stockBuenEstado !== undefined &&
    formData.stockBuenEstado !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[750px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* Header */}
        <DialogHeader className="px-7 pt-6 pb-0">
          <div className="flex items-center gap-2.5 text-[#10b981]">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <PackagePlus className="h-5 w-5" />
            </div>
            <DialogTitle className="text-[#0f172a] text-xl font-bold">
              Registrar Nuevo Producto
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa las especificaciones técnicas y existencias del nuevo repuesto
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Imagen */}
          <div className="md:col-span-4 bg-slate-50/50 p-7 flex flex-col items-center justify-center border-r border-slate-100">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 w-full text-center">
              Imagen del Producto
            </Label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-white
                         flex items-center justify-center overflow-hidden cursor-pointer
                         hover:border-[#10b981] hover:bg-emerald-50 transition-all shadow-sm group"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-slate-300 group-hover:text-[#10b981] transition-colors" />
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-emerald-600">
                    Subir foto
                  </span>
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <div className="mt-4 flex flex-col gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="w-full h-9 text-xs font-semibold border-slate-200 hover:bg-white hover:text-[#10b981] hover:border-[#10b981]"
              >
                <Upload className="h-3.5 w-3.5 mr-2" />
                {preview ? "Cambiar imagen" : "Seleccionar imagen"}
              </Button>
              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Formatos: JPG, PNG. Máx 5MB.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-8 p-7">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">

              {/* Nombre */}
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Nombre del Producto <span className="text-[#10b981]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="nombre"
                    value={formData.nombre || ""}
                    onChange={onInputChange}
                    placeholder="Ej: Pastillas de Freno Cerámicas"
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <Info className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Referencia */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Referencia / SKU <span className="text-[#10b981]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="referencia"
                    value={formData.referencia || ""}
                    onChange={onInputChange}
                    placeholder="FRE-PAST-001"
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Categoría */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Categoría <span className="text-[#10b981]">*</span>
                </Label>
                <Select
                  value={formData.idCategoria ? formData.idCategoria.toString() : ""}
                  onValueChange={(val) => onSelectChange("idCategoria", val)}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 focus:ring-[#10b981] bg-white">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Selecciona" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
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

              {/* Marca */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Marca</Label>
                <div className="relative">
                  <Input
                    name="marca"
                    value={formData.marca || ""}
                    onChange={onInputChange}
                    placeholder="Akebono"
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <BarChart3 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Modelo */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Modelo / Año</Label>
                <Input
                  name="modelo"
                  value={formData.modelo || ""}
                  onChange={onInputChange}
                  placeholder="2024"
                  className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
                />
              </div>

              {/* ✅ Precio Compra — onInputChange guarda como string, parseFloat en validación */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Precio Compra <span className="text-[#10b981]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="precioCompra"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precioCompra ?? ""}
                    onChange={onInputChange}
                    placeholder="0.00"
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Stock Buen Estado */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Stock Inicial (Buen Estado) <span className="text-[#10b981]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="stockBuenEstado"
                    type="number"
                    min="0"
                    value={formData.stockBuenEstado ?? ""}
                    onChange={onInputChange}
                    placeholder="0"
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <Archive className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Fecha de Registro Automática */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Fecha Registro <span className="text-[#10b981]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="fechaRegistro"
                    type="date"
                    value={formData.fechaRegistro || new Date().toISOString().split('T')[0]}
                    onChange={onInputChange}
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-[#10b981] pl-9"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-700">Descripción</Label>
                <Textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={onInputChange}
                  placeholder="Detalles adicionales del producto..."
                  className="rounded-xl border-slate-200 focus-visible:ring-[#10b981] min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-7 h-px bg-slate-100" />

        {/* Footer */}
        <DialogFooter className="px-7 py-6 flex gap-3 sm:gap-3 bg-slate-50/30">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || saveSuccess}
            className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || saveSuccess || !isFormValid()}
            className={`flex-1 h-11 rounded-xl font-bold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-500 text-white"
                : loading || !isFormValid()
                  ? "bg-slate-300 text-slate-500"
                  : "bg-[#10b981] hover:bg-[#0da673] shadow-lg shadow-emerald-100 text-white"
            }`}
          >
            {saveSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Registrado</>
            ) : loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
            ) : (
              "Guardar Producto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateModal;