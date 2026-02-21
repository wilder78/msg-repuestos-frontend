import React from "react";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useLogin } from "../../../hooks/useLogin"; // Ajusta la ruta según donde pusiste el hook

export const LoginModal = ({ isOpen, onClose }) => {
  const { state, actions } = useLogin(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 transition-all duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-slide-up">
        {/* Barra decorativa superior */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-8 md:p-10">
          <header className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 shadow-inner">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            {/* Título con degradado original */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-gray-500">
              Ingresa tus credenciales para continuar
            </p>
          </header>

          <form onSubmit={actions.handleSubmit} className="space-y-5">
            {/* Correo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Correo electrónico
              </label>
              <div
                className={`relative group transition-all duration-200 ${state.emailFocused ? "scale-[1.02]" : ""}`}
              >
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${state.emailFocused ? "text-blue-600" : "text-gray-400"}`}
                />
                <input
                  type="email"
                  value={state.email}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100"
                  onChange={(e) => actions.setEmail(e.target.value)}
                  onFocus={() => actions.setEmailFocused(true)}
                  onBlur={() => actions.setEmailFocused(false)}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div
                className={`relative group transition-all duration-200 ${state.passwordFocused ? "scale-[1.02]" : ""}`}
              >
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${state.passwordFocused ? "text-blue-600" : "text-gray-400"}`}
                />
                <input
                  type={state.showPassword ? "text" : "password"}
                  value={state.password}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100"
                  onChange={(e) => actions.setPassword(e.target.value)}
                  onFocus={() => actions.setPasswordFocused(true)}
                  onBlur={() => actions.setPasswordFocused(false)}
                  required
                />
                <button
                  type="button"
                  onClick={() => actions.setShowPassword(!state.showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {state.showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Recordar */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={state.rememberMe}
                  onChange={(e) => actions.setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Recordar mi cuenta
                </span>
              </label>
            </div>

            {/* Error con animación */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">
                    Error de autenticación
                  </p>
                  <p className="text-red-600 text-sm mt-0.5">{state.error}</p>
                </div>
              </div>
            )}

            {/* Botón Principal con Efecto Brillo */}
            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center justify-center gap-2">
                {state.loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {state.loading === "success"
                        ? "Completado"
                        : "Verificando..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Regístrate gratis
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
