import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getJuntas } from '@/Pages/Dashboard/Juntas/services/juntasService'
import { createCertificado, downloadCertificado, fetchCertificadoBlob } from './services/certificadosService'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const TIPOS = [
  { value: 'ACTA_EXISTENCIA', label: 'Acta de Existencia' },
  { value: 'ACTA_DIRECTIVOS', label: 'Acta de Directivos' },
  { value: 'ACTA_LIBROS', label: 'Acta de Libros' },
  { value: 'CERTIFICADO_ACTA', label: 'Certificado de Actas' },
]

export default function Descargas() {
  const [juntas, setJuntas] = useState([])
  const [query, setQuery] = useState('')
  const [openJunta, setOpenJunta] = useState(false)
  const [selectedJunta, setSelectedJunta] = useState(null)
  const [tipo, setTipo] = useState(TIPOS[0].value)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadJuntas() }, [])

  async function loadJuntas() {
    try {
      const js = await getJuntas()
      setJuntas(js)
    } catch (e) {
      console.error('getJuntas failed', e)
      setJuntas([])
    }
  }

  const ciudad = 'Manizales'
  const fechaEmision = useMemo(() => new Date().toISOString(), [])
  const [viewBlobUrl, setViewBlobUrl] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [loadingView, setLoadingView] = useState(false)

  async function handleDescargar() {
    if (!selectedJunta) return toast.error('Selecciona una junta')
    if (!tipo) return toast.error('Selecciona el tipo de certificado')
    try {
      setLoading(true)
      const payload = {
        tipo,
        nombreJunta: selectedJunta.nombre ?? selectedJunta.nombreJunta ?? selectedJunta.nombreJunta,
        fechaEmision,
        ciudadEmision: ciudad,
      }
      const created = await createCertificado(payload)
      const id = created._id ?? created.id

      // Obtener el blob y abrir el modal de vista
      setLoadingView(true)
      try {
        const blob = await fetchCertificadoBlob(id)
        const url = window.URL.createObjectURL(blob)
        setViewBlobUrl(url)
        setViewOpen(true)
      } catch (e) {
        console.error('fetchCertificadoBlob failed', e)
        toast.error('No se pudo cargar la vista previa')
      } finally {
        setLoadingView(false)
      }

    } catch (e) {
      console.error('crear/descargar certificado failed', e)
      toast.error('No se pudo generar el certificado')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Descarga aquí tus certificados</h1>
          </div>

          <p className="text-muted-foreground">Selecciona la junta, el tipo de certificado y descarga el PDF. La ciudad de emisión será <strong>Manizales</strong> y la fecha de emisión será la fecha actual.</p>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3 bg-card p-4 rounded shadow-sm">
              <div>
                <label className="block text-sm mb-1">Junta de Acción Comunal</label>
                <Popover open={openJunta} onOpenChange={setOpenJunta}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openJunta} className="w-full justify-between text-left">
                      {selectedJunta ? (selectedJunta.nombre ?? selectedJunta.nombreJunta) : 'Selecciona junta'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput autoFocus placeholder="Buscar junta..." onInput={(e) => setQuery(e.currentTarget.value)} />
                      <CommandList>
                        <CommandEmpty>No se encontraron juntas.</CommandEmpty>
                        <CommandGroup>
                          {juntas.filter((j) => !query || String(j.nombre ?? j.nombreJunta ?? '').toLowerCase().includes(query.toLowerCase())).map((j) => (
                            <CommandItem key={j.id ?? j._id} value={String(j.id ?? j._id)} onSelect={(v) => {
                              setSelectedJunta(j)
                              setOpenJunta(false)
                              setQuery('')
                            }}>
                              <Check className={cn('mr-2 h-4 w-4', selectedJunta && (String(selectedJunta.id ?? selectedJunta._id) === String(j.id ?? j._id)) ? 'opacity-100' : 'opacity-0')} />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{j.nombre ?? j.nombreJunta}</span>
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

              <div>
                <label className="block text-sm mb-1">Tipo de certificado</label>
                <select className="w-full border rounded p-2" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Ciudad de emisión</label>
                <input className="w-full border rounded p-2 bg-muted text-muted-foreground" value={ciudad} readOnly />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleDescargar} disabled={loading}>{loading ? 'Generando...' : 'Generar y ver'}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={viewOpen} onOpenChange={(o) => {
        if (!o) {
          setViewOpen(false)
          if (viewBlobUrl) { window.URL.revokeObjectURL(viewBlobUrl); setViewBlobUrl(null) }
        }
      }}>
        <DialogContent className="max-w-6xl w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Previsualizar certificado</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 p-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => {
                if (!viewBlobUrl) return
                const a = document.createElement('a')
                a.href = viewBlobUrl
                a.download = `${tipo}_${selectedJunta?.nombre ?? selectedJunta?.nombreJunta ?? 'certificado'}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
              }}>Descargar</Button>
              <Button size="sm" variant="ghost" onClick={() => viewBlobUrl && window.open(viewBlobUrl, '_blank')}>Abrir en nueva pestaña</Button>
            </div>

            {loadingView && <div>Cargando archivo...</div>}
            {!loadingView && viewBlobUrl && (
              <div className="w-full h-[80vh] overflow-auto border rounded">
                <iframe title="visor-certificado" src={viewBlobUrl} className="w-full h-full" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
