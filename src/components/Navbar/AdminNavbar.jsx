import React, { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  User,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AdminNavbar({ onToggleSidebar }) {
  const user = {
    nombre: "Admin MSG",
    email: "admin@msg.com",
    cargo: "Super Admin",
  };
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = (nombre) => {
    if (!nombre) return "A";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>

        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar repuestos o facturas..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5 text-slate-600" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-white text-[10px]"
            >
              3
            </Badge>
          </Button>

          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {getInitials(user.nombre)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">
                      {user.nombre}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <User className="mr-3 h-4 w-4 text-slate-400" /> Mi Perfil
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings className="mr-3 h-4 w-4 text-slate-400" /> Ajustes
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="mr-3 h-4 w-4" /> Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// import React, { useState } from "react";
// import {
//   Bell,
//   Search,
//   Settings,
//   User,
//   Menu,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";

// // Importaciones de UI con rutas corregidas
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// // NOTA: Si aún no creas este archivo, el Navbar usará un menú simplificado
// // import { DropdownMenu, ... } from "../ui/dropdown-menu";

// export function AdminNavbar({ onToggleSidebar }) {
//   // Simulación de usuario (puedes conectar tu useAuth aquí)
//   const user = {
//     nombre: "Admin MSG",
//     email: "admin@msg.com",
//     cargo: "Super Admin",
//   };
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const getInitials = (nombre) => {
//     if (!nombre) return "A";
//     return nombre
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur shadow-sm">
//       <div className="flex h-16 items-center px-4 gap-4">
//         {/* Toggle para Móvil */}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onToggleSidebar}
//           className="lg:hidden"
//         >
//           <Menu className="h-5 w-5 text-slate-600" />
//         </Button>

//         {/* Buscador Central */}
//         <div className="flex-1 max-w-md">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//             <input
//               type="text"
//               placeholder="Buscar repuestos o facturas..."
//               className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
//             />
//           </div>
//         </div>

//         {/* Acciones Derecha */}
//         <div className="flex items-center gap-2 md:gap-4">
//           {/* Notificaciones */}
//           <Button variant="ghost" size="icon" className="relative rounded-full">
//             <Bell className="h-5 w-5 text-slate-600" />
//             <Badge
//               variant="destructive"
//               className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-white text-[10px]"
//             >
//               3
//             </Badge>
//           </Button>

//           <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

//           {/* Menú de Usuario Simplificado (Evita error de DropdownMenu inexistente) */}
//           <div className="relative">
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
//             >
//               <Avatar className="h-8 w-8 border border-slate-200">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="bg-blue-600 text-white text-xs">
//                   {getInitials(user.nombre)}
//                 </AvatarFallback>
//               </Avatar>
//               <ChevronDown
//                 className={`h-4 w-4 text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
//               />
//             </button>

//             {/* Dropdown Manual para evitar dependencias externas */}
//             {showProfileMenu && (
//               <>
//                 <div
//                   className="fixed inset-0 z-10"
//                   onClick={() => setShowProfileMenu(false)}
//                 />
//                 <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150">
//                   <div className="px-4 py-2 border-b border-slate-100">
//                     <p className="text-sm font-bold text-slate-900">
//                       {user.nombre}
//                     </p>
//                     <p className="text-xs text-slate-500 truncate">
//                       {user.email}
//                     </p>
//                   </div>

//                   <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
//                     <User className="mr-3 h-4 w-4 text-slate-400" /> Mi Perfil
//                   </button>
//                   <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
//                     <Settings className="mr-3 h-4 w-4 text-slate-400" /> Ajustes
//                   </button>

//                   <div className="border-t border-slate-100 my-1" />

//                   <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
//                     <LogOut className="mr-3 h-4 w-4" /> Cerrar Sesión
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
