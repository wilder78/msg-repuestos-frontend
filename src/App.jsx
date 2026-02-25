import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        }
      />
      <Route
        path="*"
        element={<div className="p-10">404 - Página no encontrada</div>}
      />
    </Routes>
  );
}

// import React from "react";
// import { Routes, Route } from "react-router-dom";

// // Páginas e Interfaces
// import Home from "./pages/Home"; // Asegúrate de que este archivo exista
// import DashboardLayout from "./pages/Dashboard/DashboardLayout";
// import DashboardContent from "./pages/Dashboard/DashboardContent";

// /**
//  * 1. Agregamos "export default" para que main.jsx pueda reconocerlo.
//  * 2. Importamos Routes y Route desde 'react-router-dom'.
//  * 3. Aseguramos que el componente Home esté importado.
//  */
// export default function App() {
//   return (
//     <Routes>
//       {/* Ruta pública para clientes */}
//       <Route path="/" element={<Home />} />

//       {/* Rutas administrativas protegidas por el Layout */}
//       <Route
//         path="/dashboard"
//         element={
//           <DashboardLayout>
//             <DashboardContent />
//           </DashboardLayout>
//         }
//       />

//       {/* Ruta de respaldo (404) por si escribes mal la URL */}
//       <Route
//         path="*"
//         element={<div className="p-10">404 - Página no encontrada</div>}
//       />
//     </Routes>
//   );
// }
