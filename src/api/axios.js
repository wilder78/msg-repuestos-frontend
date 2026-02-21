import axios from "axios";

const api = axios.create({
  // Usamos la URL de tu backend que vimos en Postman
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
