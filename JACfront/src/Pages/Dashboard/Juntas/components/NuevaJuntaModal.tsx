"use client"

import { FC, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Junta } from "../interfaces/types"

export type CreateJuntaPayload = {
  nombreJunta: string
  direccion: string
  departamento: string
  municipio: string
  barrio: string
  presidente: string
  vicepresidente?: string
  tesorero?: string
  secretario?: string
  coordinador?: string
  documentos?: any[]
  actas?: any[]
  libros?: any[]
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate?: (payload: CreateJuntaPayload) => void
}

const NuevaJuntaModal: FC<Props> = ({ open, onOpenChange, onCreate }) => {
  const [nombre, setNombre] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [directivo, setDirectivo] = useState("")
  
  const [departamento, setDepartamento] = useState("")
  const [municipio, setMunicipio] = useState("")
  const [barrio, setBarrio] = useState("")
  const [vicepresidente, setVicepresidente] = useState("")
  const [tesorero, setTesorero] = useState("")
  const [secretario, setSecretario] = useState("")
  const [coordinador, setCoordinador] = useState("")

  function submit() {
    if (!nombre || !ubicacion || !departamento || !municipio || !barrio || !directivo) return
    const payload: CreateJuntaPayload = {
      nombreJunta: nombre,
      direccion: ubicacion,
      departamento,
      municipio,
      barrio,
      presidente: directivo,
      vicepresidente: vicepresidente || '',
      tesorero: tesorero || '',
      secretario: secretario || '',
      coordinador: coordinador || '',
    }
    onCreate?.(payload)
    setNombre("")
    setUbicacion("")
    setDirectivo("")
    setDepartamento("")
    setMunicipio("")
    setBarrio("")
    setVicepresidente("")
    setTesorero("")
    setSecretario("")
    setCoordinador("")
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
            <Label htmlFor="ubicacion">Dirección</Label>
            <Input id="ubicacion" placeholder="Ej: Zona Oeste, Manzana 50" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input id="departamento" placeholder="Ej: Antioquia" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio</Label>
              <Input id="municipio" placeholder="Ej: Medellín" value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrio">Barrio</Label>
            <Input id="barrio" placeholder="Ej: El Poblado" value={barrio} onChange={(e) => setBarrio(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presidente">Presidente</Label>
            <Input id="presidente" placeholder="Nombre del presidente" value={directivo} onChange={(e) => setDirectivo(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vicepresidente">Vicepresidente</Label>
              <Input id="vicepresidente" placeholder="Nombre del vicepresidente" value={vicepresidente} onChange={(e) => setVicepresidente(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tesorero">Tesorero</Label>
              <Input id="tesorero" placeholder="Nombre del tesorero" value={tesorero} onChange={(e) => setTesorero(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secretario">Secretario</Label>
              <Input id="secretario" placeholder="Nombre del secretario" value={secretario} onChange={(e) => setSecretario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinador">Coordinador</Label>
              <Input id="coordinador" placeholder="Nombre del coordinador" value={coordinador} onChange={(e) => setCoordinador(e.target.value)} />
            </div>
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
