"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [selected, setSelected] = useState<Role | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Role | null>(null)

  useEffect(() => {
    getRoles().then(setRoles)
  }, [])

  const filtered = useMemo(() => roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())), [roles, search])

  function handleView(r: Role) {
    setSelected(r)
    setViewOpen(true)
  }

  function handleEdit(r: Role) {
    setEditForm(r)
    setEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editForm) return
    const updated = await updateRole(editForm)
    setRoles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditOpen(false)
    setEditForm(null)
  }

  async function handleDelete(id: number) {
    await deleteRole(id)
    setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleCreate(r: Omit<Role, 'id'>) {
    const created = await addRole(r)
    setRoles((prev) => [...prev, created])
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[var(--sidebar)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Permisos únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Array.from(new Set(roles.flatMap((r) => r.permissions))).length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles con más permisos</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-3xl font-bold">{(() => {
                const top = roles.length ? roles.reduce((a, b) => (b.permissions.length > a.permissions.length ? b : a)) : null
                return top?.name ?? '-'
              })()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label>Buscar</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre de rol" />
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-md">
        <div className="p-4">
          <RolesTable roles={filtered} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {/* View dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del Rol</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-xs">Nombre</Label>
                <p className="font-semibold">{selected.name}</p>
              </div>
              <div>
                <Label className="text-xs">Descripción</Label>
                <p className="font-semibold">{selected.description}</p>
              </div>
              <div>
                <Label className="text-xs">Permisos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selected.permissions.map((p) => (
                    <span key={p} className="px-2 py-1 bg-muted/10 rounded-md text-sm">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
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
              <div>
                <Label>Permisos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Array.from(new Set(roles.flatMap((r) => r.permissions))).map((p) => (
                    <label key={p} className="flex items-center gap-2">
                      <input type="checkbox" checked={editForm.permissions.includes(p)} onChange={() => setEditForm({ ...editForm, permissions: editForm.permissions.includes(p) ? editForm.permissions.filter((x) => x !== p) : [...editForm.permissions, p] })} />
                      <span className="capitalize">{p.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-[var(--sidebar)]" onClick={handleSaveEdit}>Guardar Cambios</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
