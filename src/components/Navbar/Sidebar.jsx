import React, { useState } from "react"; // 1. Importamos useState
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ClipboardList,
  Store,
  ExternalLink,
  CreditCard,
  Banknote,
  RotateCcw,
  Truck,
  ShoppingBag,
  Route,
  MapPin,
  UserCog,
  BarChart3,
  FileText,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Menu, // Agregamos iconos para el toggle
} from "lucide-react";
import { cn } from "../../lib/utils";

// ... (el array de navigation se mantiene igual)
const navigation = [
  {
    title: "Panel Principal",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
        active: true,
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      { icon: ShoppingCart, label: "Pedidos", href: "/pedidos", badge: 47 },
      { icon: Users, label: "Clientes", href: "/customers" },
      { icon: CreditCard, label: "Créditos", href: "/creditos" },
      { icon: Banknote, label: "Abonos", href: "/abonos" },
      {
        icon: RotateCcw,
        label: "Devoluciones",
        href: "/devoluciones",
        badge: 3,
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      { icon: Package, label: "Productos", href: "/productos" },
      {
        icon: ClipboardList,
        label: "Categoría Productos",
        href: "/categorias",
      },
      { icon: Truck, label: "Proveedores", href: "/proveedores" },
      { icon: ShoppingBag, label: "Compras", href: "/compras" },
    ],
  },
  {
    title: "Rutas de Venta",
    items: [
      { icon: Route, label: "Rutas de Venta", href: "/rutas" },
      { icon: MapPin, label: "Zonas", href: "/zonas" },
      { icon: UserCog, label: "Gestión de Empleados", href: "/empleados" },
    ],
  },
  {
    title: "Reportes",
    items: [
      {
        icon: BarChart3,
        label: "Indicadores de Gestión",
        href: "/indicadores",
        hasArrow: true,
      },
      { icon: FileText, label: "Ventas", href: "/reportes-ventas" },
    ],
  },
  {
    title: "Configuración",
    items: [
      { icon: UserPlus, label: "Gestión de Usuarios", href: "/usuarios" },
      { icon: ShieldCheck, label: "Roles y Permisos", href: "/roles" },
    ],
  },
];

export function Sidebar({ className }) {
  // 2. Estado para controlar si está colapsado
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col bg-white text-slate-600 border-r border-slate-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64", // Ancho dinámico
        className,
      )}
    >
      {/* 3. Botón de Toggle (Flotante o integrado) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-blue-600"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header Branding */}
      <div className={cn("p-6 mb-2", isCollapsed ? "px-4" : "px-6")}>
        <div className="flex items-center gap-3">
          <div className="h-10 min-w-[40px] rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">
            MSG
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                MSG Repuestos
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Repuestos y Servicios
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-7 pb-4 custom-scrollbar overflow-x-hidden">
        {navigation.map((section) => (
          <div key={section.title}>
            {/* Título de sección: ocultar si está colapsado */}
            {!isCollapsed && (
              <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 whitespace-nowrap">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : ""} // Tooltip nativo al pasar el mouse
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    isCollapsed
                      ? "justify-center px-0 py-3"
                      : "justify-between px-3 py-2",
                    item.active
                      ? "bg-slate-100 text-slate-900 shadow-sm"
                      : "hover:bg-slate-50 text-slate-500 hover:text-slate-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className={
                        item.active ? "text-blue-600" : "text-slate-400"
                      }
                    />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                      {item.hasArrow && (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-4">
        <a
          href="/"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95",
            isCollapsed ? "h-12 w-12 mx-auto" : "w-full py-3 text-sm font-bold",
          )}
        >
          <ExternalLink size={18} />
          {!isCollapsed && <span>Ver Sitio Web</span>}
        </a>

        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 pb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">
              Sistema Activo
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

// import React from "react";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   Users,
//   Settings,
//   ClipboardList,
//   Store,
//   ExternalLink,
//   CreditCard,
//   Banknote,
//   RotateCcw,
//   Truck,
//   ShoppingBag,
//   Route,
//   MapPin,
//   UserCog,
//   // Nuevos iconos para Reportes y Configuración extendida
//   BarChart3,
//   FileText,
//   UserPlus,
//   ShieldCheck,
//   ChevronRight
// } from "lucide-react";
// import { cn } from "../../lib/utils";

// const navigation = [
//   {
//     title: "Panel Principal",
//     items: [
//       { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
//     ],
//   },
//   {
//     title: "Ventas",
//     items: [
//       { icon: ShoppingCart, label: "Pedidos", href: "/pedidos", badge: 47 },
//       { icon: Users, label: "Clientes", href: "/clientes" },
//       { icon: CreditCard, label: "Créditos", href: "/creditos" },
//       { icon: Banknote, label: "Abonos", href: "/abonos" },
//       { icon: RotateCcw, label: "Devoluciones", href: "/devoluciones", badge: 3 },
//     ],
//   },
//   {
//     title: "Inventario",
//     items: [
//       { icon: Package, label: "Productos", href: "/productos" },
//       { icon: ClipboardList, label: "Categoría Productos", href: "/categorias" },
//       { icon: Truck, label: "Proveedores", href: "/proveedores" },
//       { icon: ShoppingBag, label: "Compras", href: "/compras" },
//     ],
//   },
//   {
//     title: "Rutas de Venta",
//     items: [
//       { icon: Route, label: "Rutas de Venta", href: "/rutas" },
//       { icon: MapPin, label: "Zonas", href: "/zonas" },
//       { icon: UserCog, label: "Gestión de Empleados", href: "/empleados" },
//     ],
//   },
//   {
//     title: "Reportes",
//     items: [
//       { icon: BarChart3, label: "Indicadores de Gestión", href: "/indicadores", hasArrow: true },
//       { icon: FileText, label: "Ventas", href: "/reportes-ventas" },
//     ],
//   },
//   {
//     title: "Configuración",
//     items: [
//       { icon: UserPlus, label: "Gestión de Usuarios", href: "/usuarios" },
//       { icon: ShieldCheck, label: "Roles y Permisos", href: "/roles" },
//     ],
//   },
// ];

// export function Sidebar({ className }) {
//   return (
//     <aside className={cn("flex h-full w-64 flex-col bg-white text-slate-600 border-r border-slate-200", className)}>

//       {/* 1. Header Branding */}
//       <div className="p-6">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">
//             MSG
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-slate-900 leading-none">MSG Repuestos</h1>
//             <p className="text-xs text-slate-400 mt-1">Repuestos y Servicios</p>
//           </div>
//         </div>
//       </div>

//       {/* 2. Navegación Scrollable */}
//       <nav className="flex-1 overflow-y-auto px-4 space-y-7 pb-4 custom-scrollbar">
//         {navigation.map((section) => (
//           <div key={section.title}>
//             <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//               {section.title}
//             </h3>
//             <div className="space-y-1">
//               {section.items.map((item) => (
//                 <a
//                   key={item.label}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
//                     item.active
//                       ? "bg-slate-100 text-slate-900 shadow-sm"
//                       : "hover:bg-slate-50 text-slate-500 hover:text-slate-900",
//                   )}
//                 >
//                   <div className="flex items-center gap-3">
//                     <item.icon size={18} className={item.active ? "text-blue-600" : "text-slate-400"} />
//                     {item.label}
//                   </div>

//                   {/* Badge o Flecha según corresponda */}
//                   {item.badge && (
//                     <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//                       {item.badge}
//                     </span>
//                   )}
//                   {item.hasArrow && (
//                     <ChevronRight size={14} className="text-slate-400" />
//                   )}
//                 </a>
//               ))}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* 3. Footer con Botón de Salida */}
//       <div className="p-4 border-t border-slate-100 bg-white space-y-4">
//         <a
//           href="/"
//           className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
//         >
//           <ExternalLink size={16} />
//           Ver Sitio Web
//         </a>

//         <div className="flex items-center gap-2 px-3 pb-2">
//           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//           <span className="text-xs text-slate-400 font-medium">Sistema Activo</span>
//         </div>
//       </div>
//     </aside>
//   );
// }
