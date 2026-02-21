import api from "../api/axios";

export const loginUser = async (email, password) => {
  try {
    // Ruta exacta de tu Postman: /users/login
    const response = await api.post("/users/login", { email, password });

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      // Guardamos el objeto user que contiene "nombre: Master"
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    // Si el backend envía un mensaje de error, lo capturamos
    throw error.response?.data?.message || "Error al conectar con el servidor";
  }
};
