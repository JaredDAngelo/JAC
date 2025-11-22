"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Usuario } from "../interfaces/types"

interface Props {
  onCreate: (u: Omit<Usuario, 'id' | 'fecha'>) => void
}

export default function NuevoUsuarioModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<Usuario, 'id' | 'fecha'>>({ nombre: '', email: '', rol: '', estado: 'Activo', junta: '' })

  function handleCreate() {
    if (!form.nombre || !form.email) return
    onCreate(form)
    setForm({ nombre: '', email: '', rol: '', estado: 'Activo', junta: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-[var(--sidebar)]">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input id="nombre" placeholder="Ej: Juan Pérez" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="juan@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select value={form.rol} onValueChange={(value) => setForm({ ...form, rol: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Miembro">Miembro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="junta">Junta</Label>
            <Select value={form.junta} onValueChange={(value) => setForm({ ...form, junta: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una junta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JAC Centro">JAC Centro</SelectItem>
                <SelectItem value="JAC Norte">JAC Norte</SelectItem>
                <SelectItem value="JAC Sur">JAC Sur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-[var(--sidebar)]" onClick={handleCreate}>Crear Usuario</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
