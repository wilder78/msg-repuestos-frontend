import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Users, Search } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import SuccessToast from "../../components/ui/SuccessToast";
import PageHeader from "../../components/shared/PageHeader";
import { CustomerTable } from "./components/CustomerTable";
import { CustomerForm } from "./components/CustomerForm";
// ✅ Importamos el nuevo componente
import CustomerDetailsModal from "./components/CustomerDetailsModal";

const PAGE_SIZE = 8;

export default function GestionClientes() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Estados para el modal de detalles
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [toastConfig, setToastConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showSuccessToast = (title, message) => {
    setToastConfig({ visible: true, title, message });
    setTimeout(
      () => setToastConfig((prev) => ({ ...prev, visible: false })),
      4500,
    );
  };

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setCustomers([]);
        return;
      }

      const response = await fetch("http://localhost:8080/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setCustomers([]);
        return;
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData?.message || `Error del servidor: ${response.status}`);
        setCustomers([]);
        return;
      }

      const data = await response.json();
      let list = Array.isArray(data)
        ? data
        : (data?.data ?? data?.content ?? []);
      setCustomers(list);
    } catch (err) {
      setError(
        err.name === "TypeError"
          ? "No se pudo conectar con el servidor."
          : "Ocurrió un error inesperado.",
      );
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ✅ Handler para abrir detalles
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter((c) =>
      [c.razonSocial, c.email, c.numeroDocumento, c.tipoCliente]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  const showPagination = filteredCustomers.length > PAGE_SIZE;
  const paginated = showPagination
    ? filteredCustomers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      )
    : filteredCustomers;

  const handleCustomerCreated = (customerName) => {
    setIsModalOpen(false);
    fetchCustomers();
    showSuccessToast(
      "Operación exitosa",
      `El cliente "${customerName}" ha sido procesado correctamente.`,
    );
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <SuccessToast
        visible={toastConfig.visible}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
      />

      <PageHeader
        icon={Users}
        title="Gestión de Clientes"
        subtitle="Control de cartera y base de datos maestra"
        buttonText="Registrar Cliente"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg flex items-center justify-between text-sm font-medium">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchCustomers}
            className="ml-4 text-red-600 underline hover:text-red-800"
          >
            Reintentar
          </button>
        </div>
      )}

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white rounded-xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Lista de Clientes
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                {loading
                  ? "Sincronizando..."
                  : `${filteredCustomers.length} registros encontrados`}
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder="Buscar por Razón Social o NIT..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all focus:ring-2 focus:ring-emerald-500/20"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* ✅ Pasamos el prop onViewDetails a la tabla */}
        <CustomerTable
          customers={paginated}
          loading={loading}
          onRefresh={fetchCustomers}
          onView={handleViewDetails}
        />

        {showPagination && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-4 text-sm font-bold text-slate-600">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-900"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg border shadow-sm ${
                  page === currentPage
                    ? "bg-white text-emerald-600 border-emerald-200"
                    : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-900"
            >
              Siguiente
            </button>
          </div>
        )}
      </Card>

      {/* ✅ Modal de Detalles del Cliente */}
      <CustomerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        cliente={selectedCustomer}
      />

      {/* Modal de Registro */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                Registrar Nuevo Cliente
              </DialogTitle>
              <DialogDescription className="text-emerald-50 opacity-90">
                Asegúrese de verificar el NIT/Cédula antes de guardar.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 bg-white">
            <CustomerForm
              onCancel={() => setIsModalOpen(false)}
              onSuccess={handleCustomerCreated}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
