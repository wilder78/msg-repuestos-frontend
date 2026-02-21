import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Leemos el usuario guardado en el localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Recargamos para limpiar la interfaz
  };

  return { user, logout, isAuthenticated: !!user };
}
