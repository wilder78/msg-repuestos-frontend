import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

// Hook personalizado e imports de componentes compartidos
import { useUsers } from "../../hooks/useUsers";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar"; // Añadido

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
  const { users, setUsers, roles, roleMap, loading, authFetch } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

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

  // --- Funciones de Control ---
  const handleCreateUser = () => toggleModal("create", true);

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
        // Actualizamos el estado local para que la tabla se refresque sin recargar
        setUsers((prev) =>
          prev.map((u) =>
            u.idUsuario === selectedUser.idUsuario
              ? {
                  ...u,
                  ...editFormData,
                  id_rol: parseInt(editFormData.id_rol),
                  idEstado: parseInt(editFormData.idEstado),
                }
              : u,
          ),
        );
        toggleModal("edit", false);
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
    } finally {
      setActionLoading(false);
    }
  };

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
      console.error(err);
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

  // ─── Helpers ─────────────────────────────────────────────────────
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
      <PageHeader
        icon={Users}
        title="Gestión de Usuarios"
        subtitle="Panel administrativo MSG Repuestos"
        buttonText="Crear Usuario"
        onButtonClick={handleCreateUser}
      />

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Reemplazo de la barra de búsqueda manual por el componente genérico */}
          <TableToolbar
            title="Usuarios del Sistema"
            count={filteredUsers.length}
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre o email..."
          />

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
