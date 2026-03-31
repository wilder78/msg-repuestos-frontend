import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  ShieldCheck,
  Calendar,
  Fingerprint,
  Clock,
  Activity,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Briefcase,
  Award,
  Smartphone,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import { Separator } from "../../components/ui/separator";

// ── Badge de estado con tooltip mejorado ──────────────────
const EstadoBadge = ({ usuario, onToggle, size = "default" }) => {
  const [hovered, setHovered] = useState(false);
  const isActivo = usuario.idEstado === 1;

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

// ── Tarjeta de información reutilizable ──────────────────
const InfoCard = ({ icon: Icon, iconColor, title, children, bgColor }) => {
  const colorVariants = {
    blue: "border-blue-100 bg-blue-50/30 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-700",
    violet: "border-violet-100 bg-violet-50/30 text-violet-700",
    amber: "border-amber-100 bg-amber-50/30 text-amber-700",
    slate: "border-slate-200 bg-white text-slate-500",
    rose: "border-rose-100 bg-rose-50/30 text-rose-700",
  };

  const iconColorVariants = {
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
    amber: "text-amber-700",
    slate: "text-slate-500",
    rose: "text-rose-700",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorVariants[iconColor]} space-y-3 transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColorVariants[iconColor]}`} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
const GestionUsuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);
  const [rolMap, setRolMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // ESTADOS PARA "VER DETALLES"
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cargoFiltro, setCargoFiltro] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreUsuario: "",
    email: "",
    id_rol: "",
    password: "",
  });

  // Funciones de utilidad para estilos
  const getInitials = (n) => {
    if (!n) return "??";
    const words = n.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0].slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-violet-500 to-violet-600",
      "bg-gradient-to-br from-amber-500 to-amber-600",
      "bg-gradient-to-br from-rose-500 to-rose-600",
    ];
    return colors[id % colors.length];
  };

  const getCargoStyle = (id) => {
    const styles = {
      1: "bg-red-50 text-red-700 border-red-100",
      2: "bg-blue-50 text-blue-700 border-blue-100",
      3: "bg-amber-50 text-amber-700 border-amber-100",
      4: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return styles[id] || "bg-gray-50 text-gray-600";
  };

  // Handlers
  const handleVerDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setIsViewDialogOpen(true);
  };

  // Simulación de Fetch (Manteniendo tu lógica original)
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setListaUsuarios(data.data || []);
    } catch (error) {
      console.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // fetchRoles(); // Asumimos que ya tienes esta lógica
  }, []);

  const usuariosFiltrados = listaUsuarios.filter((u) => {
    const term = busqueda.toLowerCase();
    return (
      (u.nombreUsuario?.toLowerCase() || "").includes(term) ||
      (u.email?.toLowerCase() || "").includes(term)
    );
  });

  const indexUltimoUsuario = paginaActual * usuariosPorPagina;
  const indexPrimerUsuario = indexUltimoUsuario - usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(
    indexPrimerUsuario,
    indexUltimoUsuario,
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] w-full overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-500 text-sm">
              Administra los usuarios del sistema de MSG Repuestos
            </p>
          </div>
          <Button className="bg-[#10b981] hover:bg-[#0da673] shadow-sm hover:shadow-md transition-all">
            <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Tabla de Usuarios */}
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="pl-6 py-4 font-semibold">Foto</TableHead>
                <TableHead className="font-semibold">Usuario</TableHead>
                <TableHead className="font-semibold">Cargo</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right pr-6 font-semibold">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosPaginados.map((usuario) => (
                <TableRow
                  key={usuario.idUsuario}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <TableCell className="pl-6 py-4">
                    <Avatar className="h-11 w-11 shadow-sm ring-2 ring-white">
                      <AvatarFallback
                        className={`${getAvatarColor(usuario.idUsuario)} text-white font-bold shadow-inner`}
                      >
                        {getInitials(usuario.nombreUsuario)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {usuario.nombreUsuario}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {usuario.idUsuario}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${getCargoStyle(usuario.id_rol)}`}
                    >
                      {rolMap[usuario.id_rol] || "Usuario"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 text-sm">
                        {usuario.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EstadoBadge usuario={usuario} size="small" />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all"
                        onClick={() => handleVerDetalles(usuario)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:scale-110 transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:scale-110 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ── MODAL VER DETALLES MEJORADO ── */}
          {/* ── MODAL VER DETALLES MEJORADO ── */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent
              className="sm:max-w-[580px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* El contenido de tu modal permanece igual */}

              {/* Encabezado con gradiente sutil */}
              <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">
                          Perfil de Usuario
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm mt-1">
                          Información detallada del usuario y su actividad
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-slate-100"
                      onClick={() => setIsViewDialogOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
              </div>

              {usuarioSeleccionado && (
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Sección de Perfil Principal - Estilo más elegante */}
                  <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                            <AvatarImage src={usuarioSeleccionado.avatar} />
                            <AvatarFallback
                              className={`${getAvatarColor(usuarioSeleccionado.idUsuario)} text-white text-xl font-bold`}
                            >
                              {getInitials(usuarioSeleccionado.nombreUsuario)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            <div className="h-5 w-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {usuarioSeleccionado.nombreUsuario}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-sm text-slate-600 font-medium">
                              {rolMap[usuarioSeleccionado.id_rol] ||
                                "Colaborador MSG"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-xs text-slate-500">
                              Administrador del sistema
                            </p>
                          </div>
                        </div>
                      </div>
                      <EstadoBadge
                        usuario={usuarioSeleccionado}
                        size="default"
                      />
                    </div>
                  </div>

                  {/* Grid de Información en 2 columnas */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Información de Registro */}
                    <InfoCard
                      icon={Calendar}
                      iconColor="blue"
                      title="Información de Registro"
                    >
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Fecha de registro
                        </p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          31 diciembre 2023
                        </p>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Usuario ID
                        </p>
                        <p className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                          #
                          {usuarioSeleccionado.idUsuario
                            .toString()
                            .padStart(4, "0")}
                        </p>
                      </div>
                    </InfoCard>

                    {/* Actividad Reciente */}
                    <InfoCard
                      icon={Activity}
                      iconColor="emerald"
                      title="Actividad Reciente"
                    >
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Último acceso
                        </p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          31 marzo 2026
                        </p>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Actividad actual
                        </p>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          <Activity className="w-3 h-3 mr-1" />
                          Ahora mismo
                        </Badge>
                      </div>
                    </InfoCard>

                    {/* Permisos y Rol */}
                    <InfoCard
                      icon={ShieldCheck}
                      iconColor="violet"
                      title="Permisos y Rol"
                    >
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Rol principal
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {rolMap[usuarioSeleccionado.id_rol] ||
                            "Administrador"}
                        </p>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Permisos especiales
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-violet-50 border-violet-200"
                          >
                            Gestión total
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-violet-50 border-violet-200"
                          >
                            Auditoría
                          </Badge>
                        </div>
                      </div>
                    </InfoCard>

                    {/* Estado de Cuenta */}
                    <InfoCard
                      icon={Award}
                      iconColor="amber"
                      title="Estado de Cuenta"
                    >
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Estado actual
                        </p>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Cuenta activa
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Verificación
                        </p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-xs text-slate-600">
                            Email verificado
                          </span>
                        </div>
                      </div>
                    </InfoCard>
                  </div>

                  {/* Información Adicional - Contacto */}
                  <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      <h4 className="text-sm font-semibold text-slate-700">
                        Información de Contacto
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Correo electrónico
                        </p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-800 break-all">
                            {usuarioSeleccionado.email}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                        <p className="text-sm font-medium text-slate-800">
                          +57 300 123 4567
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer con botones mejorados */}
              <DialogFooter className="p-6 bg-slate-50/80 border-t border-slate-200 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 transition-all"
                >
                  Cerrar ventana
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;
