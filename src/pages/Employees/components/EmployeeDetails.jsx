import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  MapPin, 
  Briefcase, 
  Calendar,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

export function EmployeeDetails({ empleado, getCargoStyle }) {
  if (!empleado) return null;

  return (
    <div className="space-y-8 py-2">
      {/* CABECERA: Perfil Rápido */}
      <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
          <AvatarImage src={empleado.foto} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xl">
            {empleado.nombres[0]}{empleado.apellidos[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
            {empleado.nombres} {empleado.apellidos}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${getCargoStyle(empleado.cargo)} border-none`}>
              {empleado.cargo}
            </Badge>
            <span className="text-slate-400 text-sm">•</span>
            <span className={`text-sm font-bold ${empleado.estado === 'activo' ? 'text-emerald-600' : 'text-slate-400'}`}>
              {empleado.estado.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {/* COLUMNA 1: Información Personal y Laboral */}
        <div className="space-y-6">
          <section>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <User size={14} /> Información Personal
            </h4>
            <div className="space-y-3">
              <DetailItem label="Tipo de Doc." value={empleado.tipoDocumento} icon={<IdCard size={14} />} />
              <DetailItem label="Número Doc." value={empleado.numeroDocumento} icon={<ShieldCheck size={14} />} />
              <DetailItem label="Ciudad" value={empleado.ciudad} icon={<MapPin size={14} />} />
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Building2 size={14} /> Datos de la Empresa
            </h4>
            <div className="space-y-3">
              <DetailItem label="Cargo Actual" value={empleado.cargo} icon={<Briefcase size={14} />} />
              <DetailItem label="Sede/Oficina" value={empleado.ciudad} icon={<MapPin size={14} />} />
            </div>
          </section>
        </div>

        {/* COLUMNA 2: Contacto y Ubicación */}
        <div className="space-y-6">
          <section>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Phone size={14} /> Medios de Contacto
            </h4>
            <div className="space-y-3">
              <DetailItem 
                label="Email Corporativo" 
                value={empleado.email} 
                icon={<Mail size={14} />} 
                isCopyable 
              />
              <DetailItem 
                label="Teléfono Movil" 
                value={empleado.telefono} 
                icon={<Phone size={14} />} 
              />
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <MapPin size={14} /> Ubicación
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {empleado.direccion}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                Residencia registrada en {empleado.ciudad}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Sub-componente interno para mantener la consistencia
function DetailItem({ label, value, icon, isCopyable = false }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-300">{icon}</span>
        {value}
      </div>
    </div>
  );
}