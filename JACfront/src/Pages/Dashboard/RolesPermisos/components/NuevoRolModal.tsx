"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import type { Role } from "../interfaces/types"
import { toast } from 'sonner'

interface Props {
  onCreate: (r: { name: string; description?: string; permissions?: string[] }) => Promise<Role> | void
}

export default function NuevoRolModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!name.trim()) {
      toast.error('El nombre del rol es obligatorio')
      return
    }

    setSaving(true)
    try {
  const payload = { name: name.trim(), description: description.trim() }
      const res = onCreate ? await onCreate(payload) : undefined
      toast.success('Rol creado correctamente')
  // reset
  setName('')
  setDescription('')
      setOpen(false)
      return res
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al crear rol'
      toast.error(msg)
      throw err
    } finally {
      setSaving(false)
    }
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
            <Label htmlFor="rol-desc">Descripción (opcional)</Label>
            <Input id="rol-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {/* Permisos gestionados desde el backend; se omiten en la creación desde la UI */}
          <Button className="w-full bg-[var(--sidebar)]" onClick={handleCreate} disabled={saving}>{saving ? 'Creando...' : 'Crear Rol'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
