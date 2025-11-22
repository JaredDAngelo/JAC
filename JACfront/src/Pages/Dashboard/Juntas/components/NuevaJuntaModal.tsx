"use client"

import { FC, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Junta } from "../interfaces/types"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate?: (payload: Omit<Junta, "id" | "fecha">) => void
}

const NuevaJuntaModal: FC<Props> = ({ open, onOpenChange, onCreate }) => {
  const [nombre, setNombre] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [miembros, setMiembros] = useState("")
  const [directivo, setDirectivo] = useState("")
  const [cedula, setCedula] = useState("")

  function submit() {
    if (!nombre || !ubicacion) return
    const payload = { nombre, ubicacion, miembros: parseInt(miembros) || 0, directivo, cedula, estado: "Activa" } as Omit<Junta, "id" | "fecha">
    onCreate?.(payload)
    setNombre("")
    setUbicacion("")
    setMiembros("")
    setDirectivo("")
    setCedula("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nueva Junta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="Ej: JAC Oeste" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input id="ubicacion" placeholder="Ej: Zona Oeste, Manzana 50" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="miembros">Número de Miembros</Label>
            <Input id="miembros" type="number" placeholder="Ej: 20" value={miembros} onChange={(e) => setMiembros(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="directivo">Directivo</Label>
            <Input id="directivo" placeholder="Nombre del directivo" value={directivo} onChange={(e) => setDirectivo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input id="cedula" placeholder="Número de cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button className="bg-[var(--sidebar)]" onClick={submit}>
              Registrar Junta
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NuevaJuntaModal
