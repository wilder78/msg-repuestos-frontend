import React, { useState } from "react";
import { Package } from "lucide-react";

import { useProducts } from "../../hooks/useProducts";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";

import ProductsTable from "./components/ProductsTable";

const GestionProductos = () => {
  const { products, setProducts, categoryMap, loading, authFetch } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });

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

  // ✅ Handler para el cambio de estado (Éxito desde componente global)
  const handleStatusChangeSuccess = (productId, nextStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.idProducto === productId ? { ...p, idEstado: nextStatus } : p))
    );
    showToast(
      nextStatus === 1 ? "Producto activado" : "Producto inactivado",
      "El estado se actualizó correctamente."
    );
  };

  // ─── Control de Modales ───────────────────────────────────────────────────

  const toggleModal = (type, isOpen, product = null) => {
    setSelectedProduct(product);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  // ─── Filtrado y Paginación ────────────────────────────────────────────────

  const filteredProducts = products.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria?.nombre_categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryMap[p.idCategoria]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen overflow-auto">
      <SuccessToast {...toastConfig} onClose={() => setToastConfig((p) => ({ ...p, visible: false }))} />

      <PageHeader
        icon={Package}
        title="Gestión de Productos"
        subtitle="Panel administrativo de inventario MSG Repuestos"
        buttonText="Nuevo Producto"
        onButtonClick={() => toggleModal("create", true)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <TableToolbar
          title="Productos del Sistema"
          count={filteredProducts.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          placeholder="Buscar por nombre o categoría..."
        />

        <ProductsTable
          products={paginatedProducts}
          categoryMap={categoryMap}
          loading={loading}
          authFetch={authFetch}
          onView={(p) => toggleModal("view", true, p)}
          onEdit={(p) => toggleModal("edit", true, p)}
          onDelete={(p) => toggleModal("delete", true, p)}
          onToggleStatus={handleStatusChangeSuccess}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODALES (Placeholder para futura implementación) */}
      {/* 
      {modals.create && <ProductCreateModal ... />}
      {modals.edit && <ProductEditModal ... />}
      {modals.view && <ProductDetailsModal ... />}
      {modals.delete && <ProductDeleteModal ... />}
      */}
    </div>
  );
};

export default GestionProductos;
