"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getCertificados, createCertificado, deleteCertificado } from "./services/certificadosService"
import type { Certificado } from "./interfaces/types"
import CertificadosTable from "./components/CertificadosTable"
import NuevoCertificadoModal from "./components/NuevoCertificadoModal"

const AwardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function CertificadosPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [loading, setLoading] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Certificado> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  useEffect(() => {
    setLoading(true)
    getCertificados()
      .then((data) => setCertificados(data))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(payload: Omit<Certificado, "id" | "numero" | "emitido">) {
    const created = await createCertificado(payload)
    setCertificados((s) => [created, ...s])
  }

  const filteredCertificados = useMemo(() => {
    return certificados.filter((cert) => {
      const matchesSearch =
        cert.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.cedula.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = filterTipo === "Todos" || cert.tipo === filterTipo
      const matchesEstado = filterEstado === "Todos" || cert.estado === filterEstado
      return matchesSearch && matchesTipo && matchesEstado
    })
  }, [certificados, searchTerm, filterTipo, filterEstado])

  function getTipoBadgeColor(tipo: string) {
    const colors: Record<string, string> = {
      'Afiliación': 'bg-blue-50 text-blue-700 border-blue-200',
      'Participación': 'bg-green-50 text-green-700 border-green-200',
      'Directiva': 'bg-purple-50 text-purple-700 border-purple-200',
    }
    return colors[tipo] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  function handleView(certificado: Certificado) {
    setSelectedCertificado(certificado)
    setViewOpen(true)
  }

  function handleEdit(certificado: Certificado) {
    setEditFormData(certificado)
    setSelectedCertificado(certificado)
    setEditOpen(true)
  }

  function handleSaveEdit() {
    if (!editFormData) return
    setCertificados((s) => s.map((c) => (c.id === editFormData.id ? (editFormData as Certificado) : c)))
    setEditOpen(false)
    setEditFormData(null)
  }

  async function handleDelete(id: number) {
    await deleteCertificado(id)
    setCertificados((s) => s.filter((c) => c.id !== id))
  }

  function handleDownload(certificado: Certificado) {
    const content = `Certificado Digital\n\nNúmero: ${certificado.numero}\nBeneficiario: ${certificado.beneficiario}\nCédula: ${certificado.cedula}\nTipo: ${certificado.tipo}\nJunta: ${certificado.junta || ''}\nEmitido: ${certificado.emitido}\nEstado: ${certificado.estado}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `Certificado_${certificado.numero}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // helper removed: badge styling handled by Badge variants in table/components

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[var(--sidebar)]/10 rounded-lg">
            <AwardIcon />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Certificados Digitales</h1>
        </div>
        <p className="text-muted-foreground">Emite y gestiona certificados de afiliación, participación y directiva</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificados.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificados.filter((c) => c.estado === "Activo").length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expirados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificados.filter((c) => c.estado === "Expirado").length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Array.from(new Set(certificados.map(c => c.tipo))).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* New Certificate Button and Table */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="gap-2 bg-[var(--sidebar)]" onClick={() => setIsOpen(true)}>
            <PlusIcon /> Nuevo Certificado
          </Button>
          <NuevoCertificadoModal open={isOpen} onOpenChange={setIsOpen} onCreate={(d) => handleCreate(d)} />
        </div>

        {/* Barra de filtros */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="search" className="text-sm">Buscar</Label>
                <div className="relative mt-2">
                  <SearchIcon />
                  <Input
                    id="search"
                    placeholder="Número, beneficiario, cédula..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tipo" className="text-sm">Tipo</Label>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Afiliación">Afiliación</SelectItem>
                    <SelectItem value="Participación">Participación</SelectItem>
                    <SelectItem value="Directiva">Directiva</SelectItem>
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
                    <SelectItem value="Expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <div className="p-2">
              <CertificadosTable certificados={filteredCertificados} onView={(c) => handleView(c)} onEdit={(c) => handleEdit(c)} onDownload={(c) => handleDownload(c)} onDelete={(id) => handleDelete(id)} />
              {loading && <div className="text-sm text-muted-foreground mt-2">Cargando...</div>}
            </div>
        </Card>
      </div>

        {/* View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Detalles del Certificado</DialogTitle>
              <DialogDescription>Información completa del certificado</DialogDescription>
            </DialogHeader>
            {selectedCertificado && (
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Número</Label>
                  <p className='font-semibold'>{selectedCertificado.numero}</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Beneficiario</Label>
                  <p className='font-semibold'>{selectedCertificado.beneficiario}</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Cédula</Label>
                  <p className='font-semibold'>{selectedCertificado.cedula}</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Tipo</Label>
                  <Badge className={getTipoBadgeColor(selectedCertificado.tipo)}>{selectedCertificado.tipo}</Badge>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Junta</Label>
                  <p className='font-semibold'>{selectedCertificado.junta}</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Emitido</Label>
                  <p className='font-semibold'>{selectedCertificado.emitido}</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>Estado</Label>
                  <Badge className={selectedCertificado.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'}>{selectedCertificado.estado}</Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Editar Certificado</DialogTitle>
              <DialogDescription>Actualiza los datos del certificado</DialogDescription>
            </DialogHeader>
            {editFormData && (
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-numero'>Número</Label>
                  <Input id='edit-numero' value={editFormData.numero || ''} onChange={(e) => setEditFormData({...editFormData, numero: e.target.value})} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-beneficiario'>Beneficiario</Label>
                  <Input id='edit-beneficiario' value={editFormData.beneficiario || ''} onChange={(e) => setEditFormData({...editFormData, beneficiario: e.target.value})} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-cedula'>Cédula</Label>
                  <Input id='edit-cedula' value={editFormData.cedula || ''} onChange={(e) => setEditFormData({...editFormData, cedula: e.target.value})} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-tipo'>Tipo</Label>
                  <Select value={editFormData.tipo || ''} onValueChange={(v) => setEditFormData({...editFormData, tipo: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Afiliación'>Afiliación</SelectItem>
                      <SelectItem value='Participación'>Participación</SelectItem>
                      <SelectItem value='Directiva'>Directiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-estado'>Estado</Label>
                  <Select value={editFormData.estado || ''} onValueChange={(v) => setEditFormData({...editFormData, estado: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Activo'>Activo</SelectItem>
                      <SelectItem value='Expirado'>Expirado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className='w-full bg-primary' onClick={handleSaveEdit}>Guardar Cambios</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  )
}

