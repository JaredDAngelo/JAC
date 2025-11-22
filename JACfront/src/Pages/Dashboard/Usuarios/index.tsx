"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"
import type { Usuario } from "./interfaces/types"
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario } from "./services/usuariosService"
import UsuariosTable from "./components/UsuariosTable"
import NuevoUsuarioModal from "./components/NuevoUsuarioModal"
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

  useEffect(() => {
    getUsuarios().then(setUsuarios)
  }, [])

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
    setUsuarios((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditOpen(false)
    setEditForm(null)
  }

  async function handleDelete(id: number) {
    await deleteUsuario(id)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  function handleDownload(usuario: Usuario) {
    const content = `Reporte de Usuario\n\nNombre: ${usuario.nombre}\nEmail: ${usuario.email}\nRol: ${usuario.rol}\nJunta: ${usuario.junta}\nEstado: ${usuario.estado}\nFecha: ${usuario.fecha}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `Usuario_${usuario.nombre}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  async function handleCreate(u: Omit<Usuario, 'id' | 'fecha'>) {
    const created = await addUsuario(u)
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
          <UsuariosTable usuarios={filteredUsuarios} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onDownload={handleDownload} />
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
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Miembro">Miembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-junta">Junta</Label>
                <RawInput id="edit-junta" value={editForm.junta} onChange={(e) => setEditForm({ ...editForm, junta: e.target.value })} />
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
