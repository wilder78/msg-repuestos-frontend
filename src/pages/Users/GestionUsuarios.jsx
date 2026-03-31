import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Plus,
  Eye,
  Edit2,
  Loader2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  Trash2,
} from "lucide-react";

import EstadoBadge from "./components/EstadoBadge";
import UserDetailsModal from "./components/UserDetailsModal";
import UserEditModal from "./components/UserEditModal";

// Helper para obtener el token
const getAuthToken = () => {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
};

// Helper centralizado para fetch autenticado
const authFetch = (url, options = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolMap, setRolMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    email: "",
    id_rol: "",
    idEstado: "1",
  });

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resUsuarios, resRoles] = await Promise.all([
        authFetch("http://localhost:8080/api/users"),
        authFetch("http://localhost:8080/api/roles"),
      ]);

      if (!resUsuarios.ok || !resRoles.ok) {
        const status = !resUsuarios.ok ? resUsuarios.status : resRoles.status;
        if (status === 401)
          throw new Error("No autenticado. Por favor inicia sesión.");
        if (status === 403)
          throw new Error("No tienes permisos para ver este recurso (403).");
        throw new Error(`Error del servidor: ${status}`);
      }

      const dataUsuarios = await resUsuarios.json();
      const dataRoles = await resRoles.json();

      // Extraer listas correctamente con manejo de estructura anidada
      const listaUsuarios =
        dataUsuarios.data ||
        dataUsuarios.usuarios ||
        dataUsuarios.content ||
        [];
      const listaRoles = dataRoles.data || dataRoles.roles || dataRoles || [];

      setUsuarios(listaUsuarios);
      setRoles(listaRoles);

      // Crear rolMap para mostrar nombres de roles
      const map = {};
      listaRoles.forEach((rol) => {
        map[rol.idRol] = rol.nombreRol;
      });
      setRolMap(map);
    } catch (err) {
      console.error("Error detallado:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.trim().split(/\s+/);
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
    return (
      colors[id % colors.length] ||
      "bg-gradient-to-br from-slate-500 to-slate-600"
    );
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

  const handleEditClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setFormData({
      nombreUsuario: usuario.nombreUsuario || "",
      email: usuario.email || "",
      id_rol: usuario.id_rol?.toString() || "",
      idEstado: usuario.idEstado?.toString() || "1",
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    if (!formData.nombreUsuario.trim()) {
      alert("El nombre de usuario es requerido");
      return;
    }
    if (!formData.email.trim()) {
      alert("El email es requerido");
      return;
    }
    if (!formData.id_rol) {
      alert("El rol es requerido");
      return;
    }

    setEditLoading(true);
    try {
      const updateData = {
        nombreUsuario: formData.nombreUsuario,
        email: formData.email,
        id_rol: parseInt(formData.id_rol),
        idEstado: parseInt(formData.idEstado),
      };

      const response = await authFetch(
        `http://localhost:8080/api/users/${usuarioSeleccionado.idUsuario}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
      );

      if (response.ok) {
        alert("Usuario actualizado correctamente");
        setIsEditDialogOpen(false);
        fetchDatos();
      } else {
        const errText = await response.text().catch(() => "");
        alert(
          `Error al actualizar (${response.status}): ${errText || "sin detalles"}`,
        );
      }
    } catch (error) {
      console.error("Error al actualizar", error);
      alert("Error de red al actualizar el usuario.");
    } finally {
      setEditLoading(false);
    }
  };

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter((u) => {
    const term = busqueda.toLowerCase();
    return (
      (u.nombreUsuario?.toLowerCase() || "").includes(term) ||
      (u.email?.toLowerCase() || "").includes(term)
    );
  });

  // Paginación
  const indexUltimoUsuario = paginaActual * usuariosPorPagina;
  const indexPrimerUsuario = indexUltimoUsuario - usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(
    indexPrimerUsuario,
    indexUltimoUsuario,
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const getErrorMessage = (msg) => {
    if (msg?.includes("401"))
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (msg?.includes("403"))
      return "No tienes permisos para ver esta sección.";
    return msg || "Error desconocido.";
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] w-full overflow-hidden">
      {/* Header - ESTILO ORIGINAL */}
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
            <Plus className="mr-2 h-4 w-4" /> Crear Usuario
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Barra de búsqueda - AGREGADA */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p className="font-bold">Error de acceso</p>
              <p className="text-sm text-slate-500 text-center max-w-sm mt-1">
                {getErrorMessage(error)}
              </p>
              <Button variant="outline" className="mt-4" onClick={fetchDatos}>
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="pl-6 py-4 font-semibold">
                      Foto
                    </TableHead>
                    <TableHead className="font-semibold">Usuario</TableHead>
                    <TableHead className="font-semibold">Cargo / Rol</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="text-right pr-6 font-semibold">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                          Cargando datos...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : usuariosPaginados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-slate-500"
                      >
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuariosPaginados.map((u) => (
                      <TableRow
                        key={u.idUsuario}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold shadow-sm ring-2 ring-white">
                            {getInitials(u.nombreUsuario)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">
                              {u.nombreUsuario}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {u.idUsuario}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCargoStyle(u.id_rol)}`}
                          >
                            {rolMap[u.id_rol] || u.nombreRol || "Usuario"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600 text-sm">
                              {u.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <EstadoBadge usuario={u} size="small" />
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all"
                              onClick={() => {
                                setUsuarioSeleccionado(u);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:scale-110 transition-all"
                              onClick={() => handleEditClick(u)}
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
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginación - AGREGADA */}
              {totalPaginas > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <div className="text-sm text-slate-500">
                    Mostrando {indexPrimerUsuario + 1} -{" "}
                    {Math.min(indexUltimoUsuario, usuariosFiltrados.length)} de{" "}
                    {usuariosFiltrados.length} usuarios
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <UserDetailsModal
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        usuario={usuarioSeleccionado}
        rolMap={rolMap}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
      />

      <UserEditModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        usuario={usuarioSeleccionado}
        formData={formData}
        listaRoles={roles}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmitEdit}
        loading={editLoading}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
      />
    </div>
  );
};

export default GestionUsuarios;
