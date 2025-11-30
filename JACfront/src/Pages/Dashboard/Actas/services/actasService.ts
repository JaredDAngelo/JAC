import API from '@/api/api'

/*
  Servicio `actasService`

  - Provee las llamadas HTTP necesarias para la vista de Actas:
    - `getActas`: obtiene la lista de actas desde el backend.
    - `createActa`: creación con subida de archivo (FormData).
    - `updateActa`: actualización parcial (PATCH) de campos simples.
    - `fetch` / `download` helpers para obtener blobs PDF (se usan para vista/descarga con auth).
*/

export type ActaItem = {
  id: string
  tipo: string
  creado?: string
  actualizado?: string
  junta?: string
}

export async function getActas(): Promise<ActaItem[]> {
  const res = await API.get('/acta')
  const data = res.data || []
  return (data || []).map((a: any) => ({ id: String(a._id ?? a.id ?? ''), tipo: a.tipo ?? '', creado: a.createdAt ?? a.creado ?? '', actualizado: a.updatedAt ?? a.actualizado ?? '', junta: (a.junta && (typeof a.junta === 'string' ? a.junta : (a.junta._id ?? a.junta.id ?? a.junta.nombreJunta ?? a.junta.nombre))) ?? '' }))
}

export async function getActaById(id: string) {
  const res = await API.get(`/acta/${id}`)
  return res.data
}

export async function createActa(formData: FormData) {
  const res = await API.post('/acta', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data
}

export async function updateActa(id: string, payload: any) {
  // Si se envía FormData (archivo para reemplazar), enviarlo como multipart
  if (payload instanceof FormData) {
    const res = await API.patch(`/acta/${id}/actualizar`, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  }
  const body: any = {}
  if (payload.tipo !== undefined) body.tipo = payload.tipo
  if (payload.junta !== undefined) body.junta = payload.junta
  const res = await API.patch(`/acta/${id}/actualizar`, body)
  return res.data
}

export async function deleteActa(id: string) {
  const res = await API.delete(`/acta/${id}/eliminar`)
  return res.data
}

export async function fetchActaBlob(id: string): Promise<Blob> {
  const res = await API.get(`/acta/${id}/descargar`, { responseType: 'blob' })
  return res.data as Blob
}

export async function downloadActa(id: string, filename?: string) {
  const res = await API.get(`/acta/${id}/descargar`, { responseType: 'blob' })
  const blob = res.data
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${id}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

