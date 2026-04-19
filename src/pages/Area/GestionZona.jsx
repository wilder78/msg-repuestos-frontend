import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import SuccessToast from "../../components/ui/SuccessToast";
import PageHeader from "../../components/shared/PageHeader";
import AreaTable from "./components/AreaTable";
import AreaCreateModal from "./components/AreaCreateModal";
import AreaEditModal from "./components/AreaEditModal";
import AreaDeleteModal from "./components/AreaDeleteModal";
import AreaDetailsModal from "./components/AreaDetailsModal";


const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const normalizeZone = (zone) => ({
  id: zone.idZona?.toString() || zone.id_zona?.toString() || "",
  name: zone.nombreZona || zone.nombre_zona || "",
  description: zone.descripcion || "",
  statusId: zone.idEstado || zone.id_estado,
});

export default function GestionZona() {
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showSuccessToast = (title, message) => {
    setToastConfig({
      visible: true,
      title,
      message,
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleZoneCreated = (name) => {
    showSuccessToast("Zona registrada", `La zona "${name}" ha sido creada correctamente.`);
  };

  const handleZoneUpdated = (name) => {
    showSuccessToast("Zona actualizada", `La zona "${name}" ha sido actualizada correctamente.`);
  };

  const handleZoneDeleted = (name) => {
    showSuccessToast("Zona eliminada", `La zona "${name}" ha sido eliminada permanentemente.`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteZone) return;

    try {
      setIsSaving(true);
      setPageError(null);
      
      const res = await authFetch(`http://localhost:8080/api/zonas/${deleteZone.id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setZones((prev) =>
          prev.filter((zone) => zone.id.toString() !== deleteZone.id.toString())
        );
        setIsDeleteOpen(false);
        handleZoneDeleted(deleteZone.name);
        setDeleteZone(null);
      } else {
        const errorData = await res.json();
        setDeleteError(errorData.message || "No se puede eliminar este registro debido a que tiene datos asociados en otros módulos. Considere inactivarlo en su lugar.");
      }
    } catch (err) {
      console.error("Error inactivando zona:", err);
      setDeleteError("Error de comunicación con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const [editZone, setEditZone] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombreZona: "",
    descripcion: "",
    idEstado: 1,
  });
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteZone, setDeleteZone] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        setPageError(null);
        const response = await authFetch("http://localhost:8080/api/zonas");
        if (!response.ok) throw new Error("Error al obtener zonas");
        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.map(normalizeZone)
          : [];
        setZones(normalized);
      } catch (err) {
        setPageError(`No se pudo cargar la lista de zonas.`);
        console.error("Error al cargar zonas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  const filteredZones = useMemo(
    () =>
      zones.filter((zone) => {
        const term = searchTerm.toLowerCase();
        return (
          zone.id.toString().toLowerCase().includes(term) ||
          zone.name.toLowerCase().includes(term) ||
          zone.description.toLowerCase().includes(term)
        );
      }),
    [zones, searchTerm]
  );

  const handleCreateZone = async (newArea) => {
    try {
      setIsSaving(true);
      setPageError(null);
      const response = await authFetch("http://localhost:8080/api/zonas", {
        method: "POST",
        body: JSON.stringify(newArea)
      });
      
      if (response.ok) {
        const data = await response.json();
        const createdZone = data.data || data;
        const normalized = normalizeZone(createdZone);
        setZones((prev) => [normalized, ...prev]);
        return true;
      }
      const errorData = await response.json();
      return errorData.message || "No se pudo crear la zona.";
    } catch (err) {
      console.error("Error creando zona:", err);
      return "No se pudo crear la zona.";
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditZone = (zone) => {
    setEditZone(zone);
    setEditFormData({
      nombreZona: zone.name || "",
      descripcion: zone.description || "",
      idEstado: zone.statusId,
    });
    setIsEditOpen(true);
  };

  const handleUpdateZone = async () => {
    if (!editZone) return false;

    try {
      setIsSaving(true);
      setPageError(null);
      const payload = {
        nombre_zona: editFormData.nombreZona.trim(),
        descripcion: editFormData.descripcion.trim(),
        id_estado: editFormData.idEstado,
      };

      const response = await authFetch(`http://localhost:8080/api/zonas/${editZone.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const updatedZone = data.data || data;
        const normalized = normalizeZone(updatedZone);
        setZones((prev) =>
          prev.map((zone) => (zone.id === normalized.id ? normalized : zone))
        );
        return true;
      }
      const errorData = await response.json();
      return errorData.message || "No se pudo actualizar la zona.";
    } catch (err) {
      console.error("Error actualizando zona:", err);
      return "No se pudo actualizar la zona.";
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewZone = (zone) => {
    setSelectedZone(zone);
    setIsDetailsOpen(true);
  };

  const handleDeleteZone = (zone) => {
    setDeleteZone(zone);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleStatusChangeSuccess = (zoneId, nextStatus) => {
    setZones((prev) =>
      prev.map((z) => (z.id.toString() === zoneId.toString() ? { ...z, statusId: nextStatus } : z))
    );
    showSuccessToast(
      "Estado actualizado",
      `La zona ahora está ${nextStatus === 1 ? "Activa" : "Inactiva"}.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      <SuccessToast
        visible={toastConfig.visible}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
      />
      <PageHeader
        icon={MapPin}
        title="Gestión de Zonas"
        subtitle="Gestiona las zonas de cobertura comercial"
        buttonText="Crear Zona"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <Card className="overflow-hidden bg-white shadow-xl shadow-slate-200/60 rounded-3xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Listado de Zonas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gestiona las zonas de cobertura comercial
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar zona..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {pageError ? (
            <div className="p-10 text-center text-sm text-red-600">{pageError}</div>
          ) : (
            <AreaTable
              zones={filteredZones}
              loading={loading}
              authFetch={authFetch}
              onView={handleViewZone}
              onEdit={handleEditZone}
              onDelete={handleDeleteZone}
              onToggleStatus={handleStatusChangeSuccess}
            />
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500">
          {filteredZones.length} zona(s) encontrada(s)
        </div>
      </Card>

      <AreaCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateArea={handleCreateZone}
        onSaveSuccess={handleZoneCreated}
        isSaving={isSaving}
      />

      <AreaEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditZone(null);
        }}
        zone={editZone}
        formData={editFormData}
        onInputChange={(e) =>
          setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
        onSubmit={handleUpdateZone}
        onSaveSuccess={handleZoneUpdated}
        loading={isSaving}
      />

      <AreaDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteZone(null);
          setDeleteError(null);
        }}
        zone={deleteZone}
        onConfirm={handleDeleteConfirm}
        loading={isSaving}
        error={deleteError}
      />

      <AreaDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedZone(null);
        }}
        zone={selectedZone}
      />
    </div>
  );
}
