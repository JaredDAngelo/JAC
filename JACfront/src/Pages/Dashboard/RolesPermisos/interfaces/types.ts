export type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_roles'

export type Role = {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}
