import API from '@/api/api'

/*
  Servicio `librosGroupedService`

  - Provee las llamadas HTTP necesarias para la vista de Libros:
    - `getLibrosGrouped`: obtiene la lista agrupada preparada por backend.
    - `createLibro`: creación con subida de archivo (FormData).
    - `updateLibro`: actualización parcial (PATCH) de campos simples.
    - `fetch` / `download` helpers para obtener blobs PDF (se usan para vista/descarga con auth).
  - Notas de producción:
    - Las operaciones que devuelven blobs usan `responseType: 'blob'` y crean object URLs temporales.
    - Para archivos grandes considerar streaming o endpoints con cabeceras Range.
    - El servicio asume que `API` (axios) adjunta token en cabeceras; no exponer tokens en URLs.
*/

export type LibroItem = {
  id: string
  nombre: string
  junta: string
  tipo?: string
  actualizado: string
  registros?: number
}

export type LibrosGrouped = {
  inventarios: LibroItem[]
  actas: LibroItem[]
  afiliados: LibroItem[]
  tesoreria: LibroItem[]
}

export async function getLibrosGrouped(): Promise<LibrosGrouped> {
  const res = await API.get('/libro/grouped')
  // backend ya devuelve la estructura agrupada
  const data = res.data || { inventarios: [], actas: [], afiliados: [], tesoreria: [] }
  // asegurar que los ids sean strings y que los campos por defecto existan
  const normalizeList = (list: any[] = []) =>
    list.map((l) => ({ id: String(l.id ?? l._id ?? ''), nombre: l.nombre ?? '', junta: l.junta ?? '', tipo: l.tipo ?? '', actualizado: l.actualizado ?? '' }))

  return {
    inventarios: normalizeList(data.inventarios),
    actas: normalizeList(data.actas),
    afiliados: normalizeList(data.afiliados),
    tesoreria: normalizeList(data.tesoreria),
  }
}

export async function updateLibro(id: string, payload: Partial<LibroItem>) {
  // El backend espera campos según LibrosDto; aquí enviamos nombre, junta y tipo si están presentes
  const body: any = {}
  if (payload.nombre !== undefined) body.nombre = payload.nombre
  if (payload.junta !== undefined) body.junta = payload.junta
  if (payload.tipo !== undefined) body.tipo = payload.tipo
  const res = await API.patch(`/libro/${id}/actualizar`, body)
  return res.data
}

export async function deleteLibro(id: string) {
  const res = await API.delete(`/libro/${id}/eliminar`)
  return res.data
}

export async function createLibro(formData: FormData) {
  const res = await API.post('/libro', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function viewLibro(id: string) {
  // obtener PDF como blob con cabeceras de autenticación (la instancia API de axios adjunta el token)
  const res = await API.get(`/libro/${id}/descargar`, { responseType: 'blob' })
  const blob = res.data
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
  window.open(url, '_blank')
  // revocar después de un tiempo
  setTimeout(() => window.URL.revokeObjectURL(url), 1000 * 30)
}

export async function downloadLibro(id: string, filename?: string) {
  const res = await API.get(`/libro/${id}/descargar`, { responseType: 'blob' })
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

export async function fetchLibroBlob(id: string): Promise<Blob> {
  const res = await API.get(`/libro/${id}/descargar`, { responseType: 'blob' })
  return res.data as Blob
}

export async function getLibroById(id: string) {
  const res = await API.get(`/libro/${id}`)
  return res.data
}
