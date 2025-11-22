import type { Role, Permission } from "../interfaces/types"

let roles: Role[] = [
  { id: 1, name: 'Administrador', permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles'], description: 'Acceso total' },
  { id: 2, name: 'Director', permissions: ['read', 'write'], description: 'Acceso avanzado' },
  { id: 3, name: 'Miembro', permissions: ['read'], description: 'Acceso básico' },
]

export async function getRoles(): Promise<Role[]> {
  return Promise.resolve([...roles])
}

export async function addRole(r: Omit<Role, 'id'>): Promise<Role> {
  const newRole: Role = { id: roles.length ? Math.max(...roles.map((x) => x.id)) + 1 : 1, ...r }
  roles = [...roles, newRole]
  return Promise.resolve(newRole)
}

export async function updateRole(role: Role): Promise<Role> {
  roles = roles.map((r) => (r.id === role.id ? role : r))
  return Promise.resolve(role)
}

export async function deleteRole(id: number): Promise<void> {
  roles = roles.filter((r) => r.id !== id)
  return Promise.resolve()
}

export const AVAILABLE_PERMISSIONS: Permission[] = ['read', 'write', 'delete', 'manage_users', 'manage_roles']
