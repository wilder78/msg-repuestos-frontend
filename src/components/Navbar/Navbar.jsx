import React from "react";
import { useNavbar } from "./hooks/useNavbar";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { NavActions, NavLinks } from "./components/NavActions";
import { MobileMenu } from "./components/MobileMenu";
import { LoginModal } from "./components/LoginModal";

export function Navbar() {
  const navbarData = useNavbar();

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
        isScrolled ? "bg-white/95 shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* 1. IZQUIERDA: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* 2. CENTRO: Buscador (Solo visible en Desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* 3. DERECHA: Links + Acciones */}
          <div className="flex items-center gap-2 lg:gap-6">
            {/* NavLinks ahora aparecerá a la izquierda de los iconos */}
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

        {/* FILA EXTRA: Buscador para Móvil (Se muestra debajo del logo) */}
        <div className="md:hidden pb-4 px-2">
          <SearchBar />
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onLoginClick={toggleLogin}
      />

      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} />
    </nav>
  );
}
