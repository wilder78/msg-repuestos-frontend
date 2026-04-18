import React, { useState, useEffect, useMemo } from "react";
import { ClipboardList, Loader2, Tag } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";
import { CategoryTable } from "./components/CategoryTable";
import CategoryCreateModal from "./components/CategoryCreateModal";
import CategoryDetailsModal from "./components/CategoryDetailsModal";
import CategoryEditModal from "./components/CategoryEditModal";
import CategoryDeleteModal from "./components/CategoryDeleteModal";

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

const CATEGORY_ENDPOINT = "http://localhost:8080/api/categories";

const mapCategory = (category) => {
  return {
    id: category.id_categoria || category.id || "",
    nombre: category.nombre_categoria || category.nombre || "",
    descripcion: category.descripcion || "",
    estado: category.id_estado === 1 ? "activo" : "inactivo",
    statusId: category.id_estado ?? 1,
  };
};

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modals, setModals] = useState({
    view: false,
    edit: false,
    delete: false,
    create: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    nombre_categoria: "",
    descripcion: "",
    id_estado: 1,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [successToast, setSuccessToast] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authFetch(CATEGORY_ENDPOINT);
      if (!response.ok) throw new Error("Error al cargar categorías");
      
      const payload = await response.json();
      const rawData = payload?.data || payload?.categories || payload || [];
      const lista = Array.isArray(rawData) ? rawData : [];

      setCategorias(lista.map(mapCategory));
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategorias = useMemo(() => {
    return categorias.filter((c) => {
      const search = searchTerm.toLowerCase();
      return (
        c.nombre.toLowerCase().includes(search) ||
        c.descripcion.toLowerCase().includes(search)
      );
    });
  }, [categorias, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCategorias.length / itemsPerPage));

  const paginatedCategorias = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategorias.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategorias, currentPage]);

  const handleToggleStatus = async (category) => {
    const nextStatus = category.statusId === 1 ? 2 : 1;
    try {
      const response = await authFetch(`${CATEGORY_ENDPOINT}/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({ id_estado: nextStatus }),
      });
      if (!response.ok) throw new Error("Error al cambiar estado");
      
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? { ...c, statusId: nextStatus, estado: nextStatus === 1 ? "activo" : "inactivo" }
            : c
        )
      );
      
      showSuccessToast(
        nextStatus === 1 ? "Categoría Activada" : "Categoría Inactivada",
        `La categoría "${category.nombre}" ha sido actualizada.`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const showSuccessToast = (title, message) => {
    setSuccessToast({ visible: true, title, message });
    setTimeout(() => setSuccessToast((prev) => ({ ...prev, visible: false })), 4500);
  };

  const toggleModal = (type, isOpen, item = null) => {
    setSelectedCategory(item);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
    if (!isOpen) {
      setDeleteError(null);
      if (type === "create") {
        setCreateFormData({
          nombre_categoria: "",
          descripcion: "",
          id_estado: 1,
        });
      }
    }
  };

  const handleCreateInputChange = (newFormData) => {
    setCreateFormData(newFormData);
  };

  const handleCreateSubmit = async () => {
    setCreateLoading(true);
    try {
      const response = await authFetch(CATEGORY_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(createFormData),
      });
      if (!response.ok) throw new Error("Error al crear categoría");
      
      const resData = await response.json();
      const newCategory = mapCategory(resData.data || resData);
      setCategorias((prev) => [newCategory, ...prev]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCategoryUpdated = (updatedName) => {
    loadCategories();
    showSuccessToast("Categoría actualizada", `"${updatedName}" ha sido modificada correctamente.`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const response = await authFetch(`${CATEGORY_ENDPOINT}/${selectedCategory.id}`, { method: "DELETE" });
      
      if (response.status === 409) {
        setDeleteError("La categoría tiene productos asociados y no se puede eliminar.");
        return;
      }

      if (!response.ok) throw new Error("Error al eliminar");
      
      setCategorias((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toggleModal("delete", false);
      showSuccessToast("Categoría eliminada", "El registro ha sido borrado correctamente.");
    } catch (err) {
      setDeleteError("No se pudo completar la eliminación. Intente de nuevo.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <PageHeader
        icon={ClipboardList}
        title="Gestión de Categorías"
        subtitle="Administra las categorías de productos del inventario"
        buttonText="Nueva Categoría"
        onButtonClick={() => toggleModal("create", true)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TableToolbar
          title="Categorías"
          count={filteredCategorias.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          placeholder="Buscar categoría..."
        />

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
            <p className="mt-3">Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">{error}</div>
        ) : (
          <CategoryTable
            categorias={paginatedCategorias}
            onView={(c) => toggleModal("view", true, c)}
            onEdit={(c) => toggleModal("edit", true, c)}
            onDelete={(c) => toggleModal("delete", true, c)}
            onToggleStatus={handleToggleStatus}
          />
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <SuccessToast
        visible={successToast.visible}
        title={successToast.title}
        message={successToast.message}
        onClose={() => setSuccessToast((prev) => ({ ...prev, visible: false }))}
      />
      
      <CategoryCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
        formData={createFormData}
        onInputChange={handleCreateInputChange}
        onSubmit={handleCreateSubmit}
        loading={createLoading}
        onSaveSuccess={(name) => showSuccessToast("Categoría registrada", `"${name}" ha sido creada exitosamente.`)}
      />

      <CategoryDetailsModal
        isOpen={modals.view}
        onClose={() => toggleModal("view", false)}
        categoria={selectedCategory}
      />

      <CategoryEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        categoria={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <CategoryDeleteModal
        isOpen={modals.delete}
        onClose={() => toggleModal("delete", false)}
        categoria={selectedCategory}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default GestionCategorias;
