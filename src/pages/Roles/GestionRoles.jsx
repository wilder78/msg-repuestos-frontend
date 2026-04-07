import React, { useState, useMemo, useEffect } from "react"; // 1. Añadimos useEffect
import { useRoles } from "../../hooks/useRoles";
import RolesTable from "./components/RolesTable";
import RoleDetailsModal from "./components/RoleDetailsModal";
import RoleCreateModal from "./components/RolCreateModal";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import { toast } from "sonner"; // O tu librería de notificaciones

const GestionRoles = () => {
  const { roles, setRoles, loading, refresh } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 8;

  // Estados para Modales
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // 3. Estado para el modal de creación

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [allSystemPermissions, setAllSystemPermissions] = useState([]); // 4. Para cargar permisos de la DB
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // --- 5. Cargar todos los permisos del sistema al montar el componente ---
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
          // Aquí puedes usar la función groupPermissions que definimos antes si prefieres
          setAllSystemPermissions(data);
        }
      } catch (error) {
        console.error("Error cargando catálogo de permisos:", error);
      }
    };
    fetchAllPermissions();
  }, []);

  // --- Lógica de Guardado de Nuevo Rol ---
  const handleSaveNewRole = async (newRoleData) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoleData),
      });

      if (response.ok) {
        toast.success("Rol creado exitosamente");
        refresh(); // Recargamos la lista completa de la DB
        setIsCreateOpen(false);
      } else {
        toast.error("Error al crear el rol");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      toast.error("Error de conexión con el servidor");
    }
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- Agrupador de permisos para el Modal (Estilo Figma) ---
  // --- Agrupador de permisos con validaciones ---
  const groupedPermissions = useMemo(() => {
    if (!allSystemPermissions || allSystemPermissions.length === 0) return [];

    return allSystemPermissions.reduce((acc, perm) => {
      // Validación: Si el permiso no tiene nombre, lo ignoramos para evitar el error de 'split'
      if (!perm || !perm.nombre) return acc;

      // Extraemos el módulo (ej: de "ver_usuarios" extrae "usuarios")
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
        id: perm.idPermiso || perm.id, // Aseguramos capturar el ID correcto
        nombre: perm.nombre,
        desc: perm.descripcion || `Acceso a ${perm.nombre}`,
      });

      return acc;
    }, []);
  }, [allSystemPermissions]);

  // Filtros y Paginación (Se mantienen igual)
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

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <PageHeader
        icon={ShieldCheck}
        title="Gestión de Roles y Permisos"
        subtitle="MSG Repuestos - Panel de control de acceso y seguridad"
        buttonText="Crear Nuevo Rol"
        onButtonClick={() => setIsCreateOpen(true)} // 6. Abrimos el modal de creación
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
          onToggleStatus={handleToggleStatus}
          onRefresh={refresh}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal de Detalles (Existente) */}
      <RoleDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        rol={selectedRole}
        permisos={rolePermissions}
      />

      {/* 7. Nuevo Modal de Creación */}
      <RoleCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveNewRole}
        permisosDisponibles={groupedPermissions}
      />
    </div>
  );
};

export default GestionRoles;
