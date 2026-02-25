import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  // 1. Extraemos 'user' y 'loading' del hook
  const { user, loading } = useAuth();

  // 2. Depuración por consola (Opcional, útil para ver por qué parpadea)
  // console.log("Estado Auth:", { user, loading });

  // 3. Mientras el useEffect de useAuth lee el localStorage, mostramos el spinner
  // Esto evita que 'user' sea null por un milisegundo y nos expulse al Home
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 font-medium">
            Verificando credenciales...
          </span>
        </div>
      </div>
    );
  }

  // 4. VALIDACIÓN DE USUARIO: Si no existe sesión iniciada
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 5. VALIDACIÓN DE ROL (Específica para MSG Repuestos):
  // Si el usuario es un cliente (idRol === 7), no debe entrar al Dashboard de empleados.
  // IMPORTANTE: Asegúrate de que el objeto 'user' tenga la propiedad 'idRol'.
  if (user.idRol === 7) {
    console.warn(
      "Acceso denegado: El rol de cliente no tiene permisos de Dashboard.",
    );
    return <Navigate to="/" replace />;
  }

  // 6. Si pasa todas las pruebas, renderiza el DashboardLayout
  return children;
};

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth"; // Usamos tu hook global

// export const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   // Mientras se verifica la sesión (ej. leyendo localStorage/cookies)
//   if (loading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // Si no hay usuario, redirigir al inicio o mostrar el modal de login
//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
