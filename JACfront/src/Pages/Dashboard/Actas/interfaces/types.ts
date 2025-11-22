export interface Acta {
  id: number
  numero: string
  fecha: string
  junta: string
  asunto: string
  estado: "Publicada" | "Borrador" | string
  contenido?: string
}
