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
import { Loader2, MapPin, CheckCircle2, Plus, Trash2, Users } from "lucide-react";

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
  listaClientes = [], // <--- Nueva prop necesaria
  onSaveSuccess,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSaveSuccess(false);
      // Inicializar detalles si no existen
      if (!formData.detalles) {
        onSelectChange("detalles", []);
      }
    }
  }, [isOpen]);

  const addClienteALista = () => {
    if (!selectedCliente) return;
    
    const clienteObj = listaClientes.find(c => String(c.idCliente) === String(selectedCliente));
    if (!clienteObj) return;

    // Evitar duplicados en la misma ruta
    if (formData.detalles?.some(d => d.idCliente === clienteObj.idCliente)) return;

    const nuevosDetalles = [
      ...(formData.detalles || []),
      { 
        idCliente: clienteObj.idCliente, 
        nombreCliente: clienteObj.razonSocial || `${clienteObj.nombre || ''} ${clienteObj.apellido || ''}`.trim() || 'Cliente Sin Nombre',
        idPedido: null // Opcional por ahora
      }
    ];

    onSelectChange("detalles", nuevosDetalles);
    setSelectedCliente("");
  };

  const removeCliente = (idCliente) => {
    const filtrados = formData.detalles.filter(d => d.idCliente !== idCliente);
    onSelectChange("detalles", filtrados);
  };

  const handleSubmit = async () => {
    const result = await onSubmit();
    if (result !== false) {
      setSaveSuccess(true);
      const registeredName = formData.nombreRuta || "Nueva Ruta";
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          if (onSaveSuccess) onSaveSuccess(registeredName);
          setTimeout(() => setSaveSuccess(false), 4500);
        }, 300);
      }, 800);
    }
  };

  const isFormValid =
    formData.nombreRuta?.trim() &&
    formData.idZona &&
    formData.idEmpleado &&
    formData.fechaPlanificada &&
    formData.detalles?.length > 0; // Obligatorio al menos 1 cliente

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100">
          <DialogHeader className="px-7 pt-6 pb-5">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-[#0f172a] text-xl font-bold">Planificar Ruta</DialogTitle>
                <p className="text-sm text-slate-500 mt-0.5 font-normal">Define la ruta y asigna los clientes a visitar</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-7 py-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 gap-5">
          {/* Datos Maestros */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nombre de la Ruta *</Label>
              <Input name="nombreRuta" value={formData.nombreRuta || ""} onChange={onInputChange} placeholder="Ej: Ruta Norte" className="rounded-xl" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Zona *</Label>
              <Select value={formData.idZona?.toString()} onValueChange={(val) => onSelectChange("idZona", val)}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Zona" /></SelectTrigger>
                <SelectContent>
                  {listaZonas.map(z => <SelectItem key={z.idZona} value={z.idZona.toString()}>{z.nombreZona}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Fecha *</Label>
              <Input name="fechaPlanificada" type="date" value={formData.fechaPlanificada || ""} onChange={onInputChange} className="rounded-xl" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">Transportista Asignado *</Label>
            <Select value={formData.idEmpleado?.toString()} onValueChange={(val) => onSelectChange("idEmpleado", val)}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Seleccionar empleado" /></SelectTrigger>
              <SelectContent>
                {listaEmpleados.map(e => <SelectItem key={e.idEmpleado} value={e.idEmpleado.toString()}>{e.nombre} {e.apellido}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Sección de Clientes/Visitas */}
          <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-blue-600" /> Clientes en la Ruta ({formData.detalles?.length || 0})
            </Label>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <Select value={selectedCliente} onValueChange={(val) => {
                  setSelectedCliente(val);
                  // Auto-add client when selected to prevent the user from forgetting to press '+'
                  setTimeout(() => {
                    document.getElementById('add-client-btn')?.click();
                  }, 100);
                }}>
                  <SelectTrigger className="bg-white rounded-xl">
                    <SelectValue placeholder="Buscar cliente para agregar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {listaClientes.map(c => (
                      <SelectItem key={c.idCliente} value={c.idCliente.toString()}>
                        {c.razonSocial || `${c.nombre || ''} ${c.apellido || ''}`.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button id="add-client-btn" type="button" onClick={addClienteALista} size="icon" className="bg-blue-600 rounded-xl hover:bg-blue-700 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Listado de paradas añadidas */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {formData.detalles?.length > 0 ? (
                formData.detalles.map((det, index) => (
                  <div key={det.idCliente} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{det.nombreCliente}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCliente(det.idCliente)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-4 italic">No hay clientes asignados a esta ruta todavía.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-7 pb-6 flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || saveSuccess || !isFormValid}
            className={`flex-1 h-[46px] rounded-xl font-semibold transition-all duration-300 ${
              saveSuccess ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {saveSuccess ? <><CheckCircle2 className="mr-2 h-5 w-5" /> Ruta Creada</> : 
             loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</> : "Crear Ruta Operativa"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 h-[46px] rounded-xl">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RouteCreateModal;