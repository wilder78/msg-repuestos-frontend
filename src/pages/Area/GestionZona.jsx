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
import api from "../../api/axios";

const normalizeZone = (zone) => ({
  id: zone.idZona?.toString() || "",
  name: zone.nombreZona || "",
  description: zone.descripcion || "",
  statusId: zone.activo,
});

export default function GestionZona() {
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [createToast, setCreateToast] = useState({ visible: false, zoneName: "" });
  const [editToast, setEditToast] = useState({ visible: false, zoneName: "" });
  const [deleteToast, setDeleteToast] = useState({ visible: false, zoneName: "" });
  const [editZone, setEditZone] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombreZona: "",
    descripcion: "",
  });
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteZone, setDeleteZone] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        setPageError(null);
        const response = await api.get("/zonas");
        const normalized = Array.isArray(response.data)
          ? response.data.map(normalizeZone)
          : [];
        setZones(normalized);
      } catch (err) {
        const message =
          err.response?.data?.message || err.response?.statusText || err.message;
        setPageError(`No se pudo cargar la lista de zonas. ${message}`);
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
          zone.id.toLowerCase().includes(term) ||
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
      console.debug("Creando zona", newArea);
      const response = await api.post("/zonas", newArea);
      console.debug("Respuesta de creación de zona", response.data);
      const createdZone = response.data?.data || response.data;
      if (!createdZone) {
        throw new Error("La respuesta del servidor no incluye la zona creada.");
      }
      const normalized = normalizeZone(createdZone);
      setZones((prev) => [normalized, ...prev]);
      return true;
    } catch (err) {
      const message =
        err.response?.data?.error || err.response?.data?.message || err.response?.statusText || err.message;
      const fullMessage = message
        ? message.startsWith("No se pudo crear la zona")
          ? message
          : `No se pudo crear la zona. ${message}`
        : "No se pudo crear la zona.";
      console.error("Error creando zona:", err.response?.data || err);
      return fullMessage;
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoneCreated = (name) => {
    setCreateToast({ visible: true, zoneName: name });
    setTimeout(() => {
      setCreateToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleZoneUpdated = (name) => {
    setEditToast({ visible: true, zoneName: name });
    setTimeout(() => {
      setEditToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleZoneDeleted = (name) => {
    setDeleteToast({ visible: true, zoneName: name });
    setTimeout(() => {
      setDeleteToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleDeleteZone = (zone) => {
    setDeleteZone(zone);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteZone) return;

    try {
      setIsSaving(true);
      setPageError(null);
      await api.delete(`/zonas/${deleteZone.id}`);
      setZones((prev) =>
        prev.map((zone) =>
          zone.id === deleteZone.id ? { ...zone, statusId: 0 } : zone,
        ),
      );
      setIsDeleteOpen(false);
      handleZoneDeleted(deleteZone.name);
      setDeleteZone(null);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message;
      setPageError(`No se pudo inactivar la zona. ${message}`);
      console.error("Error inactivando zona:", err.response?.data || err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditZone = (zone) => {
    setEditZone(zone);
    setEditFormData({
      nombreZona: zone.name || "",
      descripcion: zone.description || "",
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
        activo: editZone.statusId,
      };

      const response = await api.put(`/zonas/${editZone.id}`, payload);
      const updatedZone = response.data?.data || response.data;
      if (!updatedZone) {
        throw new Error("La respuesta del servidor no incluye la zona actualizada.");
      }

      const normalized = normalizeZone(updatedZone);
      setZones((prev) =>
        prev.map((zone) => (zone.id === normalized.id ? normalized : zone))
      );
      return true;
    } catch (err) {
      const message =
        err.response?.data?.error || err.response?.data?.message || err.response?.statusText || err.message;
      const fullMessage = message
        ? message.startsWith("No se pudo")
          ? message
          : `No se pudo actualizar la zona. ${message}`
        : "No se pudo actualizar la zona.";
      console.error("Error actualizando zona:", err.response?.data || err);
      return fullMessage;
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewZone = (zone) => {
    setSelectedZone(zone);
    setIsDetailsOpen(true);
  };

  const handleToggleStatus = (zoneId) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === zoneId
          ? { ...zone, statusId: zone.statusId === 1 ? 0 : 1 }
          : zone
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      <SuccessToast
        visible={createToast.visible}
        title="Zona registrada"
        message={`La zona "${createToast.zoneName}" ha sido creada correctamente.`}
        onClose={() => setCreateToast((prev) => ({ ...prev, visible: false }))}
      />
      <SuccessToast
        visible={editToast.visible}
        title="Zona actualizada"
        message={`La zona "${editToast.zoneName}" ha sido actualizada correctamente.`}
        onClose={() => setEditToast((prev) => ({ ...prev, visible: false }))}
      />
      <SuccessToast
        visible={deleteToast.visible}
        title="Zona inactivada"
        message={`La zona "${deleteToast.zoneName}" ha sido inactivada correctamente.`}
        onClose={() => setDeleteToast((prev) => ({ ...prev, visible: false }))}
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
              onView={handleViewZone}
              onEdit={handleEditZone}
              onDelete={handleDeleteZone}
              onToggleStatus={(zone) => handleToggleStatus(zone.id)}
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
        }}
        zone={deleteZone}
        onConfirm={handleDeleteConfirm}
        loading={isSaving}
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
