import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

const EstadoBadge = ({ usuario, onToggle, size = "default" }) => {
  const [hovered, setHovered] = useState(false);

  // Mejor manejo del estado: considera 1 como activo, cualquier otro valor como inactivo
  // Incluye validación para cuando usuario es null o undefined
  const isActivo = usuario?.idEstado === 1;

  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    default: "px-3 py-0.5 text-sm",
    large: "px-4 py-1 text-base",
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <Badge
        onClick={() => onToggle && onToggle(usuario)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          cursor-pointer select-none rounded-full border transition-all duration-200 font-medium
          ${sizeClasses[size]}
          ${
            isActivo
              ? hovered
                ? "bg-white text-emerald-700 border-emerald-700 shadow-md ring-2 ring-emerald-700/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
              : hovered
                ? "bg-white text-slate-600 border-slate-500 shadow-md ring-2 ring-slate-500/20"
                : "bg-slate-100 text-slate-500 border-slate-200 shadow-sm"
          }
        `}
      >
        {isActivo ? (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Activo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Inactivo</span>
          </div>
        )}
      </Badge>
    </div>
  );
};

export default EstadoBadge;
