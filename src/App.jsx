import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
// Quitamos las llaves si es un export default (que es lo más común)
import GestionUsuarios from "./pages/Users/GestionUsuarios";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Rutas del Dashboard compartiendo el mismo Layout */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        }
      />

      {/* IMPORTANTE: Envolvemos Usuarios en el Layout 
         para que mantenga el Sidebar y Navbar 
      */}
      <Route
        path="/dashboard/usuarios"
        element={
          <DashboardLayout>
            <GestionUsuarios />
          </DashboardLayout>
        }
      />

      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold">
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
// import { GestionUsuarios } from './pages/Users/GestionUsuarios';

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

//       <Route path="/dashboard/usuarios" element={<GestionUsuarios />} />

//       <Route
//         path="*"
//         element={
//           <div className="p-10 text-center font-bold">
//             404 - Página no encontrada
//           </div>
//         }
//       />
//     </Routes>
//   );
// }
