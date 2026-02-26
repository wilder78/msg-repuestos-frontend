import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import CustomersPage from "./pages/Customers/CustomersPage";
// Importamos la nueva página de Empleados
import GestionEmpleados from "./pages/Employees/GestionEmpleados";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Vista principal del Dashboard */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        }
      />

      {/* Gestión de Clientes */}
      <Route
        path="/customers"
        element={
          <DashboardLayout>
            <CustomersPage />
          </DashboardLayout>
        }
      />

      {/* NUEVA RUTA: Gestión de Empleados */}
      <Route
        path="/employees"
        element={
          <DashboardLayout>
            <GestionEmpleados />
          </DashboardLayout>
        }
      />

      <Route
        path="*"
        element={
          <div className="p-10 text-center font-bold">
            404 - Página no encontrada
          </div>
        }
      />
    </Routes>
  );
}

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import DashboardLayout from "./pages/Dashboard/DashboardLayout";
// import DashboardContent from "./pages/Dashboard/DashboardContent";
// // Importamos la nueva página de Clientes
// import CustomersPage from "./pages/Customers/CustomersPage";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />

//       {/* Vista principal del Dashboard */}
//       <Route
//         path="/dashboard"
//         element={
//           <DashboardLayout>
//             <DashboardContent />
//           </DashboardLayout>
//         }
//       />

//       {/* NUEVA RUTA: Gestión de Clientes */}
//       <Route
//         path="/customers"
//         element={
//           <DashboardLayout>
//             <CustomersPage />
//           </DashboardLayout>
//         }
//       />

//       <Route
//         path="*"
//         element={<div className="p-10">404 - Página no encontrada</div>}
//       />
//     </Routes>
//   );
// }
