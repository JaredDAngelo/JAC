import axios from "axios";
import { toast } from 'sonner'

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

const API = axios.create({
  baseURL, // Cambia esto si tu backend está en otro puerto/dominio
});

// Interceptor para agregar el token a todas las peticiones
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

// Interceptor para manejar errores 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("authMessage", "Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        window.location.href = "/login";
      }

      if (error.response.status === 403) {
        // Forbidden — mostrar notificación amigable
        try {
          const msg = error.response.data?.message || 'No tienes permiso para realizar esta acción.'
          toast.error(msg)
        } catch (e) {
          toast.error('No tienes permiso para realizar esta acción.')
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;