import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Hook personalizado
import { useUsers } from "../../hooks/useUsers";

// Componentes del módulo
import UserCreateModal from "./components/UserCreateModal";
import UserDetailsModal from "./components/UserDetailsModal";
import UserEditModal from "./components/UserEditModal";
import UserDeleteModal from "./components/UserDeleteModal";
import UserTable from "./components/UserTable";

const INITIAL_CREATE_STATE = {
  nombreUsuario: "",
  email: "",
  password: "",
  confirmPassword: "",
  id_rol: "",
  idEstado: "1",
};

const GestionUsuarios = () => {
  // ─── Lógica del Hook ──────────────────────────────────────────────────────
  const { users, setUsers, roles, roleMap, loading, authFetch } = useUsers();

  // ─── Estado de UI ──────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // ─── Control de Modales ────────────────────────────────────────────────────
  const [selectedUser, setSelectedUser] = useState(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });

  const [createFormData, setCreateFormData] = useState(INITIAL_CREATE_STATE);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const toggleModal = (type, isOpen, user = null) => {
    setSelectedUser(user);
    if (type === "edit" && user) {
      setEditFormData({
        nombreUsuario: user.nombreUsuario || "",
        email: user.email || "",
        id_rol: user.id_rol?.toString() || "",
        idEstado: user.idEstado?.toString() || "1",
      });
    }
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  // ─── Handlers de Acciones ──────────────────────────────────────────────────
  const handleToggleStatus = async (user) => {
    const nextStatus = user.idEstado === 1 ? 2 : 1;
    try {
      const res = await authFetch(
        `http://localhost:8080/api/users/${user.idUsuario}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...user, idEstado: nextStatus }),
        },
      );
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.idUsuario === user.idUsuario ? { ...u, idEstado: nextStatus } : u,
          ),
        );
      }
    } catch (err) {
      console.error("Error toggling status", err);
    }
  };

  const onCreateSubmit = async () => {
    setActionLoading(true);
    try {
      const res = await authFetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          ...createFormData,
          idRol: parseInt(createFormData.id_rol),
          idEstado: parseInt(createFormData.idEstado),
        }),
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [newUser.data || newUser, ...prev]);
        toggleModal("create", false);
        setCreateFormData(INITIAL_CREATE_STATE);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const onEditSubmit = async () => {
    setActionLoading(true);
    try {
      const res = await authFetch(
        `http://localhost:8080/api/users/${selectedUser.idUsuario}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...editFormData,
            idRol: parseInt(editFormData.id_rol),
            idEstado: parseInt(editFormData.idEstado),
          }),
        },
      );
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.idUsuario === selectedUser.idUsuario
              ? { ...u, ...editFormData, id_rol: parseInt(editFormData.id_rol) }
              : u,
          ),
        );
        toggleModal("edit", false);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const res = await authFetch(
        `http://localhost:8080/api/users/${selectedUser.idUsuario}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.idUsuario === selectedUser.idUsuario ? { ...u, idEstado: 2 } : u,
          ),
        );
        toggleModal("delete", false);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Helpers de Estilo ─────────────────────────────────────────────────────
  const getInitials = (n) =>
    n
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

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

  // ─── Filtrado y Paginación ────────────────────────────────────────────────
  const filteredUsers = users.filter(
    (u) =>
      u.nombreUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] w-full overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-6 bg-white border-b flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 text-sm">
            Panel administrativo MSG Repuestos
          </p>
        </div>
        <Button
          className="bg-[#10b981] hover:bg-[#0da673] shadow-md transition-all active:scale-95"
          onClick={() => toggleModal("create", true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* SEARCH BAR */}
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* TABLE COMPONENT */}
          <UserTable
            users={paginatedUsers}
            roleMap={roleMap}
            loading={loading}
            getAvatarColor={getAvatarColor}
            getInitials={getInitials}
            onView={(u) => toggleModal("view", true, u)}
            onEdit={(u) => toggleModal("edit", true, u)}
            onDelete={(u) => toggleModal("delete", true, u)}
            onToggleStatus={handleToggleStatus}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-between items-center bg-gray-50/30">
              <p className="text-sm text-slate-500">
                Página{" "}
                <span className="font-medium text-slate-900">
                  {currentPage}
                </span>{" "}
                de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      <UserCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
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
        onSubmit={onCreateSubmit}
        loading={actionLoading}
      />

      <UserEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        usuario={selectedUser}
        formData={editFormData}
        listaRoles={roles}
        onInputChange={(e) =>
          setEditFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        onSelectChange={(name, value) =>
          setEditFormData((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={onEditSubmit}
        loading={actionLoading}
        getInitials={getInitials}
        getAvatarColor={getAvatarColor}
      />

      <UserDetailsModal
        isOpen={modals.view}
        onClose={() => toggleModal("view", false)}
        usuario={selectedUser}
        rolMap={roleMap}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
      />

      <UserDeleteModal
        isOpen={modals.delete}
        onClose={() => toggleModal("delete", false)}
        usuario={selectedUser}
        onConfirm={onDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default GestionUsuarios;
