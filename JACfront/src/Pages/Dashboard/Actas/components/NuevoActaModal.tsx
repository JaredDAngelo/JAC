"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Acta } from "../interfaces/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (acta: Omit<Acta, "id">) => void
}

export default function NuevoActaModal({ open, onOpenChange, onCreate }: Props) {
  const [numero, setNumero] = useState("")
  const [junta, setJunta] = useState("")
  const [asunto, setAsunto] = useState("")
  const [contenido, setContenido] = useState("")
  const [fecha, setFecha] = useState("")
  const [estado, setEstado] = useState<Acta["estado"]>("Borrador")

  function submit() {
    if (!numero || !junta || !asunto || !fecha) return
    onCreate({ numero, junta, asunto, fecha, estado, contenido })
    setNumero("")
    setJunta("")
    setAsunto("")
    setContenido("")
    setFecha("")
    setEstado("Borrador")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Acta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número de Acta</Label>
              <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ej: 005/2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="junta">Junta</Label>
              <Input id="junta" value={junta} onChange={(e) => setJunta(e.target.value)} placeholder="Seleccionar junta" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto</Label>
            <Input id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Ej: Asamblea General Ordinaria" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido del Acta</Label>
            <Textarea id="contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Describe el contenido del acta..." className="min-h-40" />
          </div>

          <div className="flex gap-2">
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <select className="bg-input border rounded px-2" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Borrador">Borrador</option>
              <option value="Publicada">Publicada</option>
            </select>
          </div>

          <Button className="w-full bg-[var(--sidebar)]" onClick={submit}>
            Crear Acta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
