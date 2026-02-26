import React, { useState } from "react";
import { Plus, Search, Users, TrendingUp, UserCheck, Filter } from "lucide-react";

// UI Components
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Card } from "../../components/ui/card";

// Sub-components
import { CustomerTable } from "./components/CustomerTable";
import { CustomerForm } from "./components/CustomerForm";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]); // Aquí irían tus datos reales
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* HEADER AL ESTILO FIGMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Clientes
          </h1>
          <p className="text-slate-500 text-lg">
            Base de datos y seguimiento completo de clientes
          </p>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-bold px-6 py-6 shadow-lg shadow-emerald-100"
        >
          <Plus className="mr-2 h-5 w-5" /> Registrar Cliente
        </Button>
      </div>

      {/* CONTENEDOR DE TABLA */}
      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white rounded-xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Lista de Clientes</h3>
              <p className="text-sm text-slate-400 font-medium">Administra tu base de datos de clientes</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Buscar clientes..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <CustomerTable 
          customers={customers} 
          onEdit={(c) => console.log("Edit", c)} 
          onDelete={(c) => console.log("Delete", c)}
        />
        
        {/* PAGINACIÓN SIMULADA */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-4 text-sm font-bold text-slate-600">
          <button className="hover:text-slate-900">Anterior</button>
          <span className="bg-white px-3 py-1 rounded border shadow-sm text-emerald-600">1</span>
          <button className="hover:text-slate-900">Siguiente</button>
        </div>
      </Card>

      {/* MODAL TRADUCIDO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Registrar Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Complete los campos a continuación para añadir un cliente al sistema.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
