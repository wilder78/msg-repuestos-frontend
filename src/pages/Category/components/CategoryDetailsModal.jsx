import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Tag, FileText, Hash, Info, Calendar } from "lucide-react";
import InfoCard from "../../Users/components/InfoCard";

const CategoryDetailsModal = ({ isOpen, onClose, categoria }) => {
  if (!categoria || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* ── Header Estilo Premium (Limpio) ── */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Detalles de la Categoría
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Información administrativa de la clasificación
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Perfil de la Categoría */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {categoria.nombre}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {categoria.descripcion || "Sin descripción asignada"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2.5 py-0.5 uppercase tracking-wide rounded-full font-semibold ${
                      categoria.statusId === 1
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {categoria.statusId === 1 ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-2 gap-4">
            {/* Información Técnica */}
            <InfoCard icon={Hash} iconColor="blue" title="Información Técnica">
              <div>
                <p className="text-xs text-slate-500 mb-1">ID de Categoría</p>
                <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                  #{categoria.id || "N/A"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Slug Interno</p>
                <p className="text-sm font-semibold text-slate-800">
                  cat_{categoria.nombre?.toLowerCase().replace(/\s+/g, "_")}
                </p>
              </div>
            </InfoCard>

            {/* Gestión */}
            <InfoCard icon={Info} iconColor="violet" title="Gestión">
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado Operativo</p>
                <p className={`text-sm font-bold ${categoria.statusId === 1 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {categoria.statusId === 1 ? "Habilitado para Inventario" : "Restringido / Inactivo"}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Productos Asociados</p>
                <p className="text-sm font-semibold text-slate-800">
                  Cálculo pendiente...
                </p>
              </div>
            </InfoCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailsModal;
