"use client"

import React, { useState, useEffect } from "react"
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command'
import { Plus, Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils'
import type { Usuario } from "../interfaces/types"
import { getRoles } from '@/Pages/Dashboard/RolesPermisos/services/rolesService'
import type { Role as RoleItem } from '@/Pages/Dashboard/RolesPermisos/interfaces/types'
import { getJuntas } from '@/Pages/Dashboard/Juntas/services/juntasService'
// auth import removed: modal always shows role select; role assignment still depends on backend permissions

interface Props {
  onCreate: (u: Omit<Usuario, 'id' | 'fecha'>) => void
}

export default function NuevoUsuarioModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<Usuario, 'id' | 'fecha'>>({ nombre: '', email: '', rol: '', estado: 'Activo', junta: '', cedula: undefined, contraseña: '' })
  const [rolesList, setRolesList] = useState<RoleItem[]>([])
  const [juntasList, setJuntasList] = useState<any[]>([])
  const [juntaLabel, setJuntaLabel] = useState<string>('')
  const [openJunta, setOpenJunta] = useState(false)

  useEffect(() => {
    getJuntas().then((js) => {
      setJuntasList(js)
    }).catch(() => setJuntasList([]))
  }, [])

  useEffect(() => {
    // fetch available roles to show in select (if backend has roles collection)
    getRoles().then((rs) => setRolesList(rs)).catch(() => setRolesList([]))
  }, [])

  async function handleCreate() {
    // validar campos obligatorios que exige el backend
    if (!form.nombre || !form.email || !form.cedula || !form.contraseña) {
      toast.error('Completa todos los campos obligatorios (nombre, email, cédula, contraseña)')
      return
    }

    try {
      await onCreate(form)
      // Solo cerrar y limpiar si la creación fue exitosa
      setForm({ nombre: '', email: '', rol: '', estado: 'Activo', junta: '', cedula: undefined, contraseña: '' })
      setOpen(false)
      toast.success('Usuario creado correctamente')
    } catch (err: any) {
      const msg = (err && err.response && err.response.data) ? (err.response.data.message || JSON.stringify(err.response.data)) : (err.message || 'Error al crear usuario')
      toast.error(msg)
      // dejar el modal abierto para que el usuario corrija
    }
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
            <Label htmlFor="cedula">Cédula</Label>
            <Input id="cedula" type="number" placeholder="Ej: 12345678" value={form.cedula ?? ''} onChange={(e) => setForm({ ...form, cedula: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input id="contraseña" type="password" placeholder="Contraseña" value={form.contraseña ?? ''} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
          </div>
          {/* Campo Rol: siempre visible (asignación efectiva depende de permisos del backend) */}
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select value={form.rol} onValueChange={(value) => setForm({ ...form, rol: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {rolesList.length ? (
                  rolesList.map((r) => {
                    const label = r.name.charAt(0).toUpperCase() + r.name.slice(1)
                    return <SelectItem key={r.id} value={label}>{label}</SelectItem>
                  })
                ) : (
                  <>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Miembro">Miembro</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Nota: la asignación efectiva del rol la aplica el servidor; si tu cuenta no tiene permisos de administrador, la selección no será aplicada.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="junta">Junta</Label>
            <Popover open={openJunta} onOpenChange={setOpenJunta}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openJunta}
                  className="w-full justify-between text-left bg-popover text-popover-foreground"
                >
                  {juntaLabel || 'Selecciona una junta...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar junta..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron juntas.</CommandEmpty>
                    <CommandGroup>
                      {juntasList.map((j) => (
                        <CommandItem
                          key={j.id}
                          value={j.id}
                          onSelect={(currentValue) => {
                            // currentValue is the id
                            setForm({ ...form, junta: currentValue })
                            setJuntaLabel(j.nombre)
                            setOpenJunta(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", form.junta === j.id ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{j.nombre}</span>
                            <span className="text-xs text-muted-foreground">{j.municipio} • {j.departamento}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button className="w-full bg-[var(--sidebar)]" onClick={handleCreate}>Crear Usuario</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
