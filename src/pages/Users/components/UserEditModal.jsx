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
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  X,
  Edit2,
  User,
  Mail,
  ShieldCheck,
  Briefcase,
  Save,
  Power,
  AlertCircle,
} from "lucide-react";
import InfoCard from "./InfoCard";

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
}) => {
  if (!usuario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[580px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header con gradiente - MISMO ESTILO QUE VER DETALLES */}
        <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Cambiado a verde esmeralda como en el original */}
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <Edit2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Editar Usuario
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm mt-1">
                    Modifica la información del usuario en el sistema
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Sección de Perfil Principal - MISMO ESTILO QUE VER DETALLES */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                <AvatarFallback
                  className={`${getAvatarColor(usuario.idUsuario)} text-white text-xl font-bold`}
                >
                  {getInitials(usuario.nombreUsuario)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {usuario.nombreUsuario}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-sm text-slate-600 font-medium">
                    ID: #{usuario.idUsuario.toString().padStart(4, "0")}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-xs text-slate-500">
                    {usuario.idCliente === null
                      ? "Personal Interno"
                      : "Cliente Asociado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario Organizado en InfoCards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Campo: Nombre */}
            <InfoCard icon={User} iconColor="blue" title="Nombre de usuario">
              <Input
                id="nombreUsuario"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={onInputChange}
                className="bg-white"
                placeholder="Nombre completo del usuario"
              />
            </InfoCard>

            {/* Campo: Email */}
            <InfoCard
              icon={Mail}
              iconColor="emerald"
              title="Correo electrónico"
            >
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                className="bg-white"
                placeholder="ejemplo@msgrepuestos.com"
              />
            </InfoCard>

            <div className="grid grid-cols-2 gap-4">
              {/* Campo: Rol */}
              <InfoCard
                icon={ShieldCheck}
                iconColor="violet"
                title="Rol asignado"
              >
                <Select
                  value={formData.id_rol}
                  onValueChange={(value) => onSelectChange("id_rol", value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {listaRoles.length === 0 ? (
                      <div className="p-2 text-center text-sm text-slate-500">
                        Cargando roles...
                      </div>
                    ) : (
                      listaRoles.map((rol) => (
                        <SelectItem
                          key={rol.idRol}
                          value={rol.idRol.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-violet-500" />
                            <span>{rol.nombreRol}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </InfoCard>
            </div>

            {/* Mensaje informativo - MISMO ESTILO QUE VER DETALLES */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Todos los campos son obligatorios. Los cambios se aplicarán
                  inmediatamente.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <DialogFooter className="p-6 bg-slate-50/80 border-t border-slate-200 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-white"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Guardando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
