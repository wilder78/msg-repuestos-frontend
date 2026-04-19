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
  AlertCircle
} from "lucide-react";

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
      setError("Error al guardar cambios. Verifique la consola o sus permisos.");
    }
  };

  // Detecta si hay cambios en los campos editables
  const hasChanges = () => {
    if (!usuario || !formData) return false;
    
    const nombreActual = (formData.nombreUsuario || "").trim();
    const emailActual = (formData.email || "").trim();
    const rolActual = formData.id_rol?.toString() || "";

    return (
      nombreActual !== (usuario.nombreUsuario || "").trim() ||
      emailActual !== (usuario.email || "").trim() ||
      rolActual !== (usuario.id_rol?.toString() || "")
    );
  };

  // ✅ NUEVO: Función para desasignar permisos (Evita el error 404 enviando IDs en la URL)
  const handleRevokePermission = async (idPermiso) => {
    try {
      const idRol = formData.id_rol; 
      // El backend ahora espera: DELETE /api/role-permissions/:idRol/:idPermiso
      const response = await fetch(`http://localhost:8080/api/role-permissions/${idRol}/${idPermiso}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("No se pudo revocar el permiso");
      
      // Aquí deberías refrescar la lista de permisos en el componente padre
      console.log("Permiso revocado con éxito");
    } catch (err) {
      setError(err.message);
    }
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
                  Modifica la información y cargo del usuario
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
              <p className="text-base font-bold text-gray-900">{usuario.nombreUsuario}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-gray-500">
                  ID: #{usuario.idUsuario?.toString().padStart(4, "0")}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="h-4 w-4 text-blue-500" /> Nombre Usuario
              </label>
              <Input
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={onInputChange}
                className="focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail className="h-4 w-4 text-emerald-500" /> Correo Electrónico
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ShieldCheck className="h-4 w-4 text-violet-500" /> Cargo
              </label>
              <Select
                value={formData.id_rol?.toString()}
                onValueChange={(val) => onSelectChange("id_rol", val)}
                disabled={usuario.idUsuario === 1}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar cargo" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#fff" }}>
                  {listaRoles.map((rol) => (
                    <SelectItem key={rol.idRol} value={rol.idRol.toString()}>
                      {rol.nombreRol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {usuario.idUsuario === 1 && (
                <p className="text-[10px] text-amber-600 font-medium mt-1">
                  El rol Master está protegido y no puede ser modificado.
                </p>
              )}
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            onClick={handleSave}
            disabled={loading || saveSuccess || !hasChanges()}
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

export default UserEditModal;