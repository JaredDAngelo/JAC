import type { Role, Permission } from "../interfaces/types"
import API from '@/api/api'

export async function getRoles(): Promise<Role[]> {
  const res = await API.get('/roles')
  return (res.data || []).map((r: any) => ({ id: r._id, name: r.name, permissions: r.permissions || [], description: r.description }))
}

export async function addRole(r: Omit<Role, 'id'>): Promise<Role> {
  // Ensure permissions is always sent as an array (backend may expect it)
  const payload = { name: r.name, permissions: Array.isArray(r.permissions) ? r.permissions : [], description: r.description }
  const res = await API.post('/roles', payload)
  const created = res.data
  return { id: created._id, name: created.name, permissions: created.permissions || [], description: created.description }
}

export async function updateRole(role: Partial<Role> & { id: string }): Promise<Role> {
  const payload: any = {}
  if (typeof role.name !== 'undefined') payload.name = role.name
  if (typeof role.description !== 'undefined') payload.description = role.description
  if (typeof role.permissions !== 'undefined') payload.permissions = role.permissions

  const res = await API.patch(`/roles/${role.id}`, payload)
  const updated = res.data
  return { id: updated._id, name: updated.name, permissions: updated.permissions || [], description: updated.description }
}

export async function deleteRole(id: string): Promise<void> {
  await API.delete(`/roles/${id}`)
}

export const AVAILABLE_PERMISSIONS: Permission[] = ['read', 'write', 'delete', 'manage_users', 'manage_roles']
