"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Usuario } from '../interfaces/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
  onSave: (rol: 'admin' | 'user') => Promise<void>
}

export default function AssignRoleModal({ open, onOpenChange, usuario, onSave }: Props) {
  const [value, setValue] = useState<'admin' | 'user'>('user')
  useEffect(() => {
    if (usuario) {
      setValue(usuario.rol === 'Admin' ? 'admin' : 'user')
    }
  }, [usuario])

  async function handleSave() {
    if (!usuario) return
    await onSave(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar rol</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Usuario</Label>
            <div className="font-semibold">{usuario?.nombre} — {usuario?.email}</div>
          </div>
          <div>
            <Label>Rol</Label>
            <Select value={value} onValueChange={(v) => setValue(v as 'admin' | 'user')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="bg-[var(--sidebar)]" onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
