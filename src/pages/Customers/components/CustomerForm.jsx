import React from "react";
// IMPORTACIONES CON RUTA EXACTA (3 niveles)
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { CreditCard, UserPlus } from "lucide-react";

export function CustomerForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Aseguramos que los valores nunca sean undefined para evitar errores de React
  const safeValue = (value) => value || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider">
          <UserPlus size={16} />
          Personal Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombres">First Name *</Label>
            <Input
              id="nombres"
              value={safeValue(formData.nombres)}
              onChange={(e) => onChange("nombres", e.target.value)}
              placeholder="e.g. Carlos Eduardo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellidos">Last Name *</Label>
            <Input
              id="apellidos"
              value={safeValue(formData.apellidos)}
              onChange={(e) => onChange("apellidos", e.target.value)}
              placeholder="e.g. Mendoza García"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">Document Type *</Label>
            <Select
              value={formData.tipoDocumento}
              onValueChange={(value) => onChange("tipoDocumento", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cedula">ID Card (Cédula)</SelectItem>
                <SelectItem value="nit">Tax ID (NIT)</SelectItem>
                <SelectItem value="cedula_extranjeria">Foreigner ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">Document Number *</Label>
            <Input
              id="numeroDocumento"
              value={safeValue(formData.numeroDocumento)}
              onChange={(e) => onChange("numeroDocumento", e.target.value)}
              placeholder="12345678"
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
          Contact & Location
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={safeValue(formData.email)}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="customer@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Phone Number *</Label>
            <Input
              id="telefono"
              value={safeValue(formData.telefono)}
              onChange={(e) => onChange("telefono", e.target.value)}
              placeholder="+51 987654321"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-32"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-48 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEditing ? "Update Customer" : "Register Customer"}
        </Button>
      </div>
    </form>
  );
}
