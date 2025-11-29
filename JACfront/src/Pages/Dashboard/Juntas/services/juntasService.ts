import type { Junta } from "../interfaces/types"
import API from '@/api/api'

// Map backend Junta document to UI Junta
function mapBackendToUI(b: any): Junta {
  return {
    id: b._id,
    nombre: b.nombreJunta || b.nombre || '',
    ubicacion: b.direccion || b.ubicacion || '',
    miembros: b.miembros ?? 0,
    estado: b.estado || 'Activa',
    fecha: b.createdAt ? b.createdAt.slice(0, 10) : (b.fecha || new Date().toISOString().slice(0, 10)),
    directivo: b.presidente || b.directivo || '',
    cedula: b.cedula || '',
    departamento: b.departamento || '',
    municipio: b.municipio || '',
    barrio: b.barrio || '',
    vicepresidente: b.vicepresidente || '',
    tesorero: b.tesorero || '',
    secretario: b.secretario || '',
    coordinador: b.coordinador || '',
  }
}

export async function getJuntas(): Promise<Junta[]> {
  const res = await API.get('/juntas')
  const data = res.data || []
  return data.map(mapBackendToUI)
}

// payload should contain backend fields like nombreJunta, direccion, departamento, municipio, barrio, presidente, vicepresidente, tesorero, secretario, coordinador
export async function createJunta(payload: any): Promise<Junta> {
  const res = await API.post('/juntas', payload)
  return mapBackendToUI(res.data)
}

export async function updateJunta(updated: any): Promise<Junta> {
  const id = updated.id || updated._id
  // map UI shape to backend DTO
  const dto: any = {
    nombreJunta: updated.nombre,
    direccion: updated.ubicacion,
    departamento: updated.departamento,
    municipio: updated.municipio,
    barrio: updated.barrio,
    presidente: updated.directivo || updated.presidente,
    vicepresidente: updated.vicepresidente || '',
    tesorero: updated.tesorero || '',
    secretario: updated.secretario || '',
    coordinador: updated.coordinador || '',
    documentos: updated.documentos || [],
    actas: updated.actas || [],
    libros: updated.libros || [],
  }
  const res = await API.patch(`/juntas/${id}`, dto)
  return mapBackendToUI(res.data)
}

export async function deleteJunta(id: string | number): Promise<void> {
  await API.delete(`/juntas/${id}`)
}
