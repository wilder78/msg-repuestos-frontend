import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ExternalLink,
  CreditCard,
  Banknote,
  RotateCcw,
  Truck,
  ShoppingBag,
  ClipboardList,
  Route,
  MapPin,
  UserCog,
  BarChart3,
  FileText,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Key, // ✅ IMPORTACIÓN AGREGADA AQUÍ
} from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  {
    title: "Panel Principal",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      { icon: ShoppingCart, label: "Pedidos", href: "/pedidos", badge: 47 },
      { icon: Users, label: "Clientes", href: "/dashboard/customers" },
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
      { icon: Package, label: "Productos", href: "/dashboard/productos" },
      {
        icon: ClipboardList,
        label: "Categoría Productos",
        href: "/dashboard/categorias",
      },
      { icon: Truck, label: "Proveedores", href: "/dashboard/suppliers" },
      { icon: ShoppingBag, label: "Compras", href: "/compras" },
    ],
  },
  {
    title: "Rutas de Venta",
    items: [
      { icon: Route, label: "Rutas de Venta", href: "/rutas" },
      { icon: MapPin, label: "Zonas", href: "/dashboard/zonas" },
      {
        icon: UserCog,
        label: "Gestión de Empleados",
        href: "/dashboard/empleados",
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        icon: UserPlus,
        label: "Gestión de Usuarios",
        href: "/dashboard/usuarios",
      },
      {
        icon: ShieldCheck,
        label: "Roles",
        href: "/dashboard/roles",
      },
      {
        icon: Key, // ✅ Ahora el navegador reconocerá este componente
        label: "Gestión de Permisos",
        href: "/dashboard/permisos",
      },
    ],
  },
];

export function Sidebar({ className }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col bg-white text-slate-600 border-r border-slate-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        className,
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-blue-600 transition-transform active:scale-90"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

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

      <nav className="flex-1 overflow-y-auto px-4 space-y-7 pb-4 custom-scrollbar overflow-x-hidden">
        {navigation.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 whitespace-nowrap">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    title={isCollapsed ? item.label : ""}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                      isCollapsed
                        ? "justify-center px-0 py-3"
                        : "justify-between px-3 py-2",
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50"
                        : "hover:bg-slate-50 text-slate-500 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={
                          isActive ? "text-blue-600" : "text-slate-400"
                        }
                      />
                      {!isCollapsed && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                        {item.hasArrow && (
                          <ChevronRight size={14} className="text-slate-400" />
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <Link
          to="/"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95",
            isCollapsed ? "h-12 w-12 mx-auto" : "w-full py-3 text-sm font-bold",
          )}
        >
          <ExternalLink size={18} />
          {!isCollapsed && <span>Ver Sitio Web</span>}
        </Link>
      </div>
    </aside>
  );
}
