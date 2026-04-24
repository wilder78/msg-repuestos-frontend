import React, { useState } from "react";
import { Map } from "lucide-react";

import { useRoutes } from "../../hooks/useRoutes";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";

import RouteTable from "./components/RouteTable";
import RouteDetailsModal from "./components/RouteDetailsModal";
import SuccessToast from "../../components/ui/SuccessToast";

const GestionRutas = () => {
  const { routes, setRoutes, loading, authFetch } = useRoutes();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const routesPerPage = 8;

  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });

  const showToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const toggleModal = (type, isOpen, route = null) => {
    setSelectedRoute(route);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  // ✅ Handler para el cambio de estado (Éxito desde componente global)
  const handleStatusChangeSuccess = (routeId, nextStatus) => {
    setRoutes((prev) =>
      prev.map((r) => {
        return r.idRuta === routeId ? { ...r, idEstadoRuta: nextStatus, idEstado: nextStatus, id_estado: nextStatus } : r;
      })
    );
    showToast(
      nextStatus === 1 ? "Ruta activada" : "Ruta inactivada",
      "El estado se actualizó correctamente."
    );
  };

  // ─── Handlers de Acciones (Placeholder) ──────────────────────────────────

  const handleView = (route) => {
    toggleModal("view", true, route);
  };

  const handleEdit = (route) => {
    showToast("Editar Ruta", `Modificar la ruta: ${route.nombreRuta || "Sin nombre"}`);
  };

  const handleDelete = (route) => {
    showToast("Eliminar Ruta", `Eliminar la ruta: ${route.nombreRuta || "Sin nombre"}`);
  };

  // ─── Filtrado y Paginación ────────────────────────────────────────────────

  const filteredRoutes = routes.filter((r) => {
    const nombre = r.nombreRuta || "";
    const zona = r.zona?.nombreZona || "";
    const empleado = r.empleado ? `${r.empleado.nombre} ${r.empleado.apellido}` : "";
    const term = searchTerm.toLowerCase();

    return (
      nombre.toLowerCase().includes(term) ||
      zona.toLowerCase().includes(term) ||
      empleado.toLowerCase().includes(term)
    );
  });

  const paginatedRoutes = filteredRoutes.slice(
    (currentPage - 1) * routesPerPage,
    currentPage * routesPerPage
  );

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen overflow-auto">
      <SuccessToast {...toastConfig} onClose={() => setToastConfig((p) => ({ ...p, visible: false }))} />

      <PageHeader
        icon={Map}
        title="Gestión de Rutas"
        subtitle="Panel administrativo MSG Repuestos"
        buttonText="Crear Ruta"
        onButtonClick={() => showToast("Crear Ruta", "Modal de creación no implementado aún.")}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <TableToolbar
          title="Rutas Registradas"
          count={filteredRoutes.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          placeholder="Buscar por nombre o descripción..."
        />

        <RouteTable
          routes={paginatedRoutes}
          loading={loading}
          authFetch={authFetch}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleStatusChangeSuccess}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredRoutes.length / routesPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODALES */}
      <RouteDetailsModal
        isOpen={modals.view}
        onClose={() => toggleModal("view", false)}
        route={selectedRoute}
      />
    </div>
  );
};

export default GestionRutas;
