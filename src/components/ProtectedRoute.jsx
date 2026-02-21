import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Usamos tu hook global

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mientras se verifica la sesión (ej. leyendo localStorage/cookies)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al inicio o mostrar el modal de login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};