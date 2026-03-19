// src/hooks/useNavbar.js
import { useState, useEffect } from "react";

export function useNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    isMenuOpen,
    isLoginOpen,
    isScrolled,
    toggleMenu,
    toggleLogin,
    closeMenu,
  };
}
