import type { Libro } from "../interfaces/types"

// Mock data (module-scoped so simple mutations persist during dev session)
const mockLibros: Libro[] = [
  { id: 1, titulo: "Libro de Actas 2023", codigo: "L-ACT-2023", paginas: 120 },
  { id: 2, titulo: "Libro de Asociados", codigo: "L-ASO-001", paginas: 80 },
  { id: 3, titulo: "Libro Financiero", codigo: "L-FIN-002", paginas: 200 },
]

export async function getLibros(): Promise<Libro[]> {
  // simulate async fetch
  return new Promise((res) => setTimeout(() => res([...mockLibros]), 120))
}

export async function createLibro(payload: Omit<Libro, "id">): Promise<Libro> {
  const newLibro: Libro = { id: Date.now(), ...payload }
  mockLibros.unshift(newLibro)
  return new Promise((res) => setTimeout(() => res(newLibro), 120))
}

export async function deleteLibro(id: number): Promise<void> {
  const idx = mockLibros.findIndex((l) => l.id === id)
  if (idx >= 0) mockLibros.splice(idx, 1)
  return new Promise((res) => setTimeout(() => res(), 80))
}
