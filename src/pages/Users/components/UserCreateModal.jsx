import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader2, UserPlus, Upload, Image as ImageIcon } from "lucide-react";

const UserCreateModal = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  loading,
  listaRoles,
}) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(
      e.target.value !== formData.password
        ? "Las contraseñas no coinciden"
        : "",
    );
  };

  const handleSubmit = () => {
    if (formData.password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl gap-0"
        style={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
        }}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-6 pb-0">
          <div className="flex items-center gap-2.5 text-[#10b981]">
            <UserPlus className="h-5 w-5" />
            <DialogTitle className="text-[#0f172a] text-lg font-bold">
              Crear Nuevo Usuario
            </DialogTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Completa la información para crear un nuevo usuario en el sistema
          </p>
        </DialogHeader>

        {/* ── Avatar ── */}
        <div className="flex flex-col items-center gap-3 pt-5 pb-1 px-7">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-[88px] h-[88px] rounded-full border-2 border-dashed border-slate-300 bg-slate-50
                       flex items-center justify-center overflow-hidden cursor-pointer
                       hover:border-[#10b981] hover:bg-emerald-50 transition-all"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200
                       text-xs font-medium text-slate-500 hover:border-[#10b981] hover:text-[#10b981] transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            Seleccionar archivo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <p className="text-[11px] text-slate-400 text-center">
            Si no subes una foto, se mostrarán las iniciales del nombre
          </p>
        </div>

        {/* ── Form ── */}
        <div className="px-7 py-4 grid grid-cols-2 gap-x-5 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Nombre Completo <span className="text-[#10b981]">*</span>
            </Label>
            <Input
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={onInputChange}
              placeholder="Ej: Juan Pérez García"
              className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Correo Electrónico <span className="text-[#10b981]">*</span>
            </Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="usuario@msgrepuestos.com"
              className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Cargo <span className="text-[#10b981]">*</span>
            </Label>
            <Select
              value={formData.id_rol}
              onValueChange={(val) => onSelectChange("id_rol", val)}
            >
              <SelectTrigger
                className="h-[42px] rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] data-[state=open]:ring-2 data-[state=open]:ring-[#10b981] data-[state=open]:border-[#10b981]"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: formData.id_rol ? "#10b981" : "#e2e8f0",
                  boxShadow: "none",
                  outline: "none",
                }}
              >
                <SelectValue placeholder="Selecciona un cargo" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  borderColor: "#e2e8f0",
                }}
              >
                {listaRoles.map((rol) => (
                  <SelectItem
                    key={rol.idRol}
                    value={rol.idRol.toString()}
                    className="focus:bg-emerald-50 focus:text-emerald-700 hover:bg-slate-50 data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700"
                    style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0fdf4")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffffff")
                    }
                  >
                    {rol.nombreRol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Contraseña <span className="text-[#10b981]">*</span>
            </Label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Mínimo 6 caracteres"
              className="h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]"
            />
          </div>

          <div className="flex flex-col gap-1.5 col-span-2">
            <Label className="text-xs font-semibold text-slate-700">
              Confirmar Contraseña <span className="text-[#10b981]">*</span>
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmChange}
              placeholder="Repite la contraseña"
              className={`h-[42px] rounded-xl border-slate-200 focus-visible:ring-[#10b981]
                ${passwordError ? "border-red-400 focus-visible:ring-red-300" : ""}`}
            />
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="mx-7 h-px bg-slate-100 mb-5" />

        {/* ── Footer ── */}
        <DialogFooter className="px-7 pb-6 flex gap-3 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || !!passwordError}
            className="flex-1 h-[46px] rounded-xl bg-[#10b981] hover:bg-[#0da673]
                       text-sm font-semibold shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Usuario"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-[46px] rounded-xl border-slate-200 text-slate-600 text-sm font-semibold"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
