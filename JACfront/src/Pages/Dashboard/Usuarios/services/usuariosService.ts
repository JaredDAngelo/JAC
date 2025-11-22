import type { Usuario } from "../interfaces/types"

let usuarios: Usuario[] = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin', estado: 'Activo', junta: 'JAC Centro', fecha: '2024-01-15' },
  { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Director', estado: 'Activo', junta: 'JAC Norte', fecha: '2024-02-20' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Miembro', estado: 'Activo', junta: 'JAC Sur', fecha: '2024-03-10' },
  { id: 4, nombre: 'Ana Martínez', email: 'ana@example.com', rol: 'Miembro', estado: 'Inactivo', junta: 'JAC Este', fecha: '2024-04-05' },
  { id: 5, nombre: 'Pedro Ruiz', email: 'pedro@example.com', rol: 'Director', estado: 'Activo', junta: 'JAC Centro', fecha: '2024-05-12' },
]

export async function getUsuarios(): Promise<Usuario[]> {
  // simulate async
  return Promise.resolve([...usuarios])
}

export async function addUsuario(u: Omit<Usuario, 'id' | 'fecha'>): Promise<Usuario> {
  const newUsuario: Usuario = {
    id: usuarios.length ? Math.max(...usuarios.map((x) => x.id)) + 1 : 1,
    fecha: new Date().toISOString().split('T')[0],
    ...u,
  }
  usuarios = [...usuarios, newUsuario]
  return Promise.resolve(newUsuario)
}

export async function updateUsuario(u: Usuario): Promise<Usuario> {
  usuarios = usuarios.map((x) => (x.id === u.id ? u : x))
  return Promise.resolve(u)
}

export async function deleteUsuario(id: number): Promise<void> {
  usuarios = usuarios.filter((x) => x.id !== id)
  return Promise.resolve()
}
