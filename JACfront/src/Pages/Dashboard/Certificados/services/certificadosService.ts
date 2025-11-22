import type { Certificado } from "../interfaces/types"

const mock: Certificado[] = [
  { id: 1, numero: "CERT-001", emitido: "2024-11-10", beneficiario: "Juan Pérez", cedula: "1234567890", tipo: "Afiliación", estado: "Activo" },
  { id: 2, numero: "CERT-002", emitido: "2024-11-08", beneficiario: "María García", cedula: "9876543210", tipo: "Participación", estado: "Activo" },
  { id: 3, numero: "CERT-003", emitido: "2024-11-05", beneficiario: "Carlos López", cedula: "5555555555", tipo: "Directiva", estado: "Activo" },
  { id: 4, numero: "CERT-004", emitido: "2024-10-20", beneficiario: "Ana Martínez", cedula: "1111111111", tipo: "Afiliación", estado: "Expirado" },
]

export async function getCertificados(): Promise<Certificado[]> {
  return new Promise((res) => setTimeout(() => res([...mock]), 120))
}

export async function createCertificado(payload: Omit<Certificado, "id" | "numero" | "emitido">): Promise<Certificado> {
  const nuevo: Certificado = {
    id: Date.now(),
    numero: `CERT-${String(Date.now()).slice(-4)}`,
    emitido: new Date().toISOString().slice(0, 10),
    ...payload,
  }
  mock.unshift(nuevo)
  return new Promise((res) => setTimeout(() => res(nuevo), 120))
}

export async function deleteCertificado(id: number): Promise<void> {
  const idx = mock.findIndex((c) => c.id === id)
  if (idx >= 0) mock.splice(idx, 1)
  return new Promise((res) => setTimeout(() => res(), 80))
}
