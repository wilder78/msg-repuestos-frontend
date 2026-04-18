import React from 'react';
import { 
  Tag, 
  FileText,
} from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

export function CategoryForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  loading = false
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        
        {/* Nombre de la Categoría */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Nombre de la Categoría *</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="nombre_categoria"
              className="pl-10 bg-slate-50 border-slate-200 h-11 rounded-xl focus-visible:ring-emerald-500"
              placeholder="Ej: Repuestos de Motor"
              value={formData.nombre_categoria}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Descripción</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
            <Textarea
              name="descripcion"
              className="pl-10 bg-slate-50 border-slate-200 min-h-[120px] rounded-xl focus-visible:ring-emerald-500 resize-none"
              placeholder="Describe brevemente el tipo de productos que pertenecerán a esta categoría..."
              value={formData.descripcion}
              onChange={handleInputChange}
            />
          </div>
          <p className="text-[11px] text-slate-400 ml-1">
            Esta descripción ayudará a otros usuarios a clasificar correctamente los productos.
          </p>
        </div>
      </div>
    </form>
  );
}
