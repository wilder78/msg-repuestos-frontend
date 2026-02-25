import React, { useState } from "react";
import { Sidebar } from "../../components/Navbar/Sidebar";
import { AdminNavbar } from "../../components/Navbar/AdminNavbar";
import { cn } from "../../lib/utils";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar className="h-full" />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { Sidebar } from "../../components/Navbar/Sidebar";
// import { AdminNavbar } from "../../components/Navbar/AdminNavbar";
// import { cn } from "../../lib/utils";

// export default function DashboardLayout({ children }) {
//   // Estado para controlar el Sidebar en móviles
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-slate-50">
//       {/* 1. SIDEBAR: Fijo en escritorio, toggle en móvil */}
//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <Sidebar className="h-full" />
//       </div>

//       {/* 2. OVERLAY: Para cerrar el sidebar al tocar fuera en móviles */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* 3. CONTENEDOR PRINCIPAL */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Navbar de Administración */}
//         <AdminNavbar onToggleSidebar={toggleSidebar} />

//         {/* ÁREA DE CONTENIDO: Aquí se renderizarán los gráficos y tablas */}
//         <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
//           <div className="mx-auto max-w-7xl">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }
