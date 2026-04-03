import React, { useState, useMemo } from "react";
import { useRoles } from "../../hooks/useRoles";
import RolesTable from "./components/RolesTable";
import RoleDetailsModal from "./components/RoleDetailsModal";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";

const GestionRoles = () => {
  const { roles, loading, refresh } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Este componente ahora sí está definido */}
        <TableToolbar
          title="Roles del Sistema"
          count={filteredRoles.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar por nombre o descripción..."
        />

        <RolesTable
          roles={filteredRoles}
          isLoading={loading || isLoadingDetails}
          onView={handleViewDetails}
          onEdit={(rol) => console.log("Editando rol:", rol.id)}
          onDelete={(rol) => console.log("Eliminando rol:", rol.id)}
          onRefresh={refresh}
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
