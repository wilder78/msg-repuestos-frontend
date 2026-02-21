import React, { useState, useEffect } from "react";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { NavLinks } from "./components/NavLinks";
import { NavActions } from "./components/NavActions";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          <Logo />
          <SearchBar />
          <div className="flex items-center gap-6">
            <NavLinks />
            <NavActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>
      </div>

      {/* Aquí podrías crear también un componente <MobileMenu /> si lo deseas */}
    </nav>
  );
}
