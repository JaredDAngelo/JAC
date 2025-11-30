import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  acta: any
  juntas?: any[]
  onCancel: () => void
  onSave: (updated: any) => Promise<void>
}
export default function EditForm({ acta, juntas = [], onCancel, onSave }: Props) {
  const [tipo, setTipo] = useState(acta.tipo || 'acta_constitucion')
  const [junta, setJunta] = useState<string>(acta.junta ? String(acta.junta) : '')
  const [file, setFile] = useState<File | null>(null)
  const [queryJunta, setQueryJunta] = useState('')

  async function handleSave() {
    // Si hay un archivo, enviamos FormData al padre para que haga PATCH multipart
    if (file) {
      const fd = new FormData()
      fd.append('tipo', String(tipo))
      if (junta) fd.append('junta', String(junta))
      fd.append('contenido', file)
      // incluir id en el objeto que se pasa al padre
      await onSave({ id: acta.id, formData: fd })
      return
    }
    await onSave({ id: acta.id, tipo, junta })
  }

  return (
    <div className="space-y-4 py-2">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={false} className="w-full justify-between text-left">
              {junta ? (juntas.find((x: any) => String(x.id ?? x._id) === junta)?.nombre ?? junta) : 'Selecciona junta'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0">
            <Command>
              <CommandInput placeholder="Buscar junta..." onInput={(e: any) => setQueryJunta(e.currentTarget.value)} />
              <CommandList>
                <CommandEmpty>No se encontraron juntas.</CommandEmpty>
                <CommandGroup>
                  {juntas
                    .filter((j) => !queryJunta || String(j.nombre ?? j.nombreJunta ?? '').toLowerCase().includes(queryJunta.toLowerCase()))
                    .map((j) => (
                      <CommandItem key={j.id ?? j._id} value={String(j.id ?? j._id)} onSelect={(v) => setJunta(String(v))}>
                        <Check className={cn('mr-2 h-4 w-4', junta === String(j.id ?? j._id) ? 'opacity-100' : 'opacity-0')} />
                        {j.nombre ?? j.nombreJunta}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm mb-1">Reemplazar documento (opcional)</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleSave} className="ml-2">Guardar</Button>
        </div>
      </div>
    </div>
  )
}
