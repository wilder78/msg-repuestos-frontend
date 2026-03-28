import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
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

const ROL_MAP = {
  1: "Administrador",
  2: "Vendedor",
  3: "Bodeguero",
  4: "Contador",
};

const GestionUsuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cargoFiltro, setCargoFiltro] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreUsuario: "",
    email: "",
    id_rol: "",
    password: "",
    confirmPassword: "",
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error en la respuesta");
      const data = await response.json();
      // Ajuste para manejar diferentes estructuras de respuesta
      setListaUsuarios(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Volver a página 1 cuando se filtra
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, estadoFiltro, cargoFiltro]);

  const getInitials = (n) =>
    n
      ?.split(" ")
      .map((i) => i[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const getCargoStyle = (id) => {
    const styles = {
      1: "bg-red-50 text-red-700 border-red-100",
      2: "bg-blue-50 text-blue-700 border-blue-100",
      3: "bg-amber-50 text-amber-700 border-amber-100",
      4: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return styles[id] || "bg-gray-50 text-gray-600";
  };

  // --- Lógica de Filtrado Corregida ---
  const usuariosFiltrados = listaUsuarios.filter((u) => {
    const term = busqueda.toLowerCase();
    const coincideBusqueda =
      (u.nombreUsuario?.toLowerCase() || "").includes(term) ||
      (u.email?.toLowerCase() || "").includes(term);

    const coincideEstado =
      estadoFiltro === "todos" || u.idEstado?.toString() === estadoFiltro;
    const coincideCargo =
      cargoFiltro === "todos" || u.id_rol?.toString() === cargoFiltro;

    return coincideBusqueda && coincideEstado && coincideCargo;
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
      {/* Header superior */}
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#10b981] hover:bg-[#0da673] text-white px-6 shadow-sm transition-all active:scale-95">
                <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Complete los campos para registrar un nuevo usuario en la base
                  de datos.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de usuario</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Juan Pérez"
                    value={nuevoUsuario.nombreUsuario}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        nombreUsuario: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@email.com"
                    value={nuevoUsuario.email}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select
                    onValueChange={(val) =>
                      setNuevoUsuario({ ...nuevoUsuario, id_rol: val })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Vendedor</SelectItem>
                      <SelectItem value="3">Bodeguero</SelectItem>
                      <SelectItem value="4">Contador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={nuevoUsuario.password}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="bg-[#10b981] hover:bg-[#0da673]">
                  Guardar Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Barra de búsqueda y filtros ESTILO FIGMA */}
          <div className="p-6 border-b border-gray-100 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuario o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500 w-full md:w-96 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm font-bold text-slate-700">
                <Filter className="h-4 w-4 text-slate-400" /> Filtros:
              </div>

              {/* Selector de Estados - FIXED HOVER */}
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger
                  className="w-[180px] !bg-[#f1f3f5] border-none text-slate-700 font-medium 
                             hover:!bg-[#e2e6ea] transition-all shadow-none focus:ring-0 
                             focus:ring-offset-0 data-[state=open]:!bg-[#e2e6ea]"
                >
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectContent>
              </Select>

              {/* Selector de Cargos - FIXED HOVER */}
              <Select value={cargoFiltro} onValueChange={setCargoFiltro}>
                <SelectTrigger
                  className="w-[180px] !bg-[#f1f3f5] border-none text-slate-700 font-medium 
                             hover:!bg-[#e2e6ea] transition-all shadow-none focus:ring-0 
                             focus:ring-offset-0 data-[state=open]:!bg-[#e2e6ea]"
                >
                  <SelectValue placeholder="Todos los cargos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los cargos</SelectItem>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Vendedor</SelectItem>
                  <SelectItem value="3">Bodeguero</SelectItem>
                  <SelectItem value="4">Contador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="pl-6 py-4 font-semibold text-slate-700">
                  Foto
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Usuario
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Cargo
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Estado
                </TableHead>
                <TableHead className="text-right pr-6 font-semibold text-slate-700">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                      <span className="text-slate-500">Sincronizando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : usuariosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-slate-400"
                  >
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                usuariosPaginados.map((usuario) => (
                  <TableRow
                    key={usuario.idUsuario}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <TableCell className="pl-6 py-4">
                      <Avatar className="h-10 w-10 border border-white shadow-sm ring-1 ring-gray-100">
                        <AvatarImage src={usuario.avatar} />
                        <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
                          {getInitials(usuario.nombreUsuario)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">
                          {usuario.nombreUsuario}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{usuario.idUsuario}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-transparent ${getCargoStyle(usuario.id_rol)}`}
                      >
                        {ROL_MAP[usuario.id_rol] || "Sin cargo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {usuario.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full px-3 py-0.5 shadow-none border ${
                          usuario.idEstado === 1
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {usuario.idEstado === 1 ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-slate-500 font-medium">
              Viendo{" "}
              <span className="text-slate-900">{usuariosPaginados.length}</span>{" "}
              de{" "}
              <span className="text-slate-900">{usuariosFiltrados.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="h-8 border-gray-200 text-slate-600 hover:bg-slate-50 shadow-none"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-bold text-slate-900">
                  {paginaActual}
                </span>
                <span className="text-sm text-slate-400">/</span>
                <span className="text-sm text-slate-400">
                  {totalPaginas || 1}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="h-8 border-gray-200 text-slate-600 hover:bg-slate-50 shadow-none"
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;
