"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Certificado } from "../interfaces/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: Omit<Certificado, "id" | "numero" | "emitido">) => void
}

export default function NuevoCertificadoModal({ open, onOpenChange, onCreate }: Props) {
  const [beneficiario, setBeneficiario] = useState("")
  const [cedula, setCedula] = useState("")
  const [tipo, setTipo] = useState("")

  function submit() {
    if (!beneficiario || !cedula || !tipo) return
    onCreate({ beneficiario, cedula, tipo, estado: "Activo" })
    setBeneficiario("")
    setCedula("")
    setTipo("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emitir Nuevo Certificado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="beneficiario">Beneficiario</Label>
            <Input id="beneficiario" value={beneficiario} onChange={(e) => setBeneficiario(e.target.value)} placeholder="Nombre completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Número de cédula" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Certificado</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Afiliación">Afiliación</SelectItem>
                <SelectItem value="Participación">Participación</SelectItem>
                <SelectItem value="Directiva">Directiva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-[var(--sidebar)]" onClick={submit}>
            Emitir Certificado
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
