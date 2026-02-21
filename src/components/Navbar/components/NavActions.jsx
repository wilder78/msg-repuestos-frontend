import React from "react";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export const NavLinks = () => {
  return (
    <div className="hidden lg:flex items-center space-x-1">
      {links.map((link) => {
        return (
          /* CORRECCIÓN: Se añadió la etiqueta de apertura <a> que faltaba */
          <a
            key={link.href}
            href={link.href}
            className="relative px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group text-sm"
          >
            {link.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </a>
        );
      })}
    </div>
  );
};

export const NavActions = ({ isMenuOpen, toggleMenu, toggleLogin }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Carrito */}
      <button className="relative p-2 text-gray-700 hover:bg-blue-50 rounded-full transition-all">
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-full shadow-sm">
          0
        </span>
      </button>

      {/* Autenticación */}
      {!isAuthenticated ? (
        <button
          onClick={toggleLogin}
          className="p-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-all"
          title="Iniciar Sesión"
        >
          <User className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <span className="hidden lg:inline-block text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
            {user?.nombre}
          </span>
          <button
            onClick={logout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Botón Hamburguesa: Se asegura visibilidad con flex-shrink-0 */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-all flex-shrink-0"
        aria-label="Abrir menú"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-blue-600" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};