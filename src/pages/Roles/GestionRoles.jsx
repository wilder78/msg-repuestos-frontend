import React, { useState, useMemo, useEffect } from "react";
import { useRoles } from "../../hooks/useRoles";
import RolesTable from "./components/RolesTable";
import RoleDetailsModal from "./components/RoleDetailsModal";
import RoleCreateModal from "./components/RolCreateModal";
import RolEditModal from "./components/RolEditModal";
import RolDeleteModal from "./components/RolDeleteModal";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast"; // ✅ Importado

const GestionRoles = () => {
  const { roles, setRoles, loading, refresh } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 8;

  // Estados para Modales
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [editRolePermissions, setEditRolePermissions] = useState([]);
  const [allSystemPermissions, setAllSystemPermissions] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  // ✅ NUEVO: Estado único para Toasts
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // ✅ NUEVO: Handler para mostrar el toast con éxito
  const showSuccessToast = (title, message) => {
    setToastConfig({
      visible: true,
      title,
      message,
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/permissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAllSystemPermissions(data);
        }
      } catch (error) {
        console.error("Error cargando catálogo de permisos:", error);
      }
    };
    fetchAllPermissions();
  }, []);

  // ✅ MODIFICADO: Ahora refresh y muestra el toast
  const handleRolCreated = async (rolName) => {
    await refresh();
    showSuccessToast(
      "Rol creado correctamente",
      `El rol "${rolName}" ha sido registrado en el sistema con sus permisos.`,
    );
  };

  const handleRolUpdated = async (rolName) => {
    await refresh();
    showSuccessToast(
      "Rol actualizado",
      `El rol "${rolName}" se actualizó correctamente.`,
    );
  };

  const handleToggleStatus = async (rol) => {
    const nextStatus = rol.idEstado === 1 ? 2 : 1;
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/roles/${rol.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...rol, idEstado: nextStatus }),
        },
      );

      if (response.ok) {
        setRoles((prev) =>
          prev.map((r) =>
            r.id === rol.id ? { ...r, idEstado: nextStatus } : r,
          ),
        );
        // Opcional: Mostrar toast al cambiar estado
        showSuccessToast(
          "Estado actualizado",
          `El rol "${rol.nombre}" ahora está ${nextStatus === 1 ? "Activo" : "Inactivo"}.`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- Memorización de datos (sin cambios) ---
  const groupedPermissions = useMemo(() => {
    if (!allSystemPermissions || allSystemPermissions.length === 0) return [];
    return allSystemPermissions.reduce((acc, perm) => {
      if (!perm || !perm.nombre) return acc;
      const partes = perm.nombre.split("_");
      const modulo = partes.length > 1 ? partes[1] : "General";
      const categoryName = modulo.charAt(0).toUpperCase() + modulo.slice(1);
      let category = acc.find((c) => c.nombre === categoryName);
      if (!category) {
        category = {
          id: modulo.toLowerCase(),
          nombre: categoryName,
          items: [],
        };
        acc.push(category);
      }
      category.items.push({
        id: perm.idPermiso || perm.id,
        nombre: perm.nombre,
        desc: perm.descripcion || `Acceso a ${perm.nombre}`,
      });
      return acc;
    }, []);
  }, [allSystemPermissions]);

  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    return roles.filter(
      (rol) =>
        rol.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [roles, searchTerm]);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * rolesPerPage;
    return filteredRoles.slice(startIndex, startIndex + rolesPerPage);
  }, [filteredRoles, currentPage]);

  const handleViewDetails = async (rol) => {
    setSelectedRole(rol);
    setIsLoadingDetails(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/role-permissions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const allPerms = await response.json();
        const filtered = allPerms.filter(
          (p) => (p.idRol || p.id_rol) === rol.id,
        );
        setRolePermissions(filtered);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleEditRole = async (rol) => {
    setEditRole(rol);
    setIsLoadingEdit(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/role-permissions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const allPerms = await response.json();
        const filtered = allPerms.filter(
          (p) => (p.idRol || p.id_rol) === rol.id,
        );
        setEditRolePermissions(filtered);
        setIsEditOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDeleteRole = (rol) => {
    setDeleteRole(rol);
    setIsDeleteOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!deleteRole) return;
    setIsLoadingDelete(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/roles/${deleteRole.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idEstado: 2 }),
        },
      );
      if (response.ok) {
        setRoles((prev) =>
          prev.map((r) =>
            r.id === deleteRole.id
              ? { ...r, idEstado: 2, estado: "inactivo" }
              : r,
          ),
        );
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error("Error al desactivar rol:", error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      {/* ✅ TOAST GLOBAL DE ROLES */}
      <SuccessToast
        visible={toastConfig.visible}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
      />

      <PageHeader
        icon={ShieldCheck}
        title="Gestión de Roles y Permisos"
        subtitle="MSG Repuestos - Panel de control de acceso y seguridad"
        buttonText="Crear Nuevo Rol"
        onButtonClick={() => setIsCreateOpen(true)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TableToolbar
          title="Roles del Sistema"
          count={filteredRoles.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre o descripción..."
        />

        <RolesTable
          roles={paginatedRoles}
          loading={
            loading || isLoadingDetails || isLoadingEdit || isLoadingDelete
          }
          onView={handleViewDetails}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onToggleStatus={handleToggleStatus}
          onRefresh={refresh}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <RoleDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        rol={selectedRole}
        permisos={rolePermissions}
      />

      <RolDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteRole(null);
        }}
        rol={deleteRole}
        onConfirm={onDeleteConfirm}
        loading={isLoadingDelete}
      />

      <RolEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditRole(null);
          setEditRolePermissions([]);
        }}
        rol={editRole}
        allPermissions={allSystemPermissions}
        assignedPermissions={editRolePermissions}
        onRolUpdated={handleRolUpdated}
      />

      <RoleCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onRolCreated={handleRolCreated} 
      />
    </div>
  );
};

export default GestionRoles;
