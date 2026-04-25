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
import { Loader2, Edit2, CheckCircle2, Map, MapPin, Calendar, User, AlertCircle } from "lucide-react";

const RouteEditModal = ({
  isOpen,
  onClose,
  route,
  listaZonas = [],
  listaEmpleados = [],
  onSaveSuccess,
  authFetch,
}) => {
  const [formData, setFormData] = useState({
    nombreRuta: "",
    idZona: "",
    idEmpleado: "",
    fechaPlanificada: "",
  });
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
      });
    }
  }, [isOpen, route]);

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

    return (
      (formData.nombreRuta || "").trim() !== (route.nombreRuta || "").trim() ||
      formData.idZona !== (route.idZona?.toString() || "") ||
      formData.idEmpleado !== (route.idEmpleado?.toString() || "") ||
      formData.fechaPlanificada !== formattedDate
    );
  };

  const handleSubmit = async () => {
    if (!route?.idRuta) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        idZona: parseInt(formData.idZona),
        idEmpleado: parseInt(formData.idEmpleado),
        idEstadoRuta: route.idEstadoRuta || route.idEstado || 1, 
      };

      const response = await authFetch(`http://localhost:8080/api/rutas/${route.idRuta}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar la ruta");
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
      setError("Ocurrió un error al intentar guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.nombreRuta?.trim() &&
    formData.idZona &&
    formData.idEmpleado &&
    formData.fechaPlanificada;

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
