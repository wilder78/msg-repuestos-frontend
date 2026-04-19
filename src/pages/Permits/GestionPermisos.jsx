import React, { useState, useEffect } from "react";
import { Key } from "lucide-react";

// Componentes compartidos que ya usas en Usuarios
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";

// Componente de tabla que creamos arriba
import AllowTable from "./components/AllowTable";
import AllowDetailsModal from "./components/AllowDetailsModal";
import AllowCreateModal from "./components/AllowCreateModal";
import AllowEditModal from "./components/AllowEditModal";
import AllowDeleteModal from "./components/AllowDeleteModal";




const GestionPermisos = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Estados para Modales
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);




  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // Función para obtener los permisos de la API
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch("http://localhost:8080/api/permissions", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawData = Array.isArray(data) ? data : data.data || [];
        
        // Normalización para manejar snake_case y asegurar idEstado
        const formatted = rawData.map(p => ({
          ...p,
          idPermiso: p.idPermiso || p.id_permiso || p.id,
          nombrePermiso: p.nombrePermiso || p.nombre_permiso || p.nombre,
          idEstado: p.idEstado || p.id_estado || 1, // Default a 1 (Activo) si no viene
        }));
        
        setPermissions(formatted);
      }
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Lógica de filtrado (Nombre o Descripción)
  const filteredPermissions = permissions.filter(
    (p) =>
      p.nombrePermiso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(() => setToastConfig((prev) => ({ ...prev, visible: false })), 4500);
  };

  const handleViewDetails = (permission) => {
    setSelectedPermission(permission);
    setIsDetailsOpen(true);
  };

  const handlePermitCreated = (nombre) => {
    showToast("Permiso creado", `El permiso "${nombre}" se ha registrado exitosamente.`);
    fetchPermissions();
  };

  const handlePermitUpdated = (nombre) => {
    showToast("Permiso actualizado", `El permiso "${nombre}" se ha actualizado correctamente.`);
    fetchPermissions();
  };

  const handleConfirmDelete = async (permiso) => {
    const id = permiso.idPermiso || permiso.id;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/permissions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast("Permiso eliminado", `El permiso "${permiso.nombrePermiso}" ha sido eliminado del sistema.`);
        setIsDeleteOpen(false);
        fetchPermissions();
      } else {
        const errorData = await res.json();
        setDeleteError(errorData.message || "No se puede eliminar: El permiso tiene dependencias activas.");
      }
    } catch (err) {
      console.error("Error en la petición de eliminación:", err);
    } finally {
      setIsDeleting(false);
    }
  };




  const handleToggleStatus = async (permission) => {
    const nextStatus = permission.idEstado === 1 ? 2 : 1;
    const id = permission.idPermiso || permission.id;
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // Se intenta con plural, si falla el 404 podría ser por falta del endpoint en el backend
      const res = await fetch(`http://localhost:8080/api/permissions/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idEstado: nextStatus }),
      });

      if (res.ok) {
        setPermissions((prev) =>
          prev.map((p) =>
            (p.idPermiso === id || p.id === id) ? { ...p, idEstado: nextStatus } : p
          )
        );
        showToast(
          nextStatus === 1 ? "Permiso activado" : "Permiso inactivado",
          `El permiso "${permission.nombrePermiso}" se ${
            nextStatus === 1 ? "activó" : "inactivó"
          } correctamente.`
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <SuccessToast
        visible={toastConfig.visible}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
      />

      <PageHeader
        icon={Key}
        title="Gestión de Permisos del Sistema"
        subtitle="MSG Repuestos - Panel de administración de permisos y accesos"
        buttonText="Crear Nuevo Permiso"
        onButtonClick={() => setIsCreateOpen(true)}
      />


      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TableToolbar
          title="Permisos del Sistema"
          count={filteredPermissions.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre o descripción..."
        />

        <AllowTable
          permissions={paginatedPermissions}
          loading={loading}
          onView={handleViewDetails}
          onEdit={(p) => {
            setSelectedPermission(p);
            setIsEditOpen(true);
          }}
          onDelete={(p) => {
            setSelectedPermission(p);
            setDeleteError(null);
            setIsDeleteOpen(true);
          }}
          onToggleStatus={handleToggleStatus}

        />


        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AllowDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        permiso={selectedPermission}
      />

      <AllowCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPermitCreated={handlePermitCreated}
      />

      <AllowEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        permiso={selectedPermission}
        onPermitUpdated={handlePermitUpdated}
      />

      <AllowDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        permiso={selectedPermission}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        error={deleteError}
      />



    </div>
  );
};

export default GestionPermisos;