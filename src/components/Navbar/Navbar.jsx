import React from "react";
import { useNavbar } from "./hooks/useNavbar";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { NavLinks } from "./components/NavLinks";
import { NavActions } from "./components/NavActions";
import { MobileMenu } from "./components/MobileMenu";

export function Navbar() {
  const { isMenuOpen, isScrolled, toggleMenu, closeMenu } = useNavbar();

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gap reducido en móvil (gap-2) y amplio en desktop (gap-8) */}
        <div className="flex justify-between items-center h-20 gap-2 md:gap-8">
          <Logo />

          {/* Ahora SearchBar gestiona su propia visibilidad interna */}
          <SearchBar />

          <div className="flex items-center gap-2 md:gap-6">
            <NavLinks />
            <NavActions isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Menú móvil con lógica de centrado */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
}
