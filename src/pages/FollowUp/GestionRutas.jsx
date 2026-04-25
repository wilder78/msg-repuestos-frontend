import React, { useState, useEffect } from "react";
import { Map } from "lucide-react";

import { useRoutes } from "../../hooks/useRoutes";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";

import RouteTable from "./components/RouteTable";
import RouteDetailsModal from "./components/RouteDetailsModal";
import RouteCreateModal from "./components/RouteCreateModal";
import RouteEditModal from "./components/RouteEditModal";
import SuccessToast from "../../components/ui/SuccessToast";

const GestionRutas = () => {
  const { routes, setRoutes, loading, authFetch, refresh } = useRoutes();

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

  const [createFormData, setCreateFormData] = useState({
    nombreRuta: "",
    idZona: "",
    idEmpleado: "",
    fechaPlanificada: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // Fetch Zonas and Empleados on mount
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [resZonas, resEmpleados] = await Promise.all([
          authFetch("http://localhost:8080/api/zonas"),
          authFetch("http://localhost:8080/api/employees"),
        ]);
        if (resZonas.ok) {
          const data = await resZonas.json();
          setZonas(data.data || data.zonas || data.content || data || []);
        }
        if (resEmpleados.ok) {
          const data = await resEmpleados.json();
          const empList = data.data || data.empleados || data.content || data || [];
          
          const filteredEmpleados = empList.filter((emp) => {
            const roleId = emp.usuario?.idRol || emp.usuario?.id_rol || emp.usuario?.rol?.idRol || emp.idRol || emp.id_rol;
            return roleId === 3;
          }).map(emp => ({
            ...emp,
            idEmpleado: emp.idEmpleado || emp.id || emp.idEmployee,
          }));

          setEmpleados(filteredEmpleados);
        }
      } catch (err) {
        console.error("Error fetching dependencies:", err);
      }
    };
    fetchDependencies();
  }, [authFetch]);

  const showToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const toggleModal = (type, isOpen, route = null) => {
    setSelectedRoute(route);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
    if (type === "create" && isOpen) {
      setCreateFormData({
        nombreRuta: "",
        idZona: "",
        idEmpleado: "",
        fechaPlanificada: "",
      });
    }
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

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSelectChange = (name, value) => {
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...createFormData,
        idZona: parseInt(createFormData.idZona),
        idEmpleado: parseInt(createFormData.idEmpleado),
        idEstadoRuta: 1, // Default to active
      };

      const res = await authFetch("http://localhost:8080/api/rutas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear la ruta");

      await refresh(); // Fetch full list again to populate all relationships (empleado, zona)
      return true;
    } catch (err) {
      console.error(err);
      showToast("Error", "No se pudo crear la ruta");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = (route) => {
    toggleModal("view", true, route);
  };

  const handleEdit = (route) => {
    toggleModal("edit", true, route);
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
        onButtonClick={() => toggleModal("create", true)}
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

      <RouteCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
        formData={createFormData}
        onInputChange={handleCreateInputChange}
        onSelectChange={handleCreateSelectChange}
        onSubmit={handleCreateSubmit}
        loading={isSaving}
        listaZonas={zonas}
        listaEmpleados={empleados}
        onSaveSuccess={(name) => showToast("Ruta Creada", `La ruta ${name} fue registrada con éxito.`)}
      />

      <RouteEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        route={selectedRoute}
        listaZonas={zonas}
        listaEmpleados={empleados}
        authFetch={authFetch}
        onSaveSuccess={async (name) => {
          showToast("Ruta Editada", `La ruta ${name} fue actualizada con éxito.`);
          await refresh();
        }}
      />
    </div>
  );
};

export default GestionRutas;
