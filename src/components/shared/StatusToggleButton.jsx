import React, { useState } from "react";
import { Switch } from "../ui/switch";
import { Loader2 } from "lucide-react";

const StatusToggleButton = ({ 
  id, 
  currentStatus, 
  apiUrl, 
  onSuccess, 
  authFetch,
  fieldName = "id_estado" // Nombre del campo en el JSON (id_estado o activo)
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    // Definimos la lógica: si es 1 (activo) pasa a 2 (inactivo) o viceversa
    // Ajusta los números según tu base de datos (ej. 1 y 0)
    const nextStatus = currentStatus === 1 ? 2 : 1;
    
    setLoading(true);
    try {
      const res = await authFetch(`${apiUrl}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ [fieldName]: nextStatus }),
      });

      if (res.ok) {
        onSuccess(id, nextStatus);
      } else {
        console.error("Error al cambiar el estado");
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={currentStatus === 1}
        onCheckedChange={handleToggle}
        className={`${currentStatus === 1 ? 'bg-emerald-500' : 'bg-gray-300'}`}
      />
      <span className={`text-xs font-medium ${currentStatus === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
        {currentStatus === 1 ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
};

export default StatusToggleButton;