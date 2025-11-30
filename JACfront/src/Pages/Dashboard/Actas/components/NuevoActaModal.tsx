import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createActa } from '../services/actasService'
import { toast } from 'sonner'

export default function NuevoActaModal({ onCreated, juntas = [] }: any) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState('acta_constitucion')
  const [junta, setJunta] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [queryJunta, setQueryJunta] = useState('')
  const [openJunta, setOpenJunta] = useState(false)

  async function handleCreate() {
    if (!file) return toast.error('Seleccione un archivo PDF')
    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('tipo', tipo)
      if (junta) fd.append('junta', junta)
      fd.append('contenido', file)
      const created = await createActa(fd)
      toast.success('Acta creada correctamente')
      onCreated && onCreated(created)
      setOpen(false)
      setFile(null)
    } catch (e) {
      console.error('createActa failed', e)
      toast.error('No se pudo crear la acta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}><span className="mr-2">+</span> Nueva Acta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva acta</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Tipo de acta</label>
            <Select value={tipo} onValueChange={(v) => setTipo(String(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acta_constitucion">Acta de Constitución</SelectItem>
                <SelectItem value="acta_eleccion_destinatario">Acta de Elección de Destinatario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Junta</label>
            <Popover open={openJunta} onOpenChange={setOpenJunta}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openJunta} className="w-full justify-between text-left">
                  {junta ? (juntas.find((x: any) => String(x.id ?? x._id) === junta)?.nombre ?? junta) : 'Selecciona junta (opcional)'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput autoFocus placeholder="Buscar junta..." onInput={(e: any) => setQueryJunta(e.currentTarget.value)} />
                    <CommandList>
                      <CommandEmpty>No se encontraron juntas.</CommandEmpty>
                      <CommandGroup>
                        {juntas
                          .filter((j: any) => !queryJunta || String(j.nombre ?? j.nombreJunta ?? '').toLowerCase().includes(queryJunta.toLowerCase()))
                          .map((j: any) => (
                          <CommandItem
                            key={j.id ?? j._id}
                            value={String(j.id ?? j._id)}
                            onSelect={(v) => {
                              setJunta(String(v))
                              setOpenJunta(false)
                              setQueryJunta('')
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', junta === String(j.id ?? j._id) ? 'opacity-100' : 'opacity-0')} />
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
            <label className="block text-sm mb-1">Archivo (PDF)</label>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creando...' : 'Crear'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
