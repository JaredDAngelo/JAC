import React, { useState } from 'react'

/*
  Componente `EditForm` (Formulario de edición de Libro)

  - Uso: formulario que permite modificar `nombre`, `junta` y `tipo` de un libro existente.
  - Comportamiento clave:
    - Recibe la entidad `libro` y la lista `juntas` (proporcionada por la página padre) para resolver el label/id.
    - Al guardar, invoca `onSave` con la entidad actualizada. No sube el archivo si no se reemplaza.
  - Consideraciones para producción:
    - Validar en frontend antes de enviar (p. ej. nombre no vacío) y en backend volver a validar.
    - Manejar casos donde la lista `juntas` no esté cargada: mostramos el valor crudo como label.
    - Mejorar UX: mostrar indicador de carga si se resuelve la `junta` desde la API al abrir el modal.
*/
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LibroItem } from '../services/librosGroupedService'

export default function EditForm({
  libro,
  onCancel,
  onSave,
  juntas,
}: {
  libro: LibroItem
  onCancel: () => void
  onSave: (l: LibroItem) => void
  juntas: any[]
}) {
  const [nombre, setNombre] = useState(libro.nombre)
  const [junta, setJunta] = useState(libro.junta)
  // centralizar los tipos con label/valor para evitar mismatches
  const TIPOS = [
    { value: 'libro_inventarios', label: 'Inventarios' },
    { value: 'libro_actas', label: 'Actas' },
    { value: 'libro_afiliados', label: 'Afiliados' },
    { value: 'Libro_Tesoreria', label: 'Tesorería' },
  ]

  // normalizar el tipo actual para intentar empatar con la lista de TIPOS
  const initialTipo = (() => {
    const t = String(libro.tipo ?? '').trim()
    if (!t) return ''
    const found = TIPOS.find((x) => x.value.toLowerCase() === t.toLowerCase())
    return found ? found.value : t
  })()

  const [tipo, setTipo] = useState(initialTipo)
  const [juntaLabel, setJuntaLabel] = useState<string>(libro.junta ?? '')
  const [openEditJunta, setOpenEditJunta] = useState(false)
  const [queryJunta, setQueryJunta] = useState('')

  React.useEffect(() => {
        // Cuando se abra el formulario, intente resolver la identificación de la junta -> etiqueta usando la lista de `juntas` proporcionada.
    if (!juntas || juntas.length === 0) {
      // fallback: si libro.junta es un nombre, muéstralo
      setJuntaLabel(String(libro.junta ?? ''))
      return
    }

    const current = String(libro.junta ?? '')
    // Intenta encontrar por id o por nombre
    const found = juntas.find(
      (j) => String(j.id) === current || String(j._id ?? j.id) === current || String(j.nombre) === current,
    )
    if (found) {
      setJunta(String(found.id ?? found._id ?? ''))
      setJuntaLabel(found.nombre ?? '')
    } else {
      // Si no pudimos encontrar una coincidencia, usa el valor crudo como etiqueta
      setJuntaLabel(current)
    }
  }, [juntas, libro.junta])

  function save() {
    const updated: LibroItem = { ...libro, nombre: nombre.trim(), junta: junta?.toString?.().trim() ?? '', tipo: tipo }
    onSave(updated)
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="edit-nombre">Nombre</Label>
        <Input id="edit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="edit-junta">Junta</Label>
        <Popover open={openEditJunta} onOpenChange={setOpenEditJunta}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openEditJunta} className="w-full justify-between text-left bg-popover text-popover-foreground">
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
                    <CommandItem
                      key={j.id}
                      value={j.id}
                      onSelect={(currentValue) => {
                        setJunta(currentValue)
                        setJuntaLabel(j.nombre)
                        setOpenEditJunta(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", String(junta) === j.id ? "opacity-100" : "opacity-0")} />
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
      <div>
        <Label htmlFor="edit-tipo">Tipo</Label>
        <Select value={tipo} onValueChange={(v) => setTipo(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button className="bg-[var(--sidebar)]" onClick={save}>Guardar</Button>
      </div>
    </div>
  )
}
