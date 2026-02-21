const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export const NavLinks = () => (
  <div className="hidden lg:flex items-center space-x-1">
    {links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className="relative px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group text-sm"
      >
        {link.label}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </a>
    ))}
  </div>
);
