"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Building, Plus, Search, MapPin, Users, Eye, Edit3, Download, Trash2, Check, Clock } from "lucide-react"

import NuevaJuntaModal from "./components/NuevaJuntaModal"
import JuntasTable from "./components/JuntasTable"
import type { Junta } from "./interfaces/types"
import { getJuntas, createJunta, updateJunta, deleteJunta } from "./services/juntasService"

export default function JuntasPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedJunta, setSelectedJunta] = useState<Junta | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("Todas")
  const [editFormData, setEditFormData] = useState<Partial<Junta> | null>(null)
  const [juntas, setJuntas] = useState<Junta[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getJuntas()
      .then((data) => setJuntas(data))
      .finally(() => setLoading(false))
  }, [])

  const filteredJuntas = useMemo(() => {
    return juntas.filter((junta) => {
      const matchesSearch =
        junta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        junta.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (junta.directivo || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = filterEstado === "Todas" || junta.estado === filterEstado
      return matchesSearch && matchesEstado
    })
  }, [juntas, searchTerm, filterEstado])

  const estadoActivas = juntas.filter((j) => j.estado === "Activa").length
  const totalMiembros = juntas.reduce((sum, j) => sum + j.miembros, 0)

  function handleView(junta: Junta) {
    setSelectedJunta(junta)
    setViewOpen(true)
  }

  function handleEdit(junta: Junta) {
    setEditFormData(junta)
    setSelectedJunta(junta)
    setEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editFormData) return
    const updated = await updateJunta(editFormData as Junta)
    setJuntas((s) => s.map((j) => (j.id === updated.id ? updated : j)))
    setEditOpen(false)
    setEditFormData(null)
  }

  async function handleDeleteJunta(id: string) {
    await deleteJunta(id)
    setJuntas((s) => s.filter((j) => j.id !== id))
  }

  const handleDownload = (junta: Junta) => {
    const content = `Reporte de Junta: ${junta.nombre}\n\nUbicación: ${junta.ubicacion}\nDirectivo: ${junta.directivo}\nMiembros: ${junta.miembros}\nEstado: ${junta.estado}\nFecha: ${junta.fecha}`
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `Junta_${junta.nombre}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  async function handleAddJunta(payload: any) {
    const created = await createJunta(payload)
    setJuntas((s) => [...s, created])
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Juntas de Acción Comunal</h1>
          </div>
          <p className="text-muted-foreground">Administra y monitorea todas las juntas registradas</p>
        </div>
        <div>
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4" /> Nueva Junta
          </Button>
          <NuevaJuntaModal open={isOpen} onOpenChange={setIsOpen} onCreate={(p) => handleAddJunta(p)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Juntas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{juntas.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Juntas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadoActivas}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMiembros}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promedio x Junta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(totalMiembros / (juntas.length || 1))}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm">Buscar</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input id="search" placeholder="Buscar por nombre, ubicación o directivo..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="estado" className="text-sm">Estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-md">
        <div className="overflow-x-auto">
          <div className="p-2">
            <JuntasTable
              juntas={filteredJuntas}
              onView={(j) => handleView(j)}
              onEdit={(j) => handleEdit(j)}
              onDelete={(id) => handleDeleteJunta(id)}
              onDownload={(j) => handleDownload(j)}
            />
            {loading && <div className="text-sm text-muted-foreground mt-2">Cargando...</div>}
          </div>
        </div>
      </Card>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la Junta</DialogTitle>
          </DialogHeader>
          {selectedJunta && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Nombre</Label>
                <p className="font-semibold">{selectedJunta.nombre}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dirección</Label>
                <p className="font-semibold">{selectedJunta.ubicacion}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Departamento</Label>
                  <p className="font-semibold">{selectedJunta.departamento}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Municipio</Label>
                  <p className="font-semibold">{selectedJunta.municipio}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Barrio</Label>
                <p className="font-semibold">{selectedJunta.barrio}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Presidente</Label>
                <p className="font-semibold">{selectedJunta.directivo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Vicepresidente</Label>
                  <p className="font-semibold">{selectedJunta.vicepresidente}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tesorero</Label>
                  <p className="font-semibold">{selectedJunta.tesorero}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Secretario</Label>
                  <p className="font-semibold">{selectedJunta.secretario}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Coordinador</Label>
                  <p className="font-semibold">{selectedJunta.coordinador}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Fecha de Registro</Label>
                <p className="font-semibold">{selectedJunta.fecha}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Junta</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input id="edit-nombre" value={editFormData.nombre || ''} onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ubicacion">Dirección</Label>
                <Input id="edit-ubicacion" value={editFormData.ubicacion || ''} onChange={(e) => setEditFormData({ ...editFormData, ubicacion: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-departamento">Departamento</Label>
                  <Input id="edit-departamento" value={editFormData.departamento || ''} onChange={(e) => setEditFormData({ ...editFormData, departamento: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-municipio">Municipio</Label>
                  <Input id="edit-municipio" value={editFormData.municipio || ''} onChange={(e) => setEditFormData({ ...editFormData, municipio: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-barrio">Barrio</Label>
                <Input id="edit-barrio" value={editFormData.barrio || ''} onChange={(e) => setEditFormData({ ...editFormData, barrio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-presidente">Presidente</Label>
                <Input id="edit-presidente" value={editFormData.directivo || ''} onChange={(e) => setEditFormData({ ...editFormData, directivo: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vicepresidente">Vicepresidente</Label>
                  <Input id="edit-vicepresidente" value={editFormData.vicepresidente || ''} onChange={(e) => setEditFormData({ ...editFormData, vicepresidente: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tesorero">Tesorero</Label>
                  <Input id="edit-tesorero" value={editFormData.tesorero || ''} onChange={(e) => setEditFormData({ ...editFormData, tesorero: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-secretario">Secretario</Label>
                  <Input id="edit-secretario" value={editFormData.secretario || ''} onChange={(e) => setEditFormData({ ...editFormData, secretario: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-coordinador">Coordinador</Label>
                  <Input id="edit-coordinador" value={editFormData.coordinador || ''} onChange={(e) => setEditFormData({ ...editFormData, coordinador: e.target.value })} />
                </div>
              </div>
              <Button className="w-full bg-primary" onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
