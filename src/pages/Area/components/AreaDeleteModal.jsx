import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

const AreaDeleteModal = ({ isOpen, onClose, zone, onConfirm, loading }) => {
  if (!zone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[420px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="bg-white px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Confirmar Inactivación
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Esta acción no eliminará la zona permanentemente.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-5 space-y-4 bg-white">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas inactivar la zona
                <span className="font-bold text-gray-900"> {zone.name}</span>?
              </p>
              <p className="text-xs text-gray-500 mt-1.5">
                La zona se marcará como inactiva y ya no estará disponible para uso activo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-red-600 text-sm font-bold">
                {zone.name
                  ?.trim()
                  .split(/\s+/)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{zone.name}</p>
              <p className="text-xs text-gray-400">{zone.description}</p>
            </div>
            <span className="ml-auto text-xs text-gray-400 font-medium">
              ID: #{zone.id?.toString().padStart(4, "0")}
            </span>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Inactivando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Inactivar Zona
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreaDeleteModal;
