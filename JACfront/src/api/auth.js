import API from './api';

// Payloads esperados por el backend (ver DTOs):
// registro: { correo, contraseña, nombre, cedula?, telefono? }
// login: { correo, contraseña }

export async function register(payload) {
  // devuelve el usuario creado (sin contraseña) si todo OK
  const res = await API.post('/auth/registro', payload);
  return res.data;
}

export async function login({ correo, contraseña }) {
  const res = await API.post('/auth/login', { correo, contraseña });
  const data = res.data; // { usuario, token }
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  // opcional: limpiar otras claves relacionadas
}

export function getToken() {
  return localStorage.getItem('token');
}

export function parseToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    // decode base64 payload
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    try {
      return JSON.parse(json);
    } catch (e) {
      // some tokens are URI encoded
      return JSON.parse(decodeURIComponent(escape(json)));
    }
  } catch (e) {
    return null;
  }
}

export function getUserFromToken() {
  return parseToken();
}

export function isTokenExpired() {
  const payload = parseToken();
  if (!payload) return true;
  // exp is in seconds since epoch
  if (!payload.exp) return false; // if no exp, assume non-expiring
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export default { register, login, logout, getToken, parseToken, getUserFromToken, isTokenExpired };
