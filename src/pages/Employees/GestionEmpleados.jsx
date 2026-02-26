import React, { useState } from 'react';
// Asegúrate de que los nombres coincidan exactamente con tus archivos
import { EmployeeTable } from "./components/EmployeeTable";
import { EmployeeForm } from "./components/EmployeeForm";

export default function GestionEmpleados() {
  // 1. Verifica que tengas estados iniciales definidos para evitar que los hijos rompan
  const [empleados, setEmpleados] = useState([]); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombres: '', apellidos: '', email: '', cargo: '', foto: '' 
  });

  // 2. Función dummy para el estilo de cargos (para que la tabla no falle)
  const getCargoColor = (cargo) => "bg-slate-100 text-slate-600";

  return (
    <div className="p-8">
       <h1 className="text-2xl font-bold mb-6">Gestión de Empleados</h1>
       
       {/* Prueba renderizando solo la tabla primero para ver si el error persiste */}
       <EmployeeTable 
         empleados={empleados} 
         getCargoStyle={getCargoColor}
         onView={() => {}} 
         onEdit={() => {}} 
         onDelete={() => {}}
       />
    </div>
  );
}