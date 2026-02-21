import React from "react";

export const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    /* Contenedor que ocupa el ancho total y centra el contenido */
    <div className="md:hidden fixed inset-0 top-20 bg-white z-40 transition-all duration-300">
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 p-6">
        {[
          { href: "/", label: "Inicio" },
          { href: "/productos", label: "Productos" },
          { href: "/nosotros", label: "Nosotros" },
          { href: "/contacto", label: "Contáctanos" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {link.label}
          </a>
        ))}

        {/* Botón de Iniciar Sesión también centrado en móvil */}
        <button className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};
