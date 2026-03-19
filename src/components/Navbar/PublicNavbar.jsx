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
              <NavLinks />
            </div>

            <NavActions
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              toggleLogin={toggleLogin}
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
      />

      <LoginModal isOpen={isLoginOpen} onClose={toggleLogin} />
    </nav>
  );
}
