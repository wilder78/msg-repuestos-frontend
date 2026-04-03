import React from "react";
import { useNavbar } from "./hooks/usePublicNavbar";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { NavActions } from "./components/NavActions";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { LoginModal } from "./components/LoginModal";

export default function Navbar() {
  const navbarData = useNavbar();

  const {
    isMenuOpen = false,
    isLoginOpen = false,
    isScrolled = false,
    toggleMenu = () => {},
    closeMenu = () => {},
    toggleLogin = () => {},
  } = navbarData || {};

  // --- LÓGICA DE CONTROL DE ROL ---
  // Obtenemos el usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  // Definimos si es empleado: debe estar logueado y su idRol NO debe ser 7 (Cliente)
  const isEmployee = user && Number(user.idRol) !== 7;

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
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden lg:block">
              {/* Pasamos la condición a los links de escritorio */}
              <NavLinks isEmployee={isEmployee} />
            </div>

            <NavActions
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              toggleLogin={toggleLogin}
              isEmployee={isEmployee} // También se lo pasamos a las acciones por si quieres mostrar algo ahí
            />
          </div>
        </div>

        <div className="md:hidden pb-4 px-2">
          <SearchBar />
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onLoginClick={toggleLogin}
        isEmployee={isEmployee} // Pasamos la condición al menú móvil
      />

      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} />
    </nav>
  );
}
