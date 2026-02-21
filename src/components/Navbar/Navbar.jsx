import React from "react";
// CORRECCIÓN 1: La ruta del hook según tu estructura es ./hooks/useNavbar
import { useNavbar } from "./hooks/useNavbar";
// CORRECCIÓN 2: Todos tus componentes están dentro de la carpeta 'components'
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { NavActions } from "./components/NavActions"; // NavActions suele ser el export principal
import { NavLinks } from "./components/NavLinks"; // NavLinks suele ser un archivo separado
import { MobileMenu } from "./components/MobileMenu";
import { LoginModal } from "./components/LoginModal";

// CORRECCIÓN 3: Si Home.jsx hace "import Navbar from...", necesitas EXPORT DEFAULT
export default function Navbar() {
  const navbarData = useNavbar();

  // Protección contra undefined para evitar que la app explote
  const {
    isMenuOpen = false,
    isLoginOpen = false,
    isScrolled = false,
    toggleMenu = () => {},
    closeMenu = () => {},
    toggleLogin = () => {},
  } = navbarData || {};

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* 1. IZQUIERDA: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* 2. CENTRO: Buscador (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* 3. DERECHA: Links + Acciones */}
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden lg:block">
              <NavLinks />
            </div>

            <NavActions
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              toggleLogin={toggleLogin}
            />
          </div>
        </div>

        {/* Buscador para Móvil */}
        <div className="md:hidden pb-4 px-2">
          <SearchBar />
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onLoginClick={toggleLogin}
      />

      {/* El modal de login ahora recibe su estado del hook del Navbar */}
      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} />
    </nav>
  );
}
