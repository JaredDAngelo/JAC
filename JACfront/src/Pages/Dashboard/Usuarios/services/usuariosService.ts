import type { Usuario } from "../interfaces/types"
import API from "@/api/api"

// Nota: el backend usa campos diferentes (correo, _id, rol: 'admin'|'user').
// Aquí mappeamos para mantener la forma esperada por la UI.

function mapFromBackend(u: any): Usuario {
  return {
    id: (u._id || u.id) as any,
    nombre: u.nombre || u.nombre,
    email: u.correo || u.email || '',
    // Normalizar diferentes formas que puede venir el rol desde el backend
    rol: (() => {
      const raw = u.rol || u.role || ''
      if (!raw) return 'Miembro'
      // si es objeto { name }
      if (typeof raw === 'object') {
        const name = (raw.name || raw.nombre || '').toString()
        if (!name) return 'Miembro'
        return name.charAt(0).toUpperCase() + name.slice(1)
      }
      const s = raw.toString().toLowerCase()
      if (s === 'admin' || s === 'administrator' || s === 'administrador') return 'Admin'
      if (s === 'user' || s === 'miembro' || s === 'member') return 'Miembro'
      // si es un nombre de rol ya legible
      return raw.charAt(0).toUpperCase() + raw.slice(1)
    })(),
    estado: u.estado || 'Activo',
    // Normalizar 'junta': puede venir como ObjectId (string), o como objeto poblado { _id, nombreJunta }
    junta: (() => {
      if (!u.junta) return ''
      if (typeof u.junta === 'string') return u.junta
      if (typeof u.junta === 'object') {
        return (u.junta.nombreJunta || u.junta.name || u.junta._id || '').toString()
      }
      return String(u.junta)
    })(),
    fecha: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : (u.fecha || new Date().toISOString().split('T')[0]),
    cedula: u.cedula,
    telefono: u.telefono,
    contraseña: undefined,
  }
}

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await API.get('/usuario')
  const data = res.data || []
  return data.map(mapFromBackend)
}

export async function addUsuario(u: Omit<Usuario, 'id' | 'fecha'>): Promise<Usuario> {
  // backend requiere correo, contraseña y cedula. Usamos los valores
  // provistos por el formulario si existen; si no, aplicamos un fallback.
  const payload: any = {
    nombre: u.nombre,
    correo: u.email,
    contraseña: u.contraseña || 'Password123!',
    cedula: u.cedula || (Date.now() % 1000000000),
    telefono: u.telefono || '',
    // Nota: el backend actualmente no permite enviar la propiedad `rol` en el DTO de creación
    // (ValidationPipe tiene `forbidNonWhitelisted: true`). No enviamos `rol` aquí para evitar 400.
  }
  const res = await API.post('/usuario', payload)
  return mapFromBackend(res.data)
}

export async function updateUsuario(u: Usuario): Promise<Usuario> {
  const payload: any = {
    nombre: u.nombre,
    correo: u.email,
    // campos opcionales que la UI controla
    junta: u.junta,
    estado: u.estado,
    cedula: u.cedula,
  }
  // si se envía contraseña, incluirla (backend la hasheará)
  if (u.contraseña) payload.contraseña = u.contraseña
  const res = await API.patch(`/usuario/${u.id}`, payload)
  return mapFromBackend(res.data)
}

export async function deleteUsuario(id: any): Promise<void> {
  await API.delete(`/usuario/${id}`)
}

export async function setUserRole(id: any, rol: 'admin' | 'user') {
  const res = await API.patch(`/usuario/${id}/role`, { rol })
  return mapFromBackend(res.data)
}
