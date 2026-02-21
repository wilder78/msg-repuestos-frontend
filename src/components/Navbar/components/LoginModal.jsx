import React, { useState, useEffect, useCallback } from "react";
import { loginUser } from "../../../services/authService";
import { X, Mail, Lock } from "lucide-react";

export const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Limpiar campos al cerrar
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  // Cerrar con la tecla "Escape"
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(email, password);

      // Verificamos que la respuesta sea exitosa antes de recargar
      if (response) {
        // Usamos reload para que el Hook de Auth detecte los cambios en localStorage
        window.location.reload();
      }
    } catch (err) {
      // Priorizamos el mensaje que viene del backend (Postman)
      const errorMessage =
        err?.response?.data?.message || err || "Credenciales inválidas";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <header className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-500">
              Ingresa tus credenciales de MSG Repuestos
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                autoComplete="email"
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-shake">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Entrar ahora"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
