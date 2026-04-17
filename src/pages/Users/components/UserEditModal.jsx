import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  Edit2, User, Mail, ShieldCheck, Briefcase,
  Save, AlertCircle, CheckCircle2,
} from "lucide-react";
// ✅ ELIMINADO: import SuccessToast — ya no vive aquí

const UserEditModal = ({
  isOpen,
  onClose,
  usuario,
  formData,
  listaRoles,
  onInputChange,
  onSelectChange,
  onSubmit,
  loading,
  getAvatarColor,
  getInitials,
  onSaveSuccess,
}) => {
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!usuario) return null;

  const handleSave = async () => {
    setError(null);
    const result = await onSubmit();

    if (result === true) {
      setSaveSuccess(true);
      const updatedName = formData.nombreUsuario;

      setTimeout(() => {
        onClose();

        setTimeout(() => {
          onSaveSuccess(updatedName); 

          setTimeout(() => {
            setSaveSuccess(false);
          }, 4500);
        }, 300);
      }, 800);
    } else {
      setError("No se pudieron guardar los cambios. Verifique su conexión o permisos.");
    }
  };

  // ✅ NUEVO: Lógica para detectar si hay cambios reales con protección contra nulos
  const hasChanges = () => {
    if (!usuario || !formData) return false;
    
    const nombreActual = (formData.nombreUsuario || "").trim();
    const emailActual = (formData.email || "").trim();
    const rolActual = formData.id_rol?.toString() || "";
    const estadoActual = formData.idEstado?.toString() || "1";

    return (
      nombreActual !== (usuario.nombreUsuario || "").trim() ||
      emailActual !== (usuario.email || "").trim() ||
      rolActual !== (usuario.id_rol?.toString() || "") ||
      estadoActual !== (usuario.idEstado?.toString() || "1")
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Editar Usuario
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm mt-0.5">
                  Modifica la informacion del usuario en el sistema
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5 bg-white max-h-[65vh] overflow-y-auto">
          {/* Perfil */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarFallback
                className={`${getAvatarColor(usuario.idUsuario)} text-white text-lg font-bold`}
              >
                {getInitials(usuario.nombreUsuario)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-bold text-gray-900">
                {usuario.nombreUsuario}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-gray-500">
                  ID: #{usuario.idUsuario?.toString().padStart(4, "0")}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {usuario.idCliente === null ? "Personal Interno" : "Cliente Asociado"}
              </p>
            </div>
          </div>

          {/* Campo: Nombre */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-blue-500" />
              Nombre Usuario <span className="text-red-500">*</span>
            </label>
            <Input
              id="nombreUsuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={onInputChange}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
              placeholder="Nombre completo del usuario"
            />
          </div>

          {/* Campo: Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail className="h-4 w-4 text-emerald-500" />
              Correo Electronico <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
              placeholder="ejemplo@msgrepuestos.com"
            />
          </div>

          {/* Campo: Rol */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ShieldCheck className="h-4 w-4 text-violet-500" />
              Cargo <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.id_rol}
              onValueChange={(value) => onSelectChange("id_rol", value)}
            >
              <SelectTrigger
                className="w-full border-gray-300 focus:border-emerald-400 focus:ring-emerald-400"
                style={{ backgroundColor: "#ffffff", color: "#111827" }}
              >
                <SelectValue placeholder="Seleccionar cargo" />
              </SelectTrigger>
              <SelectContent
                className="border-gray-200"
                style={{ backgroundColor: "#ffffff", color: "#111827" }}
              >
                {listaRoles.map((rol) => (
                  <SelectItem
                    key={rol.idRol}
                    value={rol.idRol.toString()}
                    className="text-gray-800 focus:bg-emerald-50 focus:text-emerald-700"
                    style={{ backgroundColor: "#ffffff", color: "#1f2937" }}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-violet-400" />
                      <span>{rol.nombreRol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aviso */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-xs text-blue-600">
              Todos los campos son obligatorios. Los cambios se aplicaran inmediatamente.
            </span>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            onClick={handleSave}
            disabled={loading || saveSuccess || !hasChanges()}
            className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
              saveSuccess 
                ? "bg-emerald-600" 
                : !hasChanges()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Guardando...
              </div>
            ) : saveSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Actualizado
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </div>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || saveSuccess}
            className="flex-1 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;