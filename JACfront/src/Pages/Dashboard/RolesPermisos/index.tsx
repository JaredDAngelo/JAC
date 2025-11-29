"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Key } from "lucide-react"
import RolesTable from "./components/RolesTable"
import NuevoRolModal from "./components/NuevoRolModal"
import type { Role } from "./interfaces/types"
import { getRoles, addRole, updateRole, deleteRole } from "./services/rolesService"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input as RawInput } from "@/components/ui/input"

export default function RolesPermisosPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [search, setSearch] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Role | null>(null)

  useEffect(() => {
    getRoles().then(setRoles).catch(() => setRoles([]))
  }, [])

  const filtered = useMemo(() => roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())), [roles, search])

  function handleEdit(r: Role) {
    setEditForm(r)
    setEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editForm) return
    // send only the mutable fields (name, description)
    const updated = await updateRole({ id: editForm.id, name: editForm.name, description: editForm.description })
    setRoles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditOpen(false)
    setEditForm(null)
  }

  async function handleDelete(id: string) {
    await deleteRole(id)
    setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleCreate(r: { name: string; description?: string; permissions?: string[] }) {
    const created = await addRole(r as any)
    setRoles((prev) => [...prev, created])
    return created
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--sidebar)]/10 rounded-lg">
              <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Roles y Permisos</h1>
            <p className="text-muted-foreground">Gestiona roles y asigna permisos</p>
          </div>
        </div>
        <NuevoRolModal onCreate={handleCreate} />
      </div>

      <div className="border-0 shadow-md p-4">
        <div className="md:col-span-2 mb-4">
          <Label>Buscar</Label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre de rol" />
        </div>

        <div>
          <RolesTable roles={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* Edit dialog (simplificado) */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Nombre</Label>
                <RawInput value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Descripción</Label>
                <RawInput value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              {/* Los permisos se gestionan desde el backend; edición desde la UI deshabilitada aquí */}
              <Button className="w-full bg-[var(--sidebar)]" onClick={handleSaveEdit}>Guardar Cambios</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
