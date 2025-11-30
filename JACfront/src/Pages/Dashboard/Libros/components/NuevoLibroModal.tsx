"use client"

/*
  Componente `NuevoLibroModal`

  - Modal para crear un nuevo libro. Recopila `nombre`, `tipo`, `junta` y el archivo PDF (`contenidoLibro`).
  - Importante:
    - El endpoint de creación espera `multipart/form-data` y el campo `contenidoLibro` como archivo.
    - Validaciones: se exige `nombre` y archivo PDF antes de enviar.
  - Recomendaciones para producción:
    - Añadir límite de tamaño y validación MIME en backend y mostrar feedback al usuario.
    - Implementar subida por chunks si los PDFs pueden ser muy grandes.
*/

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createLibro } from '../services/librosGroupedService'
import { toast } from 'sonner'

interface Props {
  juntas?: any[]
  onCreated?: (created: any) => void
}

export default function NuevoLibroModal({ juntas = [], onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [junta, setJunta] = useState('')
  const [juntaLabel, setJuntaLabel] = useState('')
  const [openJunta, setOpenJunta] = useState(false)
  const [queryJunta, setQueryJunta] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!nombre) return toast.error('El nombre es requerido')
    if (!file) return toast.error('Selecciona un archivo para el contenido')
    const fd = new FormData()
    const tipoFinal = tipo || 'libro_actas'
    fd.append('tipo', tipoFinal)
    fd.append('nombre', nombre)
    if (junta) fd.append('junta', junta)
    fd.append('contenidoLibro', file)
    try {
      setLoading(true)
      const created = await createLibro(fd)
      toast.success(`Libro ${created.nombre ?? 'creado'} creado correctamente`)
      setOpen(false)
      setNombre('')
      setTipo('')
      setJunta('')
      setJuntaLabel('')
      setFile(null)
      onCreated?.(created)
    } catch (err: any) {
      console.error('createLibro failed', err)
      const msg = err?.response?.data?.message || err?.message || 'Error al crear el libro'
      toast.error(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[var(--sidebar)]"><Plus className="w-4 h-4" /> Nuevo Libro</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Libro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Libro</Label>
            <Input id="nombre" placeholder="Ej: Inventario Equipos 2024" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Libro</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libro_inventarios">Inventarios</SelectItem>
                <SelectItem value="libro_actas">Actas</SelectItem>
                <SelectItem value="libro_afiliados">Afiliados</SelectItem>
                <SelectItem value="Libro_Tesoreria">Tesorería</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="junta">Junta</Label>
            <Popover open={openJunta} onOpenChange={setOpenJunta}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openJunta} className="w-full justify-between text-left bg-popover text-popover-foreground">
                  {juntaLabel || 'Selecciona una junta...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar junta..." onInput={(e: any) => setQueryJunta(e.currentTarget.value)} />
                  <CommandList>
                    <CommandEmpty>No se encontraron juntas.</CommandEmpty>
                    <CommandGroup>
                        {juntas
                          .filter((j) => !queryJunta || String(j.nombre ?? '').toLowerCase().includes(queryJunta.toLowerCase()))
                          .map((j) => (
                          <CommandItem key={j.id} value={j.id} onSelect={(v) => { setJunta(v); setJuntaLabel(j.nombre); setOpenJunta(false) }}>
                          <Check className={cn('mr-2 h-4 w-4', junta === j.id ? 'opacity-100' : 'opacity-0')} />
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
            <Label htmlFor="contenido">Archivo (PDF)</Label>
            <input id="contenido" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button className="w-full bg-[var(--sidebar)]" onClick={submit} disabled={loading}>{loading ? 'Subiendo...' : 'Crear Libro'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
