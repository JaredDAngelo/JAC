export type LibroItem = {
  id: number
  nombre: string
  junta: string
  registros: number
  actualizado: string
}

export type LibrosGrouped = {
  inventarios: LibroItem[]
  actas: LibroItem[]
  afiliados: LibroItem[]
  tesoreria: LibroItem[]
}

const grouped: LibrosGrouped = {
  inventarios: [
    { id: 1, nombre: "Inventario Equipos 2024", junta: "JAC Centro", registros: 45, actualizado: "2024-11-10" },
    { id: 2, nombre: "Inventario Mobiliario", junta: "JAC Centro", registros: 28, actualizado: "2024-11-09" },
  ],
  actas: [
    { id: 3, nombre: "Actas Asamblea General", junta: "JAC Centro", registros: 12, actualizado: "2024-11-08" },
    { id: 4, nombre: "Actas Directiva", junta: "JAC Norte", registros: 8, actualizado: "2024-11-07" },
  ],
  afiliados: [
    { id: 5, nombre: "Registro Afiliados Activos", junta: "JAC Centro", registros: 85, actualizado: "2024-11-09" },
    { id: 6, nombre: "Nuevos Afiliados 2024", junta: "JAC Sur", registros: 22, actualizado: "2024-11-06" },
  ],
  tesoreria: [
    { id: 7, nombre: "Ingresos y Egresos", junta: "JAC Centro", registros: 28, actualizado: "2024-11-07" },
    { id: 8, nombre: "Estados de Cuenta", junta: "JAC Este", registros: 15, actualizado: "2024-11-05" },
  ],
}

export async function getLibrosGrouped(): Promise<LibrosGrouped> {
  return new Promise((res) => setTimeout(() => res(JSON.parse(JSON.stringify(grouped))), 120))
}
