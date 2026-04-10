import React from "react";
import { CheckCircle2, X } from "lucide-react";

const SuccessToast = ({ 
  visible, 
  title = "Registro exitoso", 
  message, 
  onClose 
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(-20px) scale(0.95)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl shadow-xl px-5 py-4 min-w-[320px] max-w-sm">
        <div className="p-2 bg-emerald-50 rounded-xl shrink-0">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">{title}</p>
          {message && (
            <p className="text-xs text-slate-500 mt-0.5">{message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 bg-emerald-100 rounded-b-2xl overflow-hidden -mt-1 mx-1">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{
            animation: visible ? "shrink 4s linear forwards" : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;