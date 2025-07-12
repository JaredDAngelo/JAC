import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // Cambia esto si tu backend está en otro puerto/dominio
});

// ✅ Interceptor para agregar el token a todas las peticiones
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor para manejar errores 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.setItem("authMessage", "Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;