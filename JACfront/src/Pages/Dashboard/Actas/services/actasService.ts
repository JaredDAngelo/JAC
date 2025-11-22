import type { Acta } from "../interfaces/types"

const mockActas: Acta[] = [
  { id: 1, numero: "001/2024", fecha: "2024-11-10", junta: "JAC Centro", asunto: "Asamblea General Ordinaria", estado: "Publicada" },
  { id: 2, numero: "002/2024", fecha: "2024-10-15", junta: "JAC Centro", asunto: "Elección de Directiva", estado: "Publicada" },
  { id: 3, numero: "003/2024", fecha: "2024-09-20", junta: "JAC Norte", asunto: "Revisión de Finanzas", estado: "Borrador" },
  { id: 4, numero: "004/2024", fecha: "2024-08-10", junta: "JAC Sur", asunto: "Aprobación de Presupuesto", estado: "Publicada" },
]

export async function getActas(): Promise<Acta[]> {
  return new Promise((res) => setTimeout(() => res([...mockActas]), 120))
}

export async function createActa(payload: Omit<Acta, "id">): Promise<Acta> {
  const newActa: Acta = { id: Date.now(), ...payload }
  mockActas.unshift(newActa)
  return new Promise((res) => setTimeout(() => res(newActa), 120))
}

export async function deleteActa(id: number): Promise<void> {
  const idx = mockActas.findIndex((a) => a.id === id)
  if (idx >= 0) mockActas.splice(idx, 1)
  return new Promise((res) => setTimeout(() => res(), 80))
}
