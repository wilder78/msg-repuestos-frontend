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
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
} from "lucide-react";

import UserCreateModal from "./components/UserCreateModal";
import EstadoBadge from "./components/EstadoBadge";
import UserDetailsModal from "./components/UserDetailsModal";
import UserEditModal from "./components/UserEditModal";
import UserDeleteModal from "./components/UserDeleteModal";

// ─── Helpers de autenticacion ────────────────────────────────────────────────
const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

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
// ─────────────────────────────────────────────────────────────────────────────
const initialCreateState = {
  nombreUsuario: "",
  email: "",
  password: "",
  id_rol: "",
  idEstado: "1",
};

const GestionUsuarios = () => {
  // ─── Estado global ──────────────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolMap, setRolMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 8;

  // ─── Estado de modales ──────────────────────────────────────────────────────
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // ✅ FALTABA ESTA VARIABLE
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false); // ✅ FALTABA ESTA VARIABLE

  // ─── Estado del formulario de edicion ──────────────────────────────────────
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    email: "",
    id_rol: "",
    idEstado: "1",
  });

  const [createFormData, setCreateFormData] = useState(initialCreateState);

  // ─── Carga inicial de datos ─────────────────────────────────────────────────
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
        throw new Error(
          status === 401 ? "Sesion expirada" : `Error: ${status}`,
        );
      }

      const dataUsuarios = await resUsuarios.json();
      const dataRoles = await resRoles.json();

      const listaUsuarios =
        dataUsuarios.data ||
        dataUsuarios.usuarios ||
        dataUsuarios.content ||
        [];
      const listaRoles = dataRoles.data || dataRoles.roles || dataRoles || [];

      setUsuarios(listaUsuarios);
      setRoles(listaRoles);

      const map = {};
      listaRoles.forEach((rol) => {
        map[rol.idRol] = rol.nombreRol;
      });
      setRolMap(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // ─── Cambiar estado activo/inactivo ────────────────────────────────────────
  const handleToggleEstado = async (u) => {
    const nuevoEstadoId = u.idEstado === 1 ? 2 : 1;
    try {
      const response = await authFetch(
        `http://localhost:8080/api/users/${u.idUsuario}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...u, idEstado: nuevoEstadoId }),
        },
      );
      if (response.ok) {
        setUsuarios((prev) =>
          prev.map((user) =>
            user.idUsuario === u.idUsuario
              ? { ...user, idEstado: nuevoEstadoId }
              : user,
          ),
        );
      } else {
        alert("No se pudo actualizar el estado en el servidor.");
      }
    } catch (error) {
      console.error("Error toggle estado:", error);
      alert("Error de conexion al intentar cambiar el estado.");
    }
  };

  // ─── Abrir modal de edicion ─────────────────────────────────────────────────
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

  // ─── Guardar edicion ────────────────────────────────────────────────────────
  const handleSubmitEdit = async () => {
    setEditLoading(true);
    try {
      const token = getAuthToken(); // ✅ USAR getAuthToken EN LUGAR DE localStorage.getItem
      const payload = {
        nombreUsuario: formData.nombreUsuario,
        email: formData.email,
        idRol: parseInt(formData.id_rol),
        idEstado: parseInt(formData.idEstado),
      };

      const response = await fetch(
        `http://localhost:8080/api/users/${usuarioSeleccionado.idUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        // Actualiza la tabla localmente sin recargar la API
        setUsuarios((prev) =>
          prev.map((u) =>
            u.idUsuario === usuarioSeleccionado.idUsuario
              ? {
                  ...u,
                  nombreUsuario: formData.nombreUsuario,
                  email: formData.email,
                  id_rol: parseInt(formData.id_rol),
                  idEstado: parseInt(formData.idEstado),
                }
              : u,
          ),
        );
        setIsEditDialogOpen(false);
      } else {
        const err = await response.json().catch(() => ({}));
        alert(
          `Error al guardar: ${err.error || err.message || response.status}`,
        );
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error de conexion al intentar actualizar.");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Crear un nuevo usuario ──────────────────────────────────────────────────
  const handleSubmitCreate = async () => {
    // ── 1. Validación de campos obligatorios ──────────────────────────────────
    const { nombreUsuario, email, password, id_rol, idEstado } = createFormData;

    if (!nombreUsuario.trim()) {
      alert("El nombre de usuario es obligatorio.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }
    if (!password || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!id_rol) {
      alert("Debes seleccionar un rol.");
      return;
    }

    setCreateLoading(true);

    try {
      // ── 2. Payload limpio y tipado correctamente ───────────────────────────
      const payload = {
        nombreUsuario: nombreUsuario.trim(),
        email: email.trim().toLowerCase(),
        password,
        idRol: parseInt(id_rol, 10), // ✅ base 10 explícita
        idEstado: parseInt(idEstado, 10), // ✅ destructurado arriba
      };

      // ✅ Ruta correcta
      const response = await authFetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      // ── 3. Manejo de respuesta ─────────────────────────────────────────────
      if (response.ok) {
        const result = await response.json();
        const nuevoUsuario = result.data || result.usuario || result;

        // ✅ Normaliza id_rol para que rolMap lo resuelva sin recargar la tabla
        if (!nuevoUsuario.id_rol && nuevoUsuario.idRol) {
          nuevoUsuario.id_rol = nuevoUsuario.idRol;
        }

        setUsuarios((prev) => [nuevoUsuario, ...prev]);
        setIsCreateDialogOpen(false);
        setCreateFormData(initialCreateState);
      } else {
        // ✅ Intenta leer el cuerpo del error; si falla, usa el status HTTP
        const err = await response.json().catch(() => null);
        const msg =
          err?.error ||
          err?.message ||
          `Error del servidor (${response.status})`;
        alert(`No se pudo crear el usuario: ${msg}`);
      }
    } catch (error) {
      // ✅ Distingue errores de red de errores inesperados
      const esErrorRed =
        error instanceof TypeError && error.message === "Failed to fetch";
      alert(
        esErrorRed
          ? "Sin conexión con el servidor. Verifica tu red e intenta de nuevo."
          : `Error inesperado: ${error.message}`,
      );
      console.error("[handleSubmitCreate]", error);
    } finally {
      setCreateLoading(false);
    }
  };

  // ─── Confirmar eliminacion ──────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const token = getAuthToken(); // ✅ USAR getAuthToken EN LUGAR DE localStorage.getItem

      // El backend hace borrado logico: cambia idEstado a 2 (Inactivo)
      const response = await fetch(
        `http://localhost:8080/api/users/${usuarioSeleccionado.idUsuario}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        // Refleja el borrado logico: marca el usuario como Inactivo (idEstado: 2)
        setUsuarios((prev) =>
          prev.map((u) =>
            u.idUsuario === usuarioSeleccionado.idUsuario
              ? { ...u, idEstado: 2 }
              : u,
          ),
        );
        setIsDeleteDialogOpen(false);
      } else {
        const err = await response.json().catch(() => ({}));
        alert(
          `No se pudo desactivar el usuario: ${err.error || response.status}`,
        );
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error de conexion al intentar eliminar.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Helpers de UI ──────────────────────────────────────────────────────────
  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.trim().split(/\s+/);
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-emerald-500",
      "bg-blue-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
    ];
    return colors[id % colors.length];
  };

  const getCargoStyle = (id) => {
    const styles = {
      1: "bg-red-50 text-red-700",
      2: "bg-blue-50 text-blue-700",
      3: "bg-amber-50 text-amber-700",
    };
    return styles[id] || "bg-gray-50 text-gray-600";
  };

  // ─── Filtros y paginacion ───────────────────────────────────────────────────
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (u.nombreUsuario?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(busqueda.toLowerCase()),
  );

  const indexUltimoUsuario = paginaActual * usuariosPorPagina;
  const indexPrimerUsuario = indexUltimoUsuario - usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(
    indexPrimerUsuario,
    indexUltimoUsuario,
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] w-full overflow-hidden">
      {/* Encabezado */}
      <div className="px-8 py-6 bg-white border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestion de Usuarios
            </h1>
            <p className="text-slate-500 text-sm">
              Panel administrativo MSG Repuestos
            </p>
          </div>
          <Button
            className="bg-[#10b981] hover:bg-[#0da673]"
            onClick={() => setIsCreateDialogOpen(true)} // ✅ AGREGADO EL onClick
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Usuario
          </Button>
        </div>
      </div>
      {/* Tabla */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Buscador */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="pl-6">Foto</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Cargo / Rol</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado (Click p/ cambiar)</TableHead>
                <TableHead className="text-right pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-red-500"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : usuariosPaginados.length === 0 ? ( // ✅ AGREGADO MENSAJE CUANDO NO HAY RESULTADOS
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-slate-500"
                  >
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                usuariosPaginados.map((u) => (
                  <TableRow key={u.idUsuario} className="group">
                    <TableCell className="pl-6">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(u.idUsuario)}`}
                      >
                        {getInitials(u.nombreUsuario)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{u.nombreUsuario}</span>
                        <span className="text-[10px] text-slate-400">
                          ID: {u.idUsuario}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCargoStyle(u.id_rol)}`}
                      >
                        {rolMap[u.id_rol] || "Usuario"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {u.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleEstado(u)}
                        className="transition-transform active:scale-90 hover:opacity-80 focus:outline-none"
                        title="Cambiar estado"
                      >
                        <EstadoBadge usuario={u} size="small" />
                      </button>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        {/* Ver detalles */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600"
                          onClick={() => {
                            setUsuarioSeleccionado(u);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-amber-600"
                          onClick={() => handleEditClick(u)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {/* Eliminar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => {
                            setUsuarioSeleccionado(u);
                            setIsDeleteDialogOpen(true);
                          }}
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

          {/* Paginacion */}
          {totalPaginas > 0 && ( // ✅ SOLO MOSTRAR PAGINACION SI HAY PAGINAS
            <div className="p-4 border-t flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Pagina {paginaActual} de {totalPaginas}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modales */}
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
        onInputChange={(e) =>
          setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
        onSelectChange={(name, value) =>
          setFormData((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={handleSubmitEdit}
        loading={editLoading}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
      />
      <UserCreateModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={createFormData}
        listaRoles={roles}
        onInputChange={(e) =>
          setCreateFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        onSelectChange={(name, value) =>
          setCreateFormData((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={handleSubmitCreate}
        loading={createLoading}
      />

      <UserDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        usuario={usuarioSeleccionado}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default GestionUsuarios;
