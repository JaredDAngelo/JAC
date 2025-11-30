"use client"

/*
  Página de Actas
  - Lista actas desde backend
  - Permite crear (subir PDF), ver en modal, descargar, editar tipo y eliminar
*/

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ActaCard from './components/ActaCard'
import EditForm from './components/EditForm'
import NuevoActaModal from './components/NuevoActaModal'
import { getActas, fetchActaBlob, downloadActa, deleteActa, getActaById, updateActa } from './services/actasService'
import { getJuntas } from '@/Pages/Dashboard/Juntas/services/juntasService'

export default function ActasPage() {
  const [actas, setActas] = useState<any[] | null>(null)
  const [juntasList, setJuntasList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [viewActa, setViewActa] = useState<any | null>(null)
  const [viewBlobUrl, setViewBlobUrl] = useState<string | null>(null)
  const [editActa, setEditActa] = useState<any | null>(null)
  const [loadingView, setLoadingView] = useState(false)
  const [openFilters, setOpenFilters] = useState(false)
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  useEffect(() => { load(); loadJuntas() }, [])

  async function load() {
    try {
      const data = await getActas()
      setActas(data)
    } catch (e) {
      console.error('getActas failed', e)
      setActas([])
    }
  }

  async function loadJuntas() {
    try {
      const js = await getJuntas()
      setJuntasList(js)
    } catch (e) {
      console.error('getJuntas failed', e)
      setJuntasList([])
    }
  }

  function openDeleteDialog(acta: any) {
    setDeleteTarget(acta)
    setDeleteDialogOpen(true)
  }

  function closeDeleteDialog() {
    setDeleteTarget(null)
    setDeleteDialogOpen(false)
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return
    try {
      await deleteActa(deleteTarget.id)
      toast.success('Acta eliminada')
      setActas((prev) => (prev || []).filter((a: any) => a.id !== deleteTarget.id))
    } catch (e) {
      console.error('deleteActa failed', e)
      toast.error('No se pudo eliminar la acta')
    } finally {
      closeDeleteDialog()
    }
  }

  async function handleSaveEdit(updated: any) {
    try {
      if (updated.formData) {
        // Actualización multipart: reemplazo del documento (envío FormData)
        await updateActa(updated.id, updated.formData)
      } else {
        await updateActa(updated.id, { tipo: updated.tipo, junta: updated.junta })
        setActas((prev) => (prev || []).map((a: any) => (a.id === updated.id ? { ...a, tipo: updated.tipo, junta: updated.junta } : a)))
      }
      toast.success('Acta actualizada')
    } catch (e) {
      console.error('updateActa failed', e)
      toast.error('No se pudo actualizar la acta')
    }
    setEditActa(null)
  }

  if (!actas) return <div className="p-4">Cargando actas...</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Actas</h1>
        <NuevoActaModal juntas={juntasList} onCreated={async (created: any) => { toast.success('Acta creada'); await load() }} />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input placeholder="Buscar actas por tipo..." value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
        </div>
        <div className="relative">
          <button className="px-3 py-2 border rounded-md bg-white" onClick={() => setOpenFilters((s) => !s)}>Filtros</button>
          {openFilters && (
            <div className="absolute right-0 mt-2 w-56 p-3 bg-popover border rounded shadow z-50">
              <div className="text-sm font-medium mb-2">Filtrar por tipo</div>
              <label className="flex items-center mb-1"><input type="checkbox" className="mr-2" checked={selectedTipos.includes('acta_constitucion')} onChange={(e) => {
                setSelectedTipos((prev) => e.target.checked ? [...prev, 'acta_constitucion'] : prev.filter((x) => x !== 'acta_constitucion'))
              }} /> Acta de Constitución</label>
              <label className="flex items-center mb-1"><input type="checkbox" className="mr-2" checked={selectedTipos.includes('acta_eleccion_destinatario')} onChange={(e) => {
                setSelectedTipos((prev) => e.target.checked ? [...prev, 'acta_eleccion_destinatario'] : prev.filter((x) => x !== 'acta_eleccion_destinatario'))
              }} /> Acta de Elección de Destinatario</label>
              <div className="text-xs text-muted-foreground mt-2">Filtradas: {selectedTipos.length || 0}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actas.filter((a: any) => {
          if (selectedTipos && selectedTipos.length > 0) {
            if (!selectedTipos.includes(a.tipo)) return false
          }
          if (!search) return true
          return (a.tipo || '').toLowerCase().includes(search.toLowerCase())
        }).map((acta) => (
          <ActaCard
            key={acta.id}
            acta={acta}
            juntas={juntasList}
            onView={async (it: any) => {
              setViewActa(it)
              setLoadingView(true)
              try {
                const b = await fetchActaBlob(it.id)
                const url = window.URL.createObjectURL(new Blob([b], { type: 'application/pdf' }))
                setViewBlobUrl(url)
              } catch (e) {
                console.error('fetchActaBlob failed', e)
                toast.error('No se pudo cargar el archivo')
                setViewActa(null)
              } finally { setLoadingView(false) }
            }}
            onDownload={(it: any) => downloadActa(it.id, `${it.tipo}.pdf`)}
            onEdit={async (it: any) => {
              try {
                const full = await getActaById(it.id)
                const juntaId = full.junta ? (typeof full.junta === 'string' ? full.junta : (full.junta._id ?? full.junta.id ?? '')) : ''
                setEditActa({ id: String(full._id ?? full.id ?? it.id), tipo: full.tipo ?? it.tipo, junta: juntaId })
              } catch (e) {
                console.error('getActaById failed', e)
                setEditActa(it)
              }
            }}
            onDelete={(it: any) => openDeleteDialog(it)}
          />
        ))}
      </div>

      <Dialog open={!!viewActa} onOpenChange={(o) => { if (!o) { setViewActa(null); if (viewBlobUrl) { window.URL.revokeObjectURL(viewBlobUrl); setViewBlobUrl(null) } } }}>
        <DialogContent className="max-w-6xl w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Detalle Acta</DialogTitle>
          </DialogHeader>
          {viewActa && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Tipo:</strong> {viewActa.tipo}
                  <div><strong>Junta:</strong> {viewActa.junta ?? '—'}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => downloadActa(viewActa.id, `${viewActa.tipo}.pdf`)}>Descargar</Button>
                  <Button size="sm" variant="ghost" onClick={() => viewBlobUrl && window.open(viewBlobUrl, '_blank')}>Abrir en nueva pestaña</Button>
                </div>
              </div>
              <div>
                <strong>Creado:</strong> {viewActa.creado ? new Date(viewActa.creado).toLocaleString() : '—'}
              </div>
              <div className="mt-2">
                {loadingView && <div>Cargando archivo...</div>}
                {!loadingView && viewBlobUrl && (
                  <div className="w-full h-[80vh] overflow-auto border rounded">
                    <iframe title="visor-acta" src={viewBlobUrl} className="w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={(o) => { if (!o) closeDeleteDialog() }}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Eliminar acta</DialogTitle>
          </DialogHeader>
          {deleteTarget && (
            <div className="space-y-4">
              <div>
                <p>¿Estás seguro que deseas eliminar la acta <strong>{deleteTarget.tipo}</strong>?</p>
                <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={closeDeleteDialog}>Cancelar</Button>
                <Button variant="destructive" className="bg-red-600 text-white hover:bg-red-700 border-transparent" onClick={handleDeleteConfirmed}>Eliminar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editActa} onOpenChange={(o) => !o && setEditActa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Acta</DialogTitle>
          </DialogHeader>
          {editActa && <EditForm acta={editActa} juntas={juntasList} onCancel={() => setEditActa(null)} onSave={handleSaveEdit} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

