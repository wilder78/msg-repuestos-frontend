import React, { useState } from "react";
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
import { Building2, UserPlus, CreditCard, MapPin } from "lucide-react";

// ✅ Estado inicial alineado con la estructura real del backend
const INITIAL_FORM = {
  idTipoDocumento: "",
  numeroDocumento: "",
  razonSocial: "",       // ← campo real del backend (antes era nombres/apellidos)
  direccion: "",
  telefono: "",
  email: "",
  tipoCliente: "",
  cupoCredito: "",
  idZona: "",
};

export function CustomerForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpia el error del campo al editar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // ✅ Validación local antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.razonSocial.trim())
      newErrors.razonSocial = "La razón social es obligatoria.";
    if (!formData.idTipoDocumento)
      newErrors.idTipoDocumento = "Selecciona un tipo de documento.";
    if (!formData.numeroDocumento.trim())
      newErrors.numeroDocumento = "El número de documento es obligatorio.";
    if (!formData.telefono.trim())
      newErrors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoCliente)
      newErrors.tipoCliente = "Selecciona el tipo de cliente.";
    if (
      formData.cupoCredito &&
      isNaN(parseFloat(formData.cupoCredito))
    ) {
      newErrors.cupoCredito = "El cupo debe ser un número válido.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // ✅ Payload exacto que espera el backend
      const payload = {
        idTipoDocumento: parseInt(formData.idTipoDocumento),
        numeroDocumento: formData.numeroDocumento.trim(),
        razonSocial: formData.razonSocial.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        tipoCliente: formData.tipoCliente,
        cupoCredito: formData.cupoCredito
          ? parseFloat(formData.cupoCredito)
          : 0,
        idZona: formData.idZona ? parseInt(formData.idZona) : null,
      };

      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        setErrors({ general: "Sesión expirada. Inicia sesión nuevamente." });
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setErrors({
          general: errData?.message || `Error del servidor: ${response.status}`,
        });
        return;
      }

      // ✅ Éxito: notifica al padre con el nombre real del cliente
      onSuccess(formData.razonSocial.trim());
    } catch (err) {
      setErrors({ general: "No se pudo conectar con el servidor." });
      console.error("CustomerForm submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Error general */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {errors.general}
        </div>
      )}

      {/* ── SECCIÓN 1: Identificación ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider">
          <UserPlus size={16} />
          Identificación
        </div>

        {/* Razón Social — campo principal */}
        <div className="space-y-2">
          <Label htmlFor="razonSocial">
            Razón Social / Nombre Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="razonSocial"
            value={formData.razonSocial}
            onChange={(e) => handleChange("razonSocial", e.target.value)}
            placeholder="Ej: Repuestos y Motores El Chispazo S.A.S."
            className={errors.razonSocial ? "border-red-400 focus:ring-red-300" : ""}
          />
          {errors.razonSocial && (
            <p className="text-red-500 text-xs">{errors.razonSocial}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <div className="space-y-2">
            <Label>
              Tipo de Documento <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.idTipoDocumento}
              onValueChange={(value) => handleChange("idTipoDocumento", value)}
            >
              <SelectTrigger className={errors.idTipoDocumento ? "border-red-400" : ""}>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {/* ✅ Los IDs deben coincidir con los de tu tabla tipo_documento */}
                <SelectItem value="1">C.C. — Cédula de Ciudadanía</SelectItem>
                <SelectItem value="2">NIT — Número de Identificación Tributaria</SelectItem>
                <SelectItem value="3">C.E. — Cédula de Extranjería</SelectItem>
              </SelectContent>
            </Select>
            {errors.idTipoDocumento && (
              <p className="text-red-500 text-xs">{errors.idTipoDocumento}</p>
            )}
          </div>

          {/* Número de Documento */}
          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">
              Número de Documento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={(e) => handleChange("numeroDocumento", e.target.value)}
              placeholder="Ej: 1020304050"
              className={errors.numeroDocumento ? "border-red-400" : ""}
            />
            {errors.numeroDocumento && (
              <p className="text-red-500 text-xs">{errors.numeroDocumento}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* ── SECCIÓN 2: Contacto ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
          <MapPin size={16} />
          Contacto y Ubicación
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contacto@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="Ej: 3159876543"
              className={errors.telefono ? "border-red-400" : ""}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs">{errors.telefono}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            placeholder="Ej: Calle 45 # 12 - 30, Barrio Central"
          />
        </div>
      </div>

      <Separator />

      {/* ── SECCIÓN 3: Comercial ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
          <CreditCard size={16} />
          Información Comercial
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Cliente */}
          <div className="space-y-2">
            <Label>
              Tipo de Cliente <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.tipoCliente}
              onValueChange={(value) => handleChange("tipoCliente", value)}
            >
              <SelectTrigger className={errors.tipoCliente ? "border-red-400" : ""}>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mayorista">Mayorista</SelectItem>
                <SelectItem value="Minorista">Minorista</SelectItem>
                <SelectItem value="Distribuidor">Distribuidor</SelectItem>
                <SelectItem value="Corporativo">Corporativo</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoCliente && (
              <p className="text-red-500 text-xs">{errors.tipoCliente}</p>
            )}
          </div>

          {/* Cupo de Crédito */}
          <div className="space-y-2">
            <Label htmlFor="cupoCredito">Cupo de Crédito (COP)</Label>
            <Input
              id="cupoCredito"
              type="number"
              min="0"
              step="0.01"
              value={formData.cupoCredito}
              onChange={(e) => handleChange("cupoCredito", e.target.value)}
              placeholder="Ej: 5500.50"
              className={errors.cupoCredito ? "border-red-400" : ""}
            />
            {errors.cupoCredito && (
              <p className="text-red-500 text-xs">{errors.cupoCredito}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── ACCIONES ── */}
      <div className="flex gap-3 pt-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-32"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="w-48 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
        >
          {loading ? "Guardando..." : "Registrar Cliente"}
        </Button>
      </div>
    </form>
  );
}