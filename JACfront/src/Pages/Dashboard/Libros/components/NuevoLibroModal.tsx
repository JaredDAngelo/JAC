"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Libro } from "../interfaces/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (libro: Libro) => void
}

export default function NuevoLibroModal({ open, onOpenChange, onCreate }: Props) {
  const [titulo, setTitulo] = useState("")
  const [codigo, setCodigo] = useState("")
  const [paginas, setPaginas] = useState<number | "">("")

  function submit() {
    const payload = { titulo: titulo.trim(), codigo: codigo.trim(), paginas: Number(paginas || 0) }
    if (!payload.titulo || !payload.codigo || !payload.paginas) return
    // create caller will usually call the service; here we just pass the payload back
    onCreate(payload as Libro)
    setTitulo("")
    setCodigo("")
    setPaginas("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* trigger handled by parent to use the same Button */}
        <span />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Libro</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Libro de Actas 2024" />
          </div>
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: L-ACT-2024" />
          </div>
          <div>
            <Label htmlFor="paginas">Páginas</Label>
            <Input id="paginas" value={paginas === "" ? "" : String(paginas)} onChange={(e) => setPaginas(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Ej: 100" />
          </div>
          <Button className="w-full bg-[var(--sidebar)]" onClick={submit}>Crear Libro</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
