"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"
import type { Usuario } from "./interfaces/types"
import { toast } from 'sonner'
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario, setUserRole } from "./services/usuariosService"
import { getRoles } from '@/Pages/Dashboard/RolesPermisos/services/rolesService'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getJuntas } from '@/Pages/Dashboard/Juntas/services/juntasService'
import type { Role as RoleItem } from '@/Pages/Dashboard/RolesPermisos/interfaces/types'
import UsuariosTable from "./components/UsuariosTable"
import NuevoUsuarioModal from "./components/NuevoUsuarioModal"
// AssignRoleModal removed: role assignment UI was removed from the table and related handlers cleaned up
import auth from '@/api/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input as RawInput } from "@/components/ui/input"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRol, setFilterRol] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Usuario | null>(null)
  
  const [rolesList, setRolesList] = useState<RoleItem[]>([])
  const [juntasList, setJuntasList] = useState<any[]>([])
  const [openEditJunta, setOpenEditJunta] = useState(false)
  const [editJuntaLabel, setEditJuntaLabel] = useState('')

  const currentUser = auth.getUserFromToken()
  const isAdmin = !!currentUser && (currentUser.rol === 'admin' || currentUser.role === 'admin')

  useEffect(() => {
    getUsuarios().then(setUsuarios)
    // try to fetch roles for selects (if roles collection exists)
    getRoles().then((rs) => setRolesList(rs)).catch(() => setRolesList([]))
    // fetch juntas for comboboxes
    getJuntas().then((js) => setJuntasList(js)).catch(() => setJuntasList([]))
  }, [])

  useEffect(() => {
    // when opening edit modal, try to populate the visible label
    if (editForm && juntasList.length) {
      const found = juntasList.find((j) => j.id === editForm.junta || j.nombre === editForm.junta)
      setEditJuntaLabel(found ? found.nombre : (editForm.junta || ''))
    }
  }, [editForm, juntasList])

  const filteredUsuarios = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return usuarios.filter((usuario) => {
      const matchesSearch = usuario.nombre.toLowerCase().includes(q) || usuario.email.toLowerCase().includes(q) || usuario.junta.toLowerCase().includes(q)
      const matchesRol = filterRol === 'Todos' || usuario.rol === filterRol
      const matchesEstado = filterEstado === 'Todos' || usuario.estado === filterEstado
      return matchesSearch && matchesRol && matchesEstado
    })
  }, [usuarios, searchTerm, filterRol, filterEstado])

  const estadoActivos = usuarios.filter((u) => u.estado === 'Activo').length
  const estadoInactivos = usuarios.filter((u) => u.estado === 'Inactivo').length

  function handleView(u: Usuario) {
    setSelectedUsuario(u)
    setViewOpen(true)
  }

  function handleEdit(u: Usuario) {
    setEditForm(u)
    setEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editForm) return
    const updated = await updateUsuario(editForm)
    let final = updated
    // si soy admin y el rol cambió en el formulario, actualizarlo mediante el endpoint específico
    if (isAdmin && editForm.rol) {
      const desired = editForm.rol.toLowerCase()
      const currentBackend = (updated.rol || '').toLowerCase()
      if (desired !== currentBackend) {
        final = await setUserRole(updated.id, desired as any)
      }
    }
    setUsuarios((prev) => prev.map((p) => (p.id === final.id ? final : p)))
    setEditOpen(false)
    setEditForm(null)
    toast.success(`Usuario ${final.nombre} editado exitosamente`)
  }

  async function handleDelete(id: string) {
    const u = usuarios.find((x) => x.id === id)
    await deleteUsuario(id)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
    toast.success(`Usuario ${u?.nombre ?? ''} eliminado exitosamente`)
  }

  async function handleCreate(u: Omit<Usuario, 'id' | 'fecha'>) {
    const created = await addUsuario(u)
    // si el usuario actual es admin y se eligió un rol en el formulario, aplicarlo mediante endpoint
    if (isAdmin && u.rol) {
      const desired = u.rol.toLowerCase()
      const updated = await setUserRole(created.id, desired as any)
      setUsuarios((prev) => [...prev, updated])
      return
    }
    setUsuarios((prev) => [...prev, created])
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[var(--sidebar)]/10 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Administración de Usuarios</h1>
          </div>
          <p className="text-muted-foreground">Gestiona usuarios, roles y permisos del sistema</p>
        </div>
        <NuevoUsuarioModal onCreate={handleCreate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[var(--sidebar)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadoActivos}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadoInactivos}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="search" className="text-sm">Buscar</Label>
              <div className="relative mt-2 flex items-center gap-2">
                <Input id="search" placeholder="Nombre, email, junta..." className="pl-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="rol" className="text-sm">Rol</Label>
              <Select value={filterRol} onValueChange={setFilterRol}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                  <SelectItem value="Miembro">Miembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estado" className="text-sm">Estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-md">
        <div className="p-4">
          <UsuariosTable usuarios={filteredUsuarios} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {/* Modal Ver Detalles */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUsuario && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Nombre</Label>
                <p className="font-semibold">{selectedUsuario.nombre}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-semibold">{selectedUsuario.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rol</Label>
                <p className="font-semibold">{selectedUsuario.rol}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Junta</Label>
                <p className="font-semibold">{selectedUsuario.junta}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Estado</Label>
                <p className="font-semibold">{selectedUsuario.estado}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Registrado</Label>
                <p className="font-semibold">{selectedUsuario.fecha}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <RawInput id="edit-nombre" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <RawInput id="edit-email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rol">Rol</Label>
                <Select value={editForm.rol} onValueChange={(value) => setEditForm({ ...editForm, rol: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-cedula">Cédula</Label>
                <Input id="edit-cedula" type="number" value={editForm.cedula ?? ''} onChange={(e) => setEditForm({ ...editForm, cedula: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Contraseña (dejar vacío para no cambiar)</Label>
                <RawInput id="edit-password" type="password" value={editForm.contraseña ?? ''} onChange={(e) => setEditForm({ ...editForm, contraseña: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-junta">Junta</Label>
                <Popover open={openEditJunta} onOpenChange={setOpenEditJunta}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openEditJunta} className="w-full justify-between text-left">
                      {editJuntaLabel || 'Selecciona una junta...'}
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
                                // set editForm.junta to the selected id
                                setEditForm((prev) => prev ? { ...prev, junta: currentValue } : prev)
                                setEditJuntaLabel(j.nombre)
                                setOpenEditJunta(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', editForm.junta === j.id ? 'opacity-100' : 'opacity-0')} />
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
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select value={editForm.estado} onValueChange={(value) => setEditForm({ ...editForm, estado: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[var(--sidebar)]" onClick={handleSaveEdit}>Guardar Cambios</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
