import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";

const TableToolbar = ({ 
  title, 
  count, 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar..." 
}) => {
  return (
    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      {/* Título y Contador */}
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-slate-700">{title}</h2>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
          {count} registrados
        </span>
      </div>

      {/* Input de Búsqueda */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder={placeholder}
          className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TableToolbar;