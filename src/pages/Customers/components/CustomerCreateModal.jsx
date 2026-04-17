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
import { UserPlus, CreditCard, MapPin, Loader2 } from "lucide-react";

// ✅ Estado inicial alineado con la estructura real del backend
const INITIAL_FORM = {
  idTipoDocumento: "",
  numeroDocumento: "",
  razonSocial: "",
  personaContacto: "", // ✅ NUEVO CAMPO
  direccion: "",
  telefono: "",
  email: "",
  tipoCliente: "",
  cupoCredito: "",
  idZona: "",
};

export function CustomerForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [zonas, setZonas] = useState([]); // ✅ NUEVO ESTADO PARA ZONAS
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ CARGA DE ZONAS AL INICIAR
  React.useEffect(() => {
    const fetchZonas = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/zonas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // ✅ VALIDACIÓN: Asegurar que los datos sean un array
          setZonas(Array.isArray(data) ? data : (data.data || []));
        }
      } catch (err) {
        console.error("Error al cargar zonas:", err);
      }
    };
    fetchZonas();
  }, []);

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
        personaContacto: formData.personaContacto.trim() || null, 
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        tipoCliente: formData.tipoCliente,
        cupoCredito: formData.cupoCredito
          ? parseFloat(formData.cupoCredito)
          : 0,
        idZona: formData.idZona ? parseInt(formData.idZona) : null,
        idEstado: 1,
        fechaRegistro: new Date().toISOString(),
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

  // ✅ Validación para habilitar el botón de envío
  const isFormComplete =
    formData.razonSocial.trim() !== "" &&
    formData.idTipoDocumento !== "" &&
    formData.numeroDocumento.trim() !== "" &&
    formData.telefono.trim() !== "" &&
    formData.tipoCliente !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error general */}
      {errors.general && (
        <div className="mx-7 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
          ⚠️ {errors.general}
        </div>
      )}

      <div className="px-7 py-2 space-y-7">
        {/* ── SECCIÓN 1: Identificación ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
            <UserPlus size={16} />
            Identificación Legal
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Razón Social — campo principal */}
            <div className="space-y-1.5 font-medium md:col-span-1">
              <Label className="text-xs font-semibold text-slate-700">
                Razón Social / Nombre Completo <span className="text-emerald-500">*</span>
              </Label>
              <Input
                id="razonSocial"
                value={formData.razonSocial}
                onChange={(e) => handleChange("razonSocial", e.target.value)}
                placeholder="Ej: Repuestos y Accesorios S.A.S."
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.razonSocial ? "border-red-400" : ""}`}
              />
              {errors.razonSocial && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.razonSocial}</p>
              )}
            </div>

            {/* Tipo de Documento */}
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">
                Tipo de Documento <span className="text-emerald-500">*</span>
              </Label>
              <Select
                value={formData.idTipoDocumento}
                onValueChange={(value) => handleChange("idTipoDocumento", value)}
              >
                <SelectTrigger className={`h-[42px] rounded-xl border-slate-200 focus:ring-emerald-500 ${errors.idTipoDocumento ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="1">C.C. — Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="2">NIT — Número de Identificación Tributaria</SelectItem>
                  <SelectItem value="3">C.E. — Cédula de Extranjería</SelectItem>
                </SelectContent>
              </Select>
              {errors.idTipoDocumento && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.idTipoDocumento}</p>
              )}
            </div>

            {/* Número de Documento */}
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">
                Número de Documento <span className="text-emerald-500">*</span>
              </Label>
              <Input
                id="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={(e) => handleChange("numeroDocumento", e.target.value)}
                placeholder="Ej: 1020304050"
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.numeroDocumento ? "border-red-400" : ""}`}
              />
              {errors.numeroDocumento && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.numeroDocumento}</p>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* ── SECCIÓN 2: Contacto ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
            <MapPin size={16} />
            Contacto y Ubicación
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">Persona de Contacto</Label>
              <Input
                id="personaContacto"
                value={formData.personaContacto}
                onChange={(e) => handleChange("personaContacto", e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contacto@empresa.com"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">
                Teléfono <span className="text-emerald-500">*</span>
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="Ej: 3159876543"
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.telefono ? "border-red-400" : ""}`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.telefono}</p>
              )}
            </div>
            
            <div className="space-y-1.5 font-medium md:col-span-3">
              <Label className="text-xs font-semibold text-slate-700">Dirección Residencial/Comercial</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                placeholder="Ej: Calle 45 # 12 - 30, Barrio Central"
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* ── SECCIÓN 3: Comercial ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
            <CreditCard size={16} />
            Información Comercial
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tipo de Cliente */}
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">
                Segmento de Cliente <span className="text-emerald-500">*</span>
              </Label>
              <Select
                value={formData.tipoCliente}
                onValueChange={(value) => handleChange("tipoCliente", value)}
              >
                <SelectTrigger className={`h-[42px] rounded-xl border-slate-200 focus:ring-emerald-500 ${errors.tipoCliente ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="Mayorista">Mayorista</SelectItem>
                  <SelectItem value="Minorista">Minorista</SelectItem>
                  <SelectItem value="Distribuidor">Distribuidor</SelectItem>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoCliente && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.tipoCliente}</p>
              )}
            </div>

            {/* Zona de Despacho */}
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">Zona de Despacho</Label>
              <Select
                value={formData.idZona}
                onValueChange={(value) => handleChange("idZona", value)}
              >
                <SelectTrigger className="h-[42px] rounded-xl border-slate-200 focus:ring-emerald-500">
                  <SelectValue placeholder="Seleccionar zona..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                {zonas.length > 0 ? (
                  zonas.map((z) => (
                    <SelectItem key={z.idZona} value={z.idZona.toString()}>
                      {z.nombreZona}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No hay zonas disponibles</SelectItem>
                )}
                </SelectContent>
              </Select>
            </div>

            {/* Cupo de Crédito */}
            <div className="space-y-1.5 font-medium">
              <Label className="text-xs font-semibold text-slate-700">Cupo de Crédito (COP)</Label>
              <Input
                id="cupoCredito"
                type="number"
                min="0"
                step="0.01"
                value={formData.cupoCredito}
                onChange={(e) => handleChange("cupoCredito", e.target.value)}
                placeholder="Ej: 5500.50"
                className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-emerald-500 ${errors.cupoCredito ? "border-red-400" : ""}`}
              />
              {errors.cupoCredito && (
                <p className="text-red-500 text-[10px] font-medium ml-1">{errors.cupoCredito}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-7 h-px bg-slate-100 mb-2" />

      {/* ── ACCIONES ── */}
      <div className="px-7 pb-8 flex gap-3 sm:gap-3 mt-4">
        <Button
          type="submit"
          disabled={loading || !isFormComplete}
          className={`flex-1 h-[46px] rounded-xl font-bold transition-all duration-300 ${
            !isFormComplete
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] active:scale-95"
          }`}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
          ) : (
            "Registrar Cliente"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}