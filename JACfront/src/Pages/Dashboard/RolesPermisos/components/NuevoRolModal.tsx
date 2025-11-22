"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AVAILABLE_PERMISSIONS } from "../services/rolesService"
import { Plus } from "lucide-react"
import type { Role } from "../interfaces/types"

interface Props {
  onCreate: (r: Omit<Role, 'id'>) => void
}

export default function NuevoRolModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [perms, setPerms] = useState<string[]>([])

  function togglePerm(p: string) {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  function handleCreate() {
    if (!name) return
    onCreate({ name, description, permissions: perms as any })
    setName('')
    setDescription('')
    setPerms([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-[var(--sidebar)]">
          <Plus className="w-4 h-4" /> Nuevo Rol
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="rol-name">Nombre</Label>
            <Input id="rol-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="rol-desc">Descripción</Label>
            <Input id="rol-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Permisos</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <Checkbox checked={perms.includes(p)} onCheckedChange={() => togglePerm(p)} />
                  <span className="capitalize">{p.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full bg-[var(--sidebar)]" onClick={handleCreate}>Crear Rol</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
