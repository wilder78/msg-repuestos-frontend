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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader2, Edit2, CheckCircle2, Map, MapPin, Calendar, User, AlertCircle, Users, Plus, Trash2 } from "lucide-react";

const RouteEditModal = ({
  isOpen,
  onClose,
  route,
  listaZonas = [],
  listaEmpleados = [],
  listaClientes = [],
  onSaveSuccess,
  authFetch,
}) => {
  const [formData, setFormData] = useState({
    nombreRuta: "",
    idZona: "",
    idEmpleado: "",
    fechaPlanificada: "",
    detalles: [],
  });
  const [selectedCliente, setSelectedCliente] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && route) {
      setSaveSuccess(false);
      setError(null);
      
      // Formatear la fecha para el input type date (YYYY-MM-DD)
      let formattedDate = "";
      if (route.fechaPlanificada) {
        try {
          formattedDate = new Date(route.fechaPlanificada).toISOString().split('T')[0];
        } catch {
          formattedDate = route.fechaPlanificada.split('T')[0];
        }
      }

      setFormData({
        nombreRuta: route.nombreRuta || "",
        idZona: route.idZona?.toString() || "",
        idEmpleado: route.idEmpleado?.toString() || "",
        fechaPlanificada: formattedDate,
        detalles: route.detalles || [],
      });
    }
  }, [isOpen, route]);

  const addClienteALista = () => {
    if (!selectedCliente) return;
    
    const clienteObj = listaClientes.find(c => String(c.idCliente) === String(selectedCliente));
    if (!clienteObj) return;

    if (formData.detalles?.some(d => d.idCliente === clienteObj.idCliente)) return;

    const nuevosDetalles = [
      ...(formData.detalles || []),
      { 
        idCliente: clienteObj.idCliente, 
        nombreCliente: clienteObj.razonSocial || `${clienteObj.nombre || ''} ${clienteObj.apellido || ''}`.trim() || 'Cliente Sin Nombre',
        idPedido: null
      }
    ];

    setFormData(prev => ({ ...prev, detalles: nuevosDetalles }));
    setSelectedCliente("");
  };

  const removeCliente = (idCliente) => {
    const filtrados = formData.detalles.filter(d => d.idCliente !== idCliente);
    setFormData(prev => ({ ...prev, detalles: filtrados }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    if (!route || !formData) return false;
    
    let formattedDate = "";
    if (route.fechaPlanificada) {
      try {
        formattedDate = new Date(route.fechaPlanificada).toISOString().split('T')[0];
      } catch {
        formattedDate = route.fechaPlanificada.split('T')[0];
      }
    }

    const detallesOriginales = JSON.stringify((route.detalles || []).map(d => d.idCliente).sort());
    const detallesNuevos = JSON.stringify((formData.detalles || []).map(d => d.idCliente).sort());

    return (
      (formData.nombreRuta || "").trim() !== (route.nombreRuta || "").trim() ||
      formData.idZona !== (route.idZona?.toString() || "") ||
      formData.idEmpleado !== (route.idEmpleado?.toString() || "") ||
      formData.fechaPlanificada !== formattedDate ||
      detallesOriginales !== detallesNuevos
    );
  };

const handleSubmit = async () => {
  if (!route?.idRuta) return;

  setLoading(true);
  setError(null);

  try {
    // Formatear detalles con solo los campos que necesita el backend
    const detallesFormateados = (formData.detalles || []).map((d) => ({
      idCliente: d.idCliente,
      idPedido:  d.idPedido  || null,
      estadoVisita: d.estadoVisita || "Pendiente",
    }));

    const payload = {
      nombreRuta:       formData.nombreRuta,
      idZona:           parseInt(formData.idZona),
      idEmpleado:       parseInt(formData.idEmpleado),
      fechaPlanificada: formData.fechaPlanificada,
      idEstadoRuta:     route.idEstadoRuta || 1,
      detalles:         detallesFormateados, // ✅ ahora se envía limpio
    };

    const response = await authFetch(
      `http://localhost:8080/api/rutas/${route.idRuta}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "No se pudo actualizar la ruta");
    }

    setSaveSuccess(true);
    const registeredName = formData.nombreRuta || "Ruta Editada";

    setTimeout(() => {
      onClose();
      setTimeout(() => {
        if (onSaveSuccess) onSaveSuccess(registeredName);
        setTimeout(() => setSaveSuccess(false), 500);
      }, 300);
    }, 800);

  } catch (err) {
    console.error(err);
    setError(err.message || "Ocurrió un error al intentar guardar los cambios.");
  } finally {
    setLoading(false);
  }
};

  const isFormValid =
    formData.nombreRuta?.trim() &&
    formData.idZona &&
    formData.idEmpleado &&
    formData.fechaPlanificada &&
    formData.detalles?.length > 0;

  // Evitar renderizados raros si no hay ruta seleccionada
  if (!route && isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Ruta
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Modifica la información y asignación de la ruta
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Form ── */}
        <div className="px-6 py-5 space-y-5 bg-white max-h-[65vh] overflow-y-auto">
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Map className="h-4 w-4 text-blue-500" /> Nombre de la Ruta
              </label>
              <Input
                name="nombreRuta"
                value={formData.nombreRuta}
                onChange={handleInputChange}
                placeholder="Ej: Ruta Norte - Comercial"
                className="focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="h-4 w-4 text-emerald-500" /> Zona Operativa
              </label>
              <Select
                value={formData.idZona}
                onValueChange={(val) => handleSelectChange("idZona", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una zona" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#fff" }}>
                  {listaZonas.map((zona) => (
                    <SelectItem key={zona.idZona} value={zona.idZona.toString()}>
                      {zona.nombreZona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-violet-500" /> Fecha Planificada
              </label>
              <Input
                name="fechaPlanificada"
                type="date"
                value={formData.fechaPlanificada}
                onChange={handleInputChange}
                className="focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="h-4 w-4 text-amber-500" /> Empleado Asignado
              </label>
              <Select
                value={formData.idEmpleado}
                onValueChange={(val) => handleSelectChange("idEmpleado", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#fff" }}>
                  {listaEmpleados.map((emp) => (
                    <SelectItem key={emp.idEmpleado} value={emp.idEmpleado.toString()}>
                      {emp.nombre} {emp.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sección de Clientes/Visitas */}
          <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-blue-600" /> Clientes en la Ruta ({formData.detalles?.length || 0})
            </label>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <Select value={selectedCliente} onValueChange={(val) => {
                  setSelectedCliente(val);
                  setTimeout(() => {
                    document.getElementById('edit-add-client-btn')?.click();
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
              <Button id="edit-add-client-btn" type="button" onClick={addClienteALista} size="icon" className="bg-blue-600 rounded-xl hover:bg-blue-700 shrink-0">
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
                      <span className="text-sm font-medium text-slate-700">
                        {det.cliente?.razonSocial || det.nombreCliente || `Cliente #${det.idCliente}`}
                      </span>
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || saveSuccess || !isFormValid || !hasChanges()}
            className={`flex-1 font-semibold ${
              saveSuccess ? "bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Guardando..." : saveSuccess ? "Actualizado" : "Guardar Cambios"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RouteEditModal;
