import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import {
  UserCog,
  CreditCard,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Building2,
  Edit2,
} from "lucide-react";

/**
 * Componente para editar los datos de un cliente existente.
 * Restablecido al estilo premium original con layout de 3 columnas.
 */
const CustomerEditModal = ({ isOpen, onClose, cliente, onCustomerUpdated }) => {
  const [formData, setFormData] = useState({
    idTipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    personaContacto: "",
    direccion: "",
    telefono: "",
    email: "",
    tipoCliente: "",
    cupoCredito: "",
    idZona: "",
    idEstado: 1,
  });

  const [zonas, setZonas] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 1. Carga de zonas
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/zonas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setZonas(Array.isArray(data) ? data : (data.data || []));
        }
      } catch (err) {
        console.error("Error al cargar zonas:", err);
      }
    };
    if (isOpen) fetchZonas();
  }, [isOpen]);

  // 2. Sincronizar con el prop 'cliente' (DEPURADO)
  useEffect(() => {
    if (isOpen && cliente) {
      const initialValues = {
        idTipoDocumento: (cliente.idTipoDocumento || 1).toString(),
        numeroDocumento: cliente.numeroDocumento || "",
        razonSocial: cliente.razonSocial || "",
        personaContacto: cliente.personaContacto || "",
        direccion: cliente.direccion || "",
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        tipoCliente: cliente.tipoCliente || "Mayorista",
        cupoCredito: cliente.cupoCredito?.toString() || "0",
        idZona: (cliente.idZona || "").toString(),
        idEstado: cliente.idEstado !== undefined ? cliente.idEstado : (cliente.activo ? 1 : 0),
      };
      setFormData(initialValues);
      setInitialData(initialValues);
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, cliente]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const clientId = cliente.idCliente || cliente.id;
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const payload = {
        idTipoDocumento: parseInt(formData.idTipoDocumento),
        numeroDocumento: formData.numeroDocumento,
        razonSocial: formData.razonSocial.trim(),
        personaContacto: formData.personaContacto?.trim() || null,
        direccion: formData.direccion?.trim() || "",
        telefono: formData.telefono?.trim() || "",
        email: formData.email?.trim() || null,
        tipoCliente: formData.tipoCliente,
        cupoCredito: parseFloat(formData.cupoCredito) || 0,
        idZona: formData.idZona ? parseInt(formData.idZona) : null,
        idEstado: parseInt(formData.idEstado),
      };

      const response = await fetch(`http://localhost:8080/api/customers/${clientId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el cliente.");
      }

      setSaveSuccess(true);
      if (onCustomerUpdated) onCustomerUpdated({ ...cliente, ...payload });

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!initialData || !formData) return false;
    
    // Comparación campo por campo para asegurar tipos correctos
    return (
      formData.idTipoDocumento !== initialData.idTipoDocumento ||
      formData.numeroDocumento !== initialData.numeroDocumento ||
      formData.razonSocial.trim() !== initialData.razonSocial ||
      formData.personaContacto.trim() !== initialData.personaContacto ||
      formData.direccion.trim() !== initialData.direccion ||
      formData.telefono.trim() !== initialData.telefono ||
      formData.email.trim() !== initialData.email ||
      formData.tipoCliente !== initialData.tipoCliente ||
      formData.cupoCredito !== initialData.cupoCredito ||
      formData.idZona !== initialData.idZona ||
      formData.idEstado.toString() !== initialData.idEstado.toString()
    );
  };

  const isFormValid = formData.razonSocial?.trim() !== "" && formData.telefono?.trim() !== "";
  const canSave = isFormValid && hasChanges();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[1000px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header Estilo Premium ── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Información del Cliente
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm mt-0.5">
                  Modifica los detalles comerciales o logísticos. El número de identidad es solo de lectura.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-7 py-5 space-y-6">
            {/* SECCIÓN 1: Identificación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
                <UserCog size={16} />
                Identificación Legal
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Razón Social <span className="text-blue-500">*</span></Label>
                  <Input
                    value={formData.razonSocial}
                    onChange={(e) => handleChange("razonSocial", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-400 italic">Tipo de Documento</Label>
                  <Input
                    value={cliente.tipoDocumento?.descripcion || "Documento"}
                    readOnly
                    disabled
                    className="h-[42px] rounded-xl border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-400 italic">Número de Identidad</Label>
                  <Input
                    value={formData.numeroDocumento}
                    readOnly
                    disabled
                    className="h-[42px] rounded-xl border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* SECCIÓN 2: Contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                <MapPin size={16} />
                Contacto y Ubicación
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Persona de Contacto</Label>
                  <Input
                    value={formData.personaContacto}
                    onChange={(e) => handleChange("personaContacto", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Teléfono <span className="text-blue-500">*</span></Label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5 font-medium md:col-span-3">
                  <Label className="text-xs font-semibold text-slate-700">Dirección</Label>
                  <Input
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* SECCIÓN 3: Comercial */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                <CreditCard size={16} />
                Información Comercial
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Segmento</Label>
                  <Select
                    value={formData.tipoCliente}
                    onValueChange={(val) => handleChange("tipoCliente", val)}
                  >
                    <SelectTrigger className="h-[42px] rounded-xl border-slate-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mayorista">Mayorista</SelectItem>
                      <SelectItem value="Minorista">Minorista</SelectItem>
                      <SelectItem value="Distribuidor">Distribuidor</SelectItem>
                      <SelectItem value="Corporativo">Corporativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Zona de Despacho</Label>
                  <Select
                    value={formData.idZona}
                    onValueChange={(val) => handleChange("idZona", val)}
                  >
                    <SelectTrigger className="h-[42px] rounded-xl border-slate-200 focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar zona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zonas.map((z) => (
                        <SelectItem key={z.idZona} value={z.idZona.toString()}>
                          {z.nombreZona}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 font-medium">
                  <Label className="text-xs font-semibold text-slate-700">Cupo de Crédito (COP)</Label>
                  <Input
                    type="number"
                    value={formData.cupoCredito}
                    onChange={(e) => handleChange("cupoCredito", e.target.value)}
                    className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="mx-7 h-px bg-slate-100 mb-5" />

          <DialogFooter className="px-7 pb-8 flex gap-3">
            <Button
              type="submit"
              disabled={isSaving || saveSuccess || !canSave}
              className={`flex-1 h-[46px] rounded-xl font-bold transition-all duration-300 ${
                saveSuccess
                  ? "bg-emerald-500 text-white shadow-none"
                  : !canSave
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border-0"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] active:scale-95"
              }`}
            >
              {saveSuccess ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> ¡Actualizado!</>
              ) : isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerEditModal;