import React, { useState } from "react";
import { UserPlus } from "lucide-react";

import { useUsers } from "../../hooks/useUsers";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";

import UserCreateModal from "./components/UserCreateModal";
import UserDetailsModal from "./components/UserDetailsModal";
import UserEditModal from "./components/UserEditModal";
import UserDeleteModal from "./components/UserDeleteModal";
import UserTable from "./components/UserTable";
import SuccessToast from "../../components/ui/SuccessToast";

// Componente global para el cambio de estado
import StatusToggleButton from "../../components/shared/StatusToggleButton";

const INITIAL_CREATE_STATE = {
  nombreUsuario: "",
  email: "",
  password: "",
  id_rol: "",
  id_estado: "1", // Depurado: id_estado
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
  const [deleteError, setDeleteError] = useState(null);

  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  // ─── Handlers de Éxito ────────────────────────────────────────────────────

  const handleUserSaveSuccess = (name) => {
    showToast("Usuario actualizado", `Los cambios de "${name}" se aplicaron correctamente.`);
  };

  const handleUserCreateSuccess = (name) => {
    showToast("Usuario registrado", `El usuario "${name}" ha sido creado correctamente.`);
  };

  // ✅ Handler para el cambio de estado (Toggle)
  const handleStatusChangeSuccess = (userId, nextStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.idUsuario === userId ? { ...u, id_estado: nextStatus, idEstado: nextStatus } : u))
    );
    showToast(
      nextStatus === 1 ? "Usuario activado" : "Usuario inactivado",
      "El estado se actualizó correctamente."
    );
  };

  const handleToggleUserStatus = async (user) => {
    const currentStatus = user.idEstado || user.id_estado;
    const nextStatus = currentStatus == 1 ? 2 : 1;

    // ✅ Validación: El usuario Master (ID 1) no puede ser inactivado
    if (user.idUsuario === 1 && nextStatus !== 1) {
      showToast("Acción no permitida", "El usuario Master es vital para el sistema y no puede ser inactivado.");
      return;
    }
    
    try {
      const res = await authFetch(`http://localhost:8080/api/users/${user.idUsuario}`, {
        method: "PUT",
        body: JSON.stringify({ idEstado: nextStatus }),
      });

      if (res.ok) {
        handleStatusChangeSuccess(user.idUsuario, nextStatus);
      } else {
        console.error("Error al cambiar el estado");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  // ─── Control de Modales ───────────────────────────────────────────────────

  const toggleModal = (type, isOpen, user = null) => {
    setSelectedUser(user);
    if (type === "edit" && user) {
      setEditFormData({
        nombreUsuario: user.nombreUsuario || "",
        email: user.email || "",
        id_rol: user.id_rol?.toString() || "",
        id_estado: (user.idEstado || user.id_estado)?.toString() || "1",
      });
    }
    if (!isOpen && type === "create") setCreateFormData(INITIAL_CREATE_STATE);
    if (type === "delete") setDeleteError(null);
    
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  // ─── Handlers de Acciones ─────────────────────────────────────────────────

  const onCreateSubmit = async () => {
    if (!createFormData.id_rol) return false;
    setActionLoading(true);
    try {
      const res = await authFetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          ...createFormData,
          id_rol: parseInt(createFormData.id_rol, 10),
          idEstado: parseInt(createFormData.id_estado, 10),
        }),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [newUser.data || newUser, ...prev]);
        toggleModal("create", false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const onEditSubmit = async () => {
    if (!editFormData.id_rol) return false;

    // ✅ Validación: Evitar que el usuario Master sea inactivado desde el modal de edición
    if (selectedUser.idUsuario === 1 && parseInt(editFormData.id_estado, 10) !== 1) {
      showToast("Acción no permitida", "No se puede cambiar el estado del usuario Master.");
      return false;
    }

    setActionLoading(true);
    try {
      const res = await authFetch(`http://localhost:8080/api/users/${selectedUser.idUsuario}`, {
        method: "PUT",
        body: JSON.stringify({
          nombreUsuario: editFormData.nombreUsuario,
          email: editFormData.email,
          id_rol: parseInt(editFormData.id_rol, 10),
          idEstado: parseInt(editFormData.id_estado, 10),
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.idUsuario === selectedUser.idUsuario ? { ...u, ...editFormData, id_rol: parseInt(editFormData.id_rol, 10) } : u
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al editar usuario:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const res = await authFetch(`http://localhost:8080/api/users/${selectedUser.idUsuario}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // En lugar de borrar, el backend suele inactivar (estado 2)
        handleStatusChangeSuccess(selectedUser.idUsuario, 2);
        toggleModal("delete", false);
      } else {
        const errorData = await res.json();
        setDeleteError(errorData.message || "Error de restricciones de seguridad.");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Helpers Visuales ─────────────────────────────────────────────────────

  const getInitials = (n) => n?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

  const getAvatarColor = (id) => {
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"];
    return colors[id % colors.length];
  };

  // ─── Filtrado y Paginación ────────────────────────────────────────────────

  const filteredUsers = users.filter(
    (u) =>
      u.nombreUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen overflow-auto">
      <SuccessToast {...toastConfig} onClose={() => setToastConfig((p) => ({ ...p, visible: false }))} />

      <PageHeader
        icon={UserPlus}
        title="Gestión de Usuarios"
        subtitle="Panel administrativo MSG Repuestos"
        buttonText="Crear Usuario"
        onButtonClick={() => toggleModal("create", true)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <TableToolbar
          title="Usuarios del Sistema"
          count={filteredUsers.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
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
          onToggleStatus={handleToggleUserStatus}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODALES */}
      <UserCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
        formData={createFormData}
        listaRoles={roles}
        onInputChange={(e) => setCreateFormData(p => ({ ...p, [e.target.name]: e.target.value }))}
        onSelectChange={(name, value) => setCreateFormData(p => ({ ...p, [name]: value }))}
        onSubmit={onCreateSubmit}
        loading={actionLoading}
        onSaveSuccess={handleUserCreateSuccess}
      />

      <UserEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        usuario={selectedUser}
        formData={editFormData}
        listaRoles={roles}
        onInputChange={(e) => setEditFormData(p => ({ ...p, [e.target.name]: e.target.value }))}
        onSelectChange={(name, value) => setEditFormData(p => ({ ...p, [name]: value }))}
        onSubmit={onEditSubmit}
        loading={actionLoading}
        getInitials={getInitials}
        getAvatarColor={getAvatarColor}
        onSaveSuccess={handleUserSaveSuccess}
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
        error={deleteError}
      />
    </div>
  );
};

export default GestionUsuarios;