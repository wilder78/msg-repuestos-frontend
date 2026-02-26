import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  MapPin, 
  Briefcase, 
  Upload, 
  X 
} from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

export function EmployeeForm({ 
  formData, 
  onChange, 
  onImageUpload, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  cargos = [],
  ciudades = []
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 py-4">
      {/* SECCIÓN DE FOTO (Centrada) */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-4">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-md ring-1 ring-slate-200">
            <AvatarImage src={formData.foto} alt="Previsualización" />
            <AvatarFallback className="bg-slate-100 text-slate-400">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-emerald-700 transition-colors">
            <Upload size={14} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => onImageUpload(e, isEditing)} 
            />
          </label>
        </div>
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          Foto del colaborador
        </p>
      </div>

      {/* GRID DE CAMPOS (2 Columnas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Nombres */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Nombres *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: Carlos Alberto"
              value={formData.nombres}
              onChange={(e) => onChange({ ...formData, nombres: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Apellidos */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Apellidos *</Label>
          <Input
            className="bg-slate-50 border-slate-200"
            placeholder="Ej: Rodríguez Pérez"
            value={formData.apellidos}
            onChange={(e) => onChange({ ...formData, apellidos: e.target.value })}
            required
          />
        </div>

        {/* Tipo de Documento */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Tipo de Documento *</Label>
          <Select 
            value={formData.tipoDocumento} 
            onValueChange={(val) => onChange({ ...formData, tipoDocumento: val })}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
              <SelectItem value="CE">Cédula de Extranjería</SelectItem>
              <SelectItem value="PP">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Número de Documento */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">N° de Documento *</Label>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="12345678"
              value={formData.numeroDocumento}
              onChange={(e) => onChange({ ...formData, numeroDocumento: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Correo Electrónico *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              type="email"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="correo@msgrepuestos.com"
              value={formData.email}
              onChange={(e) => onChange({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Teléfono / WhatsApp *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="+57 300 000 0000"
              value={formData.telefono}
              onChange={(e) => onChange({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Cargo */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Cargo en la empresa *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-slate-400 z-10" size={16} />
            <Select 
              value={formData.cargo} 
              onValueChange={(val) => onChange({ ...formData, cargo: val })}
            >
              <SelectTrigger className="pl-10 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Seleccionar cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map(cargo => (
                  <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Ciudad *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400 z-10" size={16} />
            <Select 
              value={formData.ciudad} 
              onValueChange={(val) => onChange({ ...formData, ciudad: val })}
            >
              <SelectTrigger className="pl-10 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent>
                {ciudades.map(ciudad => (
                  <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dirección (Ocupa dos columnas) */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-slate-700 font-bold">Dirección de residencia *</Label>
          <Input
            className="bg-slate-50 border-slate-200"
            placeholder="Calle 123 #45-67"
            value={formData.direccion}
            onChange={(e) => onChange({ ...formData, direccion: e.target.value })}
            required
          />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-3 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 font-bold text-slate-500 border-slate-200 h-11"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-100 h-11"
        >
          {isEditing ? 'Guardar Cambios' : 'Registrar Empleado'}
        </Button>
      </div>
    </form>
  );
}
