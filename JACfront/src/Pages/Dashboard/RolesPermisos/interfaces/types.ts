export type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_roles'

export type Role = {
  id: number
  name: string
  permissions: Permission[]
  description?: string
}
