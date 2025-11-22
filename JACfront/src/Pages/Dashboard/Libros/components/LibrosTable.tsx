"use client"

import type { Libro } from "../interfaces/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Props {
  libros: Libro[]
  onView?: (libro: Libro) => void
  onDownload?: (libro: Libro) => void
}

export default function LibrosTable({ libros, onView, onDownload }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Código</TableHead>
          <TableHead className="text-center">Páginas</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {libros.map((libro) => (
          <TableRow key={libro.id}>
            <TableCell className="font-medium">{libro.titulo}</TableCell>
            <TableCell>{libro.codigo}</TableCell>
            <TableCell className="text-center">{libro.paginas}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView?.(libro)}>
                  Ver
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDownload?.(libro)}>
                  Descargar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
