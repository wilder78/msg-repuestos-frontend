import React, { useState, useEffect, useMemo } from "react";
import { UserCog, Loader2 } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import TableToolbar from "../../components/shared/TableToolbar";
import TablePagination from "../../components/shared/TablePagination";
import SuccessToast from "../../components/ui/SuccessToast";
import { EmployeeTable } from "./components/EmployeeTable";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import EmployeeEditModal from "./components/EmployeeEditModal";
import EmployeeDeleteModal from "./components/EmployeeDeleteModal";
import EmployeeCreateModal from "./components/EmployeeCreateModal";

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
const ROLE_ENDPOINT = "http://localhost:8080/api/roles";
const CUSTOMER_ENDPOINT = "http://localhost:8080/api/customers";

const mapEmployee = (empleado, userEmailMap = {}) => {
  const idUsuario = empleado.idUsuario || empleado.id_usuario || null;
  const userEmail = idUsuario ? userEmailMap[idUsuario] : undefined;

  const cargoDelUsuario = empleado.usuario?.rol?.nombreRol || empleado.usuario?.rol?.nombre;
  
  const cargoDirecto =
    empleado.rolOperativo ||
    empleado.rol_operativo ||
    empleado.nombreRol ||
    empleado.cargo;

  return {
    id: empleado.idEmpleado || empleado.id || empleado.idEmployee || "",
    nombres: empleado.nombre || "",
    apellidos: empleado.apellido || "",
    foto: "",
    cargo: cargoDelUsuario || cargoDirecto || "Personal Operativo",
    email: userEmail || empleado.usuario?.email || "",
    telefono: empleado.telefono || "",
    numeroDocumento: empleado.numeroDocumento || "",
    estado: empleado.activo === false ? "inactivo" : "activo",
    statusId: empleado.activo === false ? 0 : 1,
    idUsuario,
    idRol: empleado.usuario?.idRol || empleado.usuario?.id_rol || null,
    disponibilidad: empleado.disponibilidad ?? false,
    activo: empleado.activo ?? true,
    idTipoDocumento: empleado.idTipoDocumento,
  };
};

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [customerEmails, setCustomerEmails] = useState(new Set()); // Nueva lista de emails bloqueados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const empleadosPerPage = 8;

  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modals, setModals] = useState({
    view: false,
    edit: false,
    delete: false,
    create: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    idTipoDocumento: 1,
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rolOperativo: "",
    idUsuario: null,
    disponibilidad: 1,
    id_estado: 1,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successToast, setSuccessToast] = useState({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      setError("");
      try {
        const [employeeRes, userRes, roleRes, customerRes] = await Promise.all([
          authFetch(EMPLOYEE_ENDPOINT),
          authFetch(USER_ENDPOINT),
          authFetch(ROLE_ENDPOINT),
          authFetch(CUSTOMER_ENDPOINT),
        ]);

        if (!employeeRes.ok || !userRes.ok || !roleRes.ok || !customerRes.ok) {
          throw new Error("Error al cargar datos del servidor");
        }

        const employeePayload = await employeeRes.json();
        const userPayload = await userRes.json();
        const rolePayload = await roleRes.json();
        const customerPayload = await customerRes.json();

        const rawData =
          employeePayload?.data ||
          employeePayload?.empleados ||
          employeePayload ||
          [];

        const userData =
          userPayload?.data ||
          userPayload?.usuarios ||
          userPayload ||
          [];

        const customerData =
          customerPayload?.data ||
          customerPayload?.clientes ||
          customerPayload ||
          [];

        const lista = Array.isArray(rawData) ? rawData : [];
        const usuarios = Array.isArray(userData) ? userData : [];
        const clientes = Array.isArray(customerData) ? customerData : [];

        // Guardar emails de clientes para bloqueo dinámico
        const emailsBloqueados = new Set(
          clientes.map((c) => (c.email || c.correo || "").toLowerCase().trim())
        );
        setCustomerEmails(emailsBloqueados);

        const userEmailMap = usuarios.reduce((map, user) => {
          const userId = user.idUsuario || user.id;
          if (userId) {
            map[userId] = user.email || user.correo || "";
          }
          return map;
        }, {});

        const listRoles = (rolePayload.data || rolePayload.roles || rolePayload || [])
          .filter((r) => 
            r.nombreRol?.toLowerCase() !== "cliente" && 
            r.idRol !== 4 && r.idRol !== 1
          );

        setAllUsers(usuarios);
        setRoles(listRoles);
        setEmpleados(
          lista.map((empleado) => mapEmployee(empleado, userEmailMap)),
        );
        setLoading(false);
      } catch (fetchError) {
        console.warn("Error al cargar empleados:", fetchError);
        setError("No se pudieron cargar los empleados.");
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const availableUsers = useMemo(() => {
    // 1. Obtener IDs de usuarios ya asignados convertidos a String para comparación segura
    const assignedUserIds = new Set(
      empleados
        .map((emp) => emp.idUsuario?.toString())
        .filter((id) => id !== null && id !== undefined)
    );

    // 2. Filtrar allUsers ocultando los que ya están asignados Y los que son "Clientes" o "Proveedores"
    return allUsers.filter((u) => {
      const userId = (u.idUsuario || u.id)?.toString();
      const userEmail = (u.email || u.correo || "").toLowerCase().trim();
      const roleName = (u.rol?.nombreRol || u.nombreRol || u.cargo || "").toLowerCase();
      
      // Condición 1: No debe estar asignado a otro empleado
      const isNotAssigned = userId && !assignedUserIds.has(userId);

      // Condición 2: El correo NO debe pertenecer a la base de datos de clientes
      const isNotACustomerEmail = !customerEmails.has(userEmail);
      
      // Condición 3: No debe tener un rol asociado a entidades externas
      const hasRestrictedRole = 
        u.idRol === 4 || u.id_rol === 4 || u.idRol === 1 || u.id_rol === 1 ||
        u.rol?.idRol === 4 || u.rol?.idRol === 1 ||
        roleName.includes("cliente") || 
        roleName.includes("proveedor") ||
        roleName.includes("moto") || // Bloqueo preventivo orientado a tus clientes (Talleres)
        roleName.includes("externo");
      
      // Condición 4: No debe tener vínculos directos a otras tablas
      const hasExternalLink = 
        (u.idCliente && u.idCliente !== 0) || 
        (u.id_cliente && u.id_cliente !== 0) ||
        (u.idProveedor && u.idProveedor !== 0) ||
        (u.id_proveedor && u.id_proveedor !== 0);

      return isNotAssigned && isNotACustomerEmail && !hasRestrictedRole && !hasExternalLink;
    });
  }, [empleados, allUsers, customerEmails]);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((empleado) => {
      const search = searchTerm.toLowerCase();
      return (
        empleado.nombres.toLowerCase().includes(search) ||
        empleado.apellidos.toLowerCase().includes(search) ||
        empleado.cargo.toLowerCase().includes(search) ||
        empleado.email.toLowerCase().includes(search)
      );
    });
  }, [empleados, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredEmpleados.length / empleadosPerPage));

  const paginatedEmpleados = useMemo(() => {
    const startIndex = (currentPage - 1) * empleadosPerPage;
    return filteredEmpleados.slice(startIndex, startIndex + empleadosPerPage);
  }, [filteredEmpleados, currentPage]);

  const getCargoStyle = (cargo) => {
    const normalized = cargo?.toLowerCase() || "";
    if (normalized.includes("admin")) return "bg-blue-100 text-blue-700";
    if (normalized.includes("ventas") || normalized.includes("vendedor")) return "bg-emerald-100 text-emerald-700";
    if (normalized.includes("bodega")) return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const handleToggleStatus = async (empleado) => {
    try {
      const newStatus = empleado.statusId === 1 ? 0 : 1;
      const response = await authFetch(`${EMPLOYEE_ENDPOINT}/${empleado.id}`, {
        method: "PUT",
        body: JSON.stringify({ activo: newStatus === 1 }),
      });
      if (!response.ok) throw new Error("Error al cambiar el estado");
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === empleado.id
            ? { ...emp, statusId: newStatus, estado: newStatus === 1 ? "activo" : "inactivo" }
            : emp
        )
      );
      showSuccessToast(
        newStatus === 1 ? "Empleado Activado" : "Empleado Inactivado",
        `El empleado "${empleado.nombres}" se actualizó correctamente.`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = (type, isOpen, empleado = null) => {
    setSelectedEmpleado(empleado);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
    if (!isOpen) {
      setDeleteError(null);
      if (type === "create") {
        setCreateFormData({
          idTipoDocumento: 1,
          numeroDocumento: "",
          nombre: "",
          apellido: "",
          telefono: "",
          rolOperativo: "",
          idUsuario: null,
          disponibilidad: 1,
          id_estado: 1,
        });
      }
    }
  };

  const handleEmpleadoUpdated = (updatedEmpleado) => {
    setEmpleados((prev) =>
      prev.map((emp) => (emp.id === updatedEmpleado.id ? { ...emp, ...updatedEmpleado } : emp))
    );
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSelectChange = (name, value) => {
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async () => {
    setCreateLoading(true);
    try {
      const payload = {
        ...createFormData,
        idUsuario: createFormData.idUsuario ? parseInt(createFormData.idUsuario) : null
      };
      const response = await authFetch(EMPLOYEE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al crear empleado");
      const newEmpleadoRaw = await response.json();
      const mapped = mapEmployee(newEmpleadoRaw.data || newEmpleadoRaw);
      setEmpleados((prev) => [mapped, ...prev]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const showSuccessToast = (title, message) => {
    setSuccessToast({ visible: true, title, message });
    setTimeout(() => setSuccessToast((prev) => ({ ...prev, visible: false })), 4500);
  };

  const handleEmpleadoSaveSuccess = (name, isNew = false) => {
    showSuccessToast(
      isNew ? "Empleado registrado" : "Empleado actualizado",
      isNew ? `"${name}" ha sido dado de alta correctamente.` : `Los cambios se aplicaron correctamente.`
    );
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmpleado) return;
    try {
      const response = await authFetch(`${EMPLOYEE_ENDPOINT}/${selectedEmpleado.id}`, { method: "DELETE" });
      if (response.status === 409) {
        setDeleteError("No se puede eliminar el empleado porque tiene historial vinculado.");
        return;
      }
      if (!response.ok) throw new Error("Error al eliminar");
      setEmpleados((prev) => prev.filter((emp) => emp.id !== selectedEmpleado.id));
      toggleModal("delete", false);
      showSuccessToast("Empleado eliminado", "El registro ha sido eliminado.");
    } catch (error) {
      setDeleteError("Error inesperado al intentar eliminar.");
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8f9fa] min-h-screen">
      <PageHeader
        icon={UserCog}
        title="Gestión de Empleados"
        subtitle="Administra los empleados de MSG Repuestos"
        buttonText="Registrar Empleado"
        onButtonClick={() => toggleModal("create", true)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TableToolbar
          title="Empleados"
          count={filteredEmpleados.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          placeholder="Buscar empleado..."
        />

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
            <p className="mt-3">Cargando datos...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">{error}</div>
        ) : (
          <EmployeeTable
            empleados={paginatedEmpleados}
            onView={(emp) => toggleModal("view", true, emp)}
            onEdit={(emp) => toggleModal("edit", true, emp)}
            onDelete={(emp) => toggleModal("delete", true, emp)}
            onToggleStatus={handleToggleStatus}
            getCargoStyle={getCargoStyle}
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
        roles={roles}
        availableUsers={availableUsers}
        usedUserIds={Array.from(
          new Set(
            empleados
              .map((e) => e.idUsuario)
              .filter((id) => id !== null && id !== undefined)
          )
        )}
        onEmpleadoUpdated={handleEmpleadoUpdated}
        onSaveSuccess={handleEmpleadoSaveSuccess}
      />

      <EmployeeDeleteModal
        isOpen={modals.delete}
        onClose={() => toggleModal("delete", false)}
        empleado={selectedEmpleado}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />

      <EmployeeCreateModal
        isOpen={modals.create}
        onClose={() => toggleModal("create", false)}
        formData={createFormData}
        roles={roles}
        availableUsers={availableUsers}
        onInputChange={handleCreateInputChange}
        onSelectChange={handleCreateSelectChange}
        onSubmit={handleCreateSubmit}
        loading={createLoading}
        onSaveSuccess={(name) => handleEmpleadoSaveSuccess(name, true)}
      />
    </div>
  );
};

export default GestionEmpleados;
