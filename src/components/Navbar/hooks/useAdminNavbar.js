import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export function useAdminNavbar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const closeProfileMenu = () => setShowProfileMenu(false);

  const getInitials = (nombre) => {
    if (!nombre) return "M";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    user,
    showProfileMenu,
    handleLogout,
    toggleProfileMenu,
    closeProfileMenu,
    getInitials,
  };
}