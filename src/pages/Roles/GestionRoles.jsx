import React, { useState, useMemo } from "react";
import { useRoles } from "../../hooks/useRoles";
import RolesTable from "./components/RolesTable";
import RoleDetailsModal from "./components/RoleDetailsModal";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";

const GestionRoles = () => {
  // 1. Extraemos setRoles para actualizar el estado localmente tras un cambio
  const { roles, setRoles, loading, refresh } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 8;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // --- Lógica de Cambio de Estado ---
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
          body: JSON.stringify({
            ...rol,
            idEstado: nextStatus,
          }),
        },
      );

      if (response.ok) {
        // Actualización optimista: actualizamos el estado local inmediatamente
        setRoles((prev) =>
          prev.map((r) =>
            r.id === rol.id ? { ...r, idEstado: nextStatus } : r,
          ),
        );
      } else {
        console.error("No se pudo actualizar el estado en el servidor");
      }
    } catch (error) {
      console.error("Error en la petición de cambio de estado:", error);
    }
  };

  const handleCreateRole = () => {
    console.log("Abriendo modal para crear nuevo rol...");
  };

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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Error al obtener permisos detallados");
      const allPerms = await response.json();
      const filtered = allPerms.filter((p) => (p.idRol || p.id_rol) === rol.id);
      setRolePermissions(filtered);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error al cargar permisos detallados:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <PageHeader
        icon={ShieldCheck}
        title="Gestión de Roles y Permisos"
        subtitle="MSG Repuestos - Panel de control de acceso y seguridad"
        buttonText="Crear Nuevo Rol"
        onButtonClick={handleCreateRole}
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
          loading={loading || isLoadingDetails}
          onView={handleViewDetails}
          onEdit={(rol) => console.log("Editando rol:", rol.id)}
          onDelete={(rol) => console.log("Eliminando rol:", rol.id)}
          // 2. Pasamos la nueva función a la tabla
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
    </div>
  );
};

export default GestionRoles;
