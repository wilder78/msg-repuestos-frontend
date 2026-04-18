import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  IdCard, 
  MapPin, 
  UserCircle, 
  FileText,
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
import { Textarea } from "../../../components/ui/textarea";

export function SupplierForm({ 
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

  const handleSelectChange = (name, value) => {
    onChange({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Nombre de la Empresa */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-slate-700 font-bold">Nombre de la Empresa / Razón Social *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="nombre_empresa"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: Repuestos Industriales S.A.S"
              value={formData.nombre_empresa}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Tipo de Documento */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Tipo de Documento *</Label>
          <Select 
            value={formData.id_tipo_documento?.toString()} 
            onValueChange={(val) => handleSelectChange("id_tipo_documento", parseInt(val))}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Cédula de Ciudadanía</SelectItem>
              <SelectItem value="2">NIT</SelectItem>
              <SelectItem value="3">Cédula de Extranjería</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Número de Documento */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">N° de Documento (NIT/RUT) *</Label>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="numero_documento"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: 900123456-7"
              value={formData.numero_documento}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Persona de Contacto */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Persona de Contacto *</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="contacto"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: Juan Pérez"
              value={formData.contacto}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Teléfono de Contacto *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="telefono"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: 3001234567"
              value={formData.telefono}
              onChange={handleInputChange}
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
              name="email"
              type="email"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: ventas@empresa.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold">Dirección *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              name="direccion"
              className="pl-10 bg-slate-50 border-slate-200"
              placeholder="Ej: Carrera 28 sur # 92 A - 56"
              value={formData.direccion}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Condiciones Comerciales */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-slate-700 font-bold">Condiciones Comerciales</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
            <Textarea
              name="condiciones_comerciales"
              className="pl-10 bg-slate-50 border-slate-200 min-h-[80px]"
              placeholder="Ej: Pago a 30 días, descuento del 5% por pronto pago."
              value={formData.condiciones_comerciales}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

    </form>
  );
}
