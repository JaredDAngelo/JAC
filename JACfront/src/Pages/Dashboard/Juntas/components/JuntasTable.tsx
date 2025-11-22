"use client"

import type { Junta } from "../interfaces/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, MoreHorizontal, Eye, Edit3, Download, Trash2, Check, Clock } from "lucide-react"

interface Props {
  juntas: Junta[]
  onView?: (j: Junta) => void
  onEdit?: (j: Junta) => void
  onDelete?: (id: number) => void
  onDownload?: (j: Junta) => void
}

export default function JuntasTable({ juntas, onView, onEdit, onDelete, onDownload }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="font-semibold">Nombre</TableHead>
          <TableHead className="font-semibold">Ubicación</TableHead>
          <TableHead className="font-semibold text-center">Miembros</TableHead>
          <TableHead className="font-semibold">Directivo</TableHead>
          <TableHead className="font-semibold">Estado</TableHead>
          <TableHead className="font-semibold text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {juntas.map((junta) => (
          <TableRow key={junta.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-semibold">{junta.nombre}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                {junta.ubicacion}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                {junta.miembros}
              </div>
            </TableCell>
            <TableCell className="text-sm">{junta.directivo}</TableCell>
            <TableCell>
              <Badge variant="outline" className={junta.estado === 'Activa' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                <div className="flex items-center gap-1">
                  {junta.estado === 'Activa' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {junta.estado}
                </div>
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onDownload?.(junta)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onView?.(junta)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(junta)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete?.(junta.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
