import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../services/authService"; // Verifica que la ruta a services sea correcta

export const useLogin = (isOpen, onClose) => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Limpiar campos al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
      setRememberMe(false);
    }
  }, [isOpen]);

  // Manejo de accesibilidad (Escape y Scroll)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Llamada al servicio de autenticación
      const response = await loginUser(email, password);
      
      if (response) {
        setLoading("success");

        // Capturamos el idRol de la respuesta (ej: 1 para Master, 7 para Cliente)
        const userRol = response.idRol; 

        setTimeout(() => {
          onClose(); // Cerramos el modal de login
          
          // Lógica de redirección solicitada:
          // Si el idRol es diferente a 7 (es empleado o admin), va al Dashboard
          if (userRol !== 7) {
            navigate("/dashboard");
          } else {
            // Si es cliente, se queda en la Home y refrescamos estado
            navigate(0); 
          }
        }, 500);
      }
    } catch (err) {
      // Manejo de errores de la API o de red
      const errorMessage =
        err?.response?.data?.message || err?.message || "Credenciales inválidas";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return {
    state: {
      email,
      password,
      error,
      loading,
      showPassword,
      rememberMe,
      emailFocused,
      passwordFocused,
    },
    actions: {
      setEmail,
      setPassword,
      setShowPassword,
      setRememberMe,
      setEmailFocused,
      setPasswordFocused,
      handleSubmit,
    },
  };
};