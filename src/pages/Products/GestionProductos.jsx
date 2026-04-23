import React, { useState } from "react";
import { Package } from "lucide-react";

import { useProducts } from "../../hooks/useProducts";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";

import ProductsTable from "./components/ProductsTable";
import ProductDetailsModal from "./components/ProductDetailsModal";
import ProductCreateModal from "./components/ProductCreateModal";
import ProductEditModal from "./components/ProductEditModal";
import ProductDeleteModal from "./components/ProductDeleteModal";

const INITIAL_CREATE_STATE = {
  referencia: "",
  nombre: "",
  descripcion: "",
  marca: "",
  modelo: "",
  precioCompra: "",
  stockBuenEstado: "",
  stockDefectuoso: 0,
  idCategoria: "",
  idEstado: 1,
  fechaRegistro: new Date().toISOString().split("T")[0],
};

// ✅ Mapeo camelCase → snake_case + normalización de tipos
const toFormData = (data, imageFile = null) => {
  const body = new FormData();

  const keyMap = {
    precioCompra:    "precio_compra",
    stockBuenEstado: "stock_buen_estado",
    stockDefectuoso: "stock_defectuoso",
    idCategoria:     "id_categoria",
    fechaRegistro:   "fecha_registro",
  };

  Object.entries(data).forEach(([key, value]) => {
    // ✅ Filtramos solo undefined y null — el 0 y "" con valor numérico deben pasar
    if (value === undefined || value === null) return;

    const backendKey = keyMap[key] || key;

    // ✅ Normalizar precio: asegurar punto decimal y enviar con dos decimales
    if (backendKey === "precio_compra") {
      const parsed = parseFloat(String(value).replace(",", "."));
      if (!isNaN(parsed)) body.append(backendKey, parsed.toFixed(2));
      return;
    }

    // ✅ Normalizar stock: enteros, descartar vacío
    if (backendKey === "stock_buen_estado" || backendKey === "stock_defectuoso") {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) body.append(backendKey, parsed);
      return;
    }

    // ✅ Resto de campos: omitir solo strings vacíos
    if (value !== "") body.append(backendKey, value);
  });

  if (imageFile) body.append("imagen", imageFile);
  return body;
};

// ✅ Helper para leer el token una sola vez
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

const GestionProductos = () => {
  const {
    products, setProducts,
    categories, categoryMap,
    loading, authFetch,
  } = useProducts();

  const [searchTerm, setSearchTerm]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modals, setModals] = useState({
    create: false, edit: false, view: false, delete: false,
  });

  const [createFormData, setCreateFormData] = useState(INITIAL_CREATE_STATE);
  const [editFormData, setEditFormData]     = useState({});
  const [selectedFile, setSelectedFile]     = useState(null);
  const [actionLoading, setActionLoading]   = useState(false);
  const [deleteError, setDeleteError]       = useState(null);

  const [toastConfig, setToastConfig] = useState({
    visible: false, title: "", message: "",
  });

  const showToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(() => setToastConfig((p) => ({ ...p, visible: false })), 4500);
  };

  const handleStatusChangeSuccess = (productId, nextStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.idProducto || p.id_producto) === productId ? { ...p, idEstado: nextStatus, id_estado: nextStatus } : p)
    );
    showToast(
      nextStatus === 1 ? "Producto activado" : "Producto inactivado",
      "El estado se actualizó correctamente."
    );
  };

  // ─── Modales ──────────────────────────────────────────────────────────────

  const toggleModal = (type, isOpen, product = null) => {
    setSelectedProduct(product);
    if (type === "delete" && isOpen) {
      setDeleteError(null);
    }

    if (!isOpen && type === "create") {
      setCreateFormData(INITIAL_CREATE_STATE);
      setSelectedFile(null);
    }

    if (type === "edit" && product) {
      setEditFormData({
        nombre:          product.nombre              || "",
        referencia:      product.referencia          || "",
        idCategoria:     product.idCategoria?.toString()
                         || product.id_categoria?.toString()
                         || product.categoria?.idCategoria?.toString()
                         || product.categoria?.id_categoria?.toString()
                         || "",
        marca:           product.marca               || "",
        modelo:          product.modelo              || "",
        precioCompra:    product.precioCompra        ?? product.precio_compra ?? "",
        stockBuenEstado: product.stockBuenEstado     ?? product.stock_buen_estado ?? 0,
        stockDefectuoso: product.stockDefectuoso     ?? product.stock_defectuoso ?? 0,
        descripcion:     product.descripcion         || "",
      });
      setSelectedFile(null);
    }

    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  // ✅ Handler de inputs unificado — convierte números correctamente
  const handleInputChange = (setter) => (e) => {
    const { name, value, type } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "number"
        ? (value === "" ? "" : parseFloat(value))  // ✅ nunca queda como string
        : value,
    }));
  };

  // ─── Crear ────────────────────────────────────────────────────────────────

  const onCreateSubmit = async () => {
    if (!createFormData.idCategoria) return false;
    setActionLoading(true);

    try {
      const body = toFormData(createFormData, selectedFile);
      const token = getToken();

      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al crear producto");

      const newProduct = result.data || result;
      setProducts((prev) => [newProduct, ...prev]);
      showToast("Producto registrado", `"${newProduct.nombre}" creado correctamente.`);
      toggleModal("create", false);
      return true;
    } catch (error) {
      console.error("Error al crear producto:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Editar ───────────────────────────────────────────────────────────────

  const onEditSubmit = async () => {
    if (!editFormData.idCategoria || !selectedProduct) return false;
    setActionLoading(true);

    try {
      const body = toFormData(editFormData, selectedFile);
      const token = getToken();

      const res = await fetch(
        `http://localhost:8080/api/products/${selectedProduct.idProducto || selectedProduct.id_producto}`,
        {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al actualizar producto");

      const updatedProduct = result.data || result;
      setProducts((prev) =>
        prev.map((p) =>
          (p.idProducto || p.id_producto) === (selectedProduct.idProducto || selectedProduct.id_producto) ? updatedProduct : p
        )
      );
      showToast("Producto actualizado", "Los cambios se aplicaron correctamente.");
      toggleModal("edit", false);
      return true;
    } catch (error) {
      console.error("Error al editar producto:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Eliminar ─────────────────────────────────────────────────────────────

  const onDeleteSubmit = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    setDeleteError(null);

    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:8080/api/products/${selectedProduct.idProducto || selectedProduct.id_producto}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const result = await res.json();
      
      if (!res.ok) {
        if (res.status === 409) {
           setDeleteError(result.message || "No se puede eliminar el producto porque tiene registros asociados (inventario, detalles, etc).");
           return false;
        }
        throw new Error(result.message || "Error al eliminar producto");
      }

      setProducts((prev) =>
        prev.filter((p) => (p.idProducto || p.id_producto) !== (selectedProduct.idProducto || selectedProduct.id_producto))
      );
      showToast("Producto eliminado", "El registro se borró correctamente de la base de datos.");
      toggleModal("delete", false);
      return true;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setDeleteError(error.message || "Ocurrió un error al intentar eliminar el producto.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Filtrado y Paginación ────────────────────────────────────────────────

  const filteredProducts = products.filter((p) =>
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
      <SuccessToast
        {...toastConfig}
        onClose={() => setToastConfig((p) => ({ ...p, visible: false }))}
      />

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

      <ProductCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
        formData={createFormData}
        listaCategorias={categories}
        // ✅ usa el handler unificado que convierte tipos
        onInputChange={handleInputChange(setCreateFormData)}
        onSelectChange={(name, value) =>
          setCreateFormData((p) => ({ ...p, [name]: value }))
        }
        onFileChange={(file) => setSelectedFile(file)}
        onSubmit={onCreateSubmit}
        loading={actionLoading}
        onSaveSuccess={() => {}}
      />

      <ProductEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        product={selectedProduct}
        formData={editFormData}
        listaCategorias={categories}
        // ✅ mismo handler para edición
        onInputChange={handleInputChange(setEditFormData)}
        onSelectChange={(name, value) =>
          setEditFormData((p) => ({ ...p, [name]: value }))
        }
        onFileChange={(file) => setSelectedFile(file)}
        onSubmit={onEditSubmit}
        loading={actionLoading}
        onSaveSuccess={() => {}}
      />

      {modals.view && (
        <ProductDetailsModal
          isOpen={modals.view}
          onClose={() => toggleModal("view", false)}
          product={selectedProduct}
          categoryMap={categoryMap}
        />
      )}

      {modals.delete && (
        <ProductDeleteModal
          isOpen={modals.delete}
          onClose={() => toggleModal("delete", false)}
          product={selectedProduct}
          onConfirm={onDeleteSubmit}
          loading={actionLoading}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default GestionProductos;
