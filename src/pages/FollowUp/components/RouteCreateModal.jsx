import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";

const RouteCreateModal = ({
  isOpen,
  onClose,
  formData = {},
  onInputChange,
  onSelectChange,
  onSubmit,
  loading,
  listaZonas = [],
  listaEmpleados = [],
  onSaveSuccess,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const result = await onSubmit();

    if (result !== false) {
      setSaveSuccess(true);
      const registeredName = formData.nombreRuta || "Nueva Ruta";

      setTimeout(() => {
        onClose();

        setTimeout(() => {
          if (onSaveSuccess) onSaveSuccess(registeredName);

          setTimeout(() => {
            setSaveSuccess(false);
          }, 4500);
        }, 300);
      }, 800);
    }
  };

  const isFormValid =
    formData.nombreRuta?.trim() &&
    formData.idZona &&
    formData.idEmpleado &&
    formData.fechaPlanificada;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100">
          <DialogHeader className="px-7 pt-6 pb-5">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-[#0f172a] text-xl font-bold">
                  Crear Nueva Ruta
                </DialogTitle>
                <p className="text-sm text-slate-500 mt-0.5 font-normal">
                  Completa la información para planificar una nueva ruta operativa
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Form ── */}
        <div className="px-7 py-6 grid grid-cols-1 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Nombre de la Ruta <span className="text-blue-600">*</span>
            </Label>
            <Input
              name="nombreRuta"
              value={formData.nombreRuta || ""}
              onChange={onInputChange}
              placeholder="Ej: Ruta Norte - Comercial"
              className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Zona Operativa <span className="text-blue-600">*</span>
              </Label>
              <Select
                value={
                  formData.idZona != null && formData.idZona !== ""
                    ? formData.idZona.toString()
                    : undefined
                }
                onValueChange={(val) => onSelectChange("idZona", val)}
              >
                <SelectTrigger
                  className="h-[42px] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 data-[state=open]:ring-2 data-[state=open]:ring-blue-500"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor:
                      formData.idZona != null && formData.idZona !== ""
                        ? "#3b82f6"
                        : "#e2e8f0",
                    boxShadow: "none",
                  }}
                >
                  <SelectValue placeholder="Selecciona una zona" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                  }}
                >
                  {listaZonas.map((zona) => (
                    <SelectItem
                      key={zona.idZona}
                      value={zona.idZona.toString()}
                      className="focus:bg-blue-50 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700"
                      style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eff6ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffffff")
                      }
                    >
                      {zona.nombreZona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Fecha Planificada <span className="text-blue-600">*</span>
              </Label>
              <Input
                name="fechaPlanificada"
                type="date"
                value={formData.fechaPlanificada || ""}
                onChange={onInputChange}
                className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Empleado Asignado <span className="text-blue-600">*</span>
            </Label>
            <Select
              value={
                formData.idEmpleado != null && formData.idEmpleado !== ""
                  ? formData.idEmpleado.toString()
                  : undefined
              }
              onValueChange={(val) => onSelectChange("idEmpleado", val)}
            >
              <SelectTrigger
                className="h-[42px] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 data-[state=open]:ring-2 data-[state=open]:ring-blue-500"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor:
                    formData.idEmpleado != null && formData.idEmpleado !== ""
                      ? "#3b82f6"
                      : "#e2e8f0",
                  boxShadow: "none",
                }}
              >
                <SelectValue placeholder="Selecciona un empleado" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: "#e2e8f0",
                }}
              >
                {listaEmpleados.map((emp) => (
                  <SelectItem
                    key={emp.idEmpleado}
                    value={emp.idEmpleado.toString()}
                    className="focus:bg-blue-50 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700"
                    style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#eff6ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffffff")
                    }
                  >
                    {emp.nombre} {emp.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-5" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || saveSuccess || !isFormValid}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
              saveSuccess
                ? "bg-emerald-500 shadow-none text-white hover:bg-emerald-600"
                : loading || !isFormValid
                ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none hover:bg-slate-300"
                : "bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] text-white"
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Ruta Creada
              </>
            ) : loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...
              </>
            ) : (
              "Crear Ruta"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || saveSuccess}
            className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RouteCreateModal;
