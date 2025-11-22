import type { Junta } from "../interfaces/types"

const mock: Junta[] = [
  { id: 1, nombre: "JAC Centro", ubicacion: "Calle Principal 123", miembros: 24, estado: "Activa", fecha: "2024-01-15", directivo: "Juan Pérez", cedula: "1234567890" },
  { id: 2, nombre: "JAC Norte", ubicacion: "Zona Norte, Distrito 5", miembros: 18, estado: "Activa", fecha: "2024-02-20", directivo: "María García", cedula: "9876543210" },
  { id: 3, nombre: "JAC Sur", ubicacion: "Zona Sur, Distrito 8", miembros: 15, estado: "Inactiva", fecha: "2024-03-10", directivo: "Carlos López", cedula: "5555555555" },
  { id: 4, nombre: "JAC Este", ubicacion: "Sector Este, Manzana 42", miembros: 22, estado: "Activa", fecha: "2024-04-05", directivo: "Ana Martínez", cedula: "1111111111" },
]

export async function getJuntas(): Promise<Junta[]> {
  return new Promise((res) => setTimeout(() => res([...mock]), 120))
}

export async function createJunta(payload: Omit<Junta, "id" | "fecha">): Promise<Junta> {
  const nuevo: Junta = {
    id: Date.now(),
    fecha: new Date().toISOString().slice(0, 10),
    ...payload,
  }
  mock.push(nuevo)
  return new Promise((res) => setTimeout(() => res(nuevo), 120))
}

export async function updateJunta(updated: Junta): Promise<Junta> {
  const idx = mock.findIndex((m) => m.id === updated.id)
  if (idx >= 0) mock[idx] = updated
  return new Promise((res) => setTimeout(() => res(updated), 120))
}

export async function deleteJunta(id: number): Promise<void> {
  const idx = mock.findIndex((m) => m.id === id)
  if (idx >= 0) mock.splice(idx, 1)
  return new Promise((res) => setTimeout(() => res(), 80))
}
