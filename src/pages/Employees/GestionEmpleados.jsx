import React, { useState, useEffect, useMemo } from "react";
import { UserCog, Loader2 } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";
import { EmployeeTable } from "./components/EmployeeTable";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import EmployeeEditModal from "./components/EmployeeEditModal";

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

const EMPLOYEE_ENDPOINT = "http://localhost:8080/api/employees";
const USER_ENDPOINT = "http://localhost:8080/api/users";

const mapEmployee = (empleado, userEmailMap = {}) => {
  const idUsuario = empleado.idUsuario || empleado.id_usuario || null;
  const userEmail = idUsuario ? userEmailMap[idUsuario] : undefined;

  return {
    id: empleado.idEmpleado || empleado.id || empleado.idEmployee || "",
    nombres: empleado.nombre || "",
    apellidos: empleado.apellido || "",
    foto: "",
    cargo:
      empleado.rolOperativo ||
      empleado.rol_operativo ||
      empleado.cargo ||
      empleado.puesto ||
      empleado.role ||
      "Sin cargo",
    email: userEmail || "",
    telefono: empleado.telefono || "",
    numeroDocumento: empleado.numeroDocumento || "",
    estado: empleado.activo === false ? "inactivo" : "activo",
    statusId: empleado.activo === false ? 0 : 1,
    idUsuario,
    disponibilidad: empleado.disponibilidad ?? false,
    activo: empleado.activo ?? true,
    idTipoDocumento: empleado.idTipoDocumento,
  };
};

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const empleadosPerPage = 8;

  // Modal state
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modals, setModals] = useState({
    view: false,
    edit: false,
  });
  const [editToast, setEditToast] = useState({
    visible: false,
    empleadoName: "",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      setError("");

      try {
        const [employeeRes, userRes] = await Promise.all([
          authFetch(EMPLOYEE_ENDPOINT),
          authFetch(USER_ENDPOINT),
        ]);

        if (!employeeRes.ok) {
          throw new Error(`Error al cargar empleados: ${employeeRes.status}`);
        }

        if (!userRes.ok) {
          throw new Error(
            `Error al cargar usuarios relacionados: ${userRes.status}`,
          );
        }

        const employeePayload = await employeeRes.json();
        const userPayload = await userRes.json();

        const rawData =
          employeePayload?.data ||
          employeePayload?.empleados ||
          employeePayload?.employees ||
          employeePayload ||
          [];

        const userData =
          userPayload?.data ||
          userPayload?.usuarios ||
          userPayload?.users ||
          userPayload ||
          [];

        const lista = Array.isArray(rawData) ? rawData : [];
        const usuarios = Array.isArray(userData) ? userData : [];

        const userEmailMap = usuarios.reduce((map, user) => {
          const userId =
            user.id || user.idUsuario || user.id_user || user.id_usuario;
          if (userId) {
            map[userId] = user.email || user.correo || user.mail || "";
          }
          return map;
        }, {});

        setEmpleados(
          lista.map((empleado) => mapEmployee(empleado, userEmailMap)),
        );
        setLoading(false);
      } catch (fetchError) {
        console.warn("Error al cargar empleados:", fetchError);
        setError(
          "No se pudieron cargar los empleados. Verifique la conexión o la URL de la API.",
        );
        setLoading(false);
      }
    };

    void loadEmployees();
  }, []);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((empleado) => {
      const search = searchTerm.toLowerCase();
      return (
        empleado.nombres.toLowerCase().includes(search) ||
        empleado.apellidos.toLowerCase().includes(search) ||
        empleado.cargo.toLowerCase().includes(search) ||
        empleado.email.toLowerCase().includes(search) ||
        empleado.ciudad.toLowerCase().includes(search)
      );
    });
  }, [empleados, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmpleados.length / empleadosPerPage),
  );

  const paginatedEmpleados = useMemo(() => {
    const startIndex = (currentPage - 1) * empleadosPerPage;
    return filteredEmpleados.slice(startIndex, startIndex + empleadosPerPage);
  }, [filteredEmpleados, currentPage]);

  const getCargoStyle = (cargo) => {
    const normalized = cargo?.toLowerCase() || "";
    if (normalized.includes("admin") || normalized.includes("gerente")) {
      return "bg-blue-100 text-blue-700";
    }
    if (
      normalized.includes("ventas") ||
      normalized.includes("vendedor") ||
      normalized.includes("comercial")
    ) {
      return "bg-emerald-100 text-emerald-700";
    }
    if (normalized.includes("bodega") || normalized.includes("almac")) {
      return "bg-amber-100 text-amber-700";
    }
    if (normalized.includes("conta") || normalized.includes("finan")) {
      return "bg-violet-100 text-violet-700";
    }
    return "bg-slate-100 text-slate-700";
  };

  const handleToggleStatus = async (empleado) => {
    try {
      const newStatus = empleado.statusId === 1 ? 0 : 1;
      const response = await authFetch(`${EMPLOYEE_ENDPOINT}/${empleado.id}`, {
        method: "PUT",
        body: JSON.stringify({ activo: newStatus === 1 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al cambiar el estado: ${response.status} ${response.statusText} ${
            errorText ? `- ${errorText}` : ""
          }`,
        );
      }

      // Actualizar el estado local
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === empleado.id
            ? {
                ...emp,
                statusId: newStatus,
                estado: newStatus === 1 ? "activo" : "inactivo",
              }
            : emp,
        ),
      );

      // Mostrar toast de éxito
      console.log(
        `Estado de ${empleado.nombres} cambiado a ${newStatus === 1 ? "activo" : "inactivo"}`,
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      // Mostrar toast de error si es necesario
    }
  };

  // ─── Control de Modales ───────────────────────────────────────────────────

  const toggleModal = (type, isOpen, empleado = null) => {
    setSelectedEmpleado(empleado);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const handleViewEmpleado = (empleado) => {
    toggleModal("view", true, empleado);
  };

  const handleEditEmpleado = (empleado) => {
    toggleModal("edit", true, empleado);
  };

  const handleEmpleadoUpdated = (updatedEmpleado) => {
    setEmpleados((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmpleado.id ? { ...emp, ...updatedEmpleado } : emp,
      ),
    );
  };

  const handleEmpleadoSaveSuccess = (name) => {
    setEditToast({ visible: true, empleadoName: name });
    setTimeout(() => {
      setEditToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <PageHeader
        icon={UserCog}
        title="Gestión de Empleados"
        subtitle="Administra los empleados de MSG Repuestos"
        buttonText="Registrar Empleado"
        onButtonClick={() => console.log("Abrir modal de registro")}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TableToolbar
          title="Empleados"
          count={filteredEmpleados.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre, contacto, dirección..."
        />

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <span>Cargando empleados desde la base de datos...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50 border-t border-red-100">
            {error}
          </div>
        ) : (
          <EmployeeTable
            empleados={paginatedEmpleados}
            onView={handleViewEmpleado}
            onEdit={handleEditEmpleado}
            onDelete={(empleado) => console.log("Eliminar empleado", empleado)}
            onToggleStatus={handleToggleStatus}
            getCargoStyle={getCargoStyle}
          />
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <SuccessToast
        visible={editToast.visible}
        title="Empleado actualizado"
        message={`Los cambios de "${editToast.empleadoName}" se aplicaron correctamente.`}
        onClose={() => setEditToast((prev) => ({ ...prev, visible: false }))}
      />

      <EmployeeDetailsModal
        isOpen={modals.view}
        onClose={() => toggleModal("view", false)}
        empleado={selectedEmpleado}
        getCargoStyle={getCargoStyle}
      />

      <EmployeeEditModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        empleado={selectedEmpleado}
        onEmpleadoUpdated={handleEmpleadoUpdated}
        onSaveSuccess={handleEmpleadoSaveSuccess}
      />
    </div>
  );
};

export default GestionEmpleados;
