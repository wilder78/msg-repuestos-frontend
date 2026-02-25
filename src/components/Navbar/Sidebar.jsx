import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Wrench,
  ClipboardList,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    active: true,
  },
  { icon: Package, label: "Inventario", href: "/inventario" },
  { icon: ShoppingCart, label: "Ventas", href: "/ventas" },
  { icon: Wrench, label: "Servicios/Taller", href: "/servicios" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: ClipboardList, label: "Reportes", href: "/reportes" },
];

export function Sidebar({ className }) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800",
        className,
      )}
    >
      {/* 1. Header del Sidebar (Branding) */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Store size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            MSG <span className="text-blue-500">Admin</span>
          </span>
        </div>
      </div>

      {/* 2. Navegación Principal */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Menú Principal
        </p>

        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-blue-600/10 text-blue-400"
                : "hover:bg-slate-800 hover:text-white",
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                size={19}
                className={cn(
                  "transition-colors",
                  item.active
                    ? "text-blue-500"
                    : "text-slate-400 group-hover:text-white",
                )}
              />
              {item.label}
            </div>
            {item.active && (
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            )}
          </a>
        ))}
      </nav>

      {/* 3. Footer del Sidebar (Acceso rápido) */}
      <div className="p-4 border-t border-slate-800">
        <div className="rounded-xl bg-slate-800/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">
              Sistema Online
            </span>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors">
            <Settings size={14} />
            Configuración
          </button>
        </div>
      </div>
    </aside>
  );
}
