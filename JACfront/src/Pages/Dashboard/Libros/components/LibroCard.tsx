import React from 'react'

/*
  Componente `LibroCard`

  - Presenta un libro en formato tarjeta dentro del grid de la vista de Libros.
  - Props:
    - `libro`: objeto con los campos mínimos para mostrar (id, nombre, junta, actualizado, registros).
    - `onView`, `onEdit`, `onDownload`, `onDelete`: callbacks para acciones desde la card.
  - Notas para producción:
    - Mantener las acciones ligeras; las operaciones pesadas (descarga, preview) deben usar endpoints que soporten
      streaming o paginado si los archivos son grandes.
    - Evitar operaciones síncronas largas en click handlers; delegar al servicio y mostrar estado/loader si es necesario.
*/
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, Edit3, Download, Trash2 } from 'lucide-react'
import type { LibroItem } from '../services/librosGroupedService'

export default function LibroCard({
  libro,
  onView,
  onEdit,
  onDownload,
  onDelete,
}: {
  libro: LibroItem
  onView?: (l: LibroItem) => void
  onEdit?: (l: LibroItem) => void
  onDownload?: (l: LibroItem) => void
  onDelete?: (id: string) => void
}) {
  return (
    <Card className="hover:shadow-lg transition-all hover:border-[var(--sidebar)]/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{libro.nombre}</CardTitle>
            <CardDescription className="text-xs">{libro.junta}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-2">
              {libro.registros ?? '—'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onView?.(libro)}>
                  <Eye className="w-4 h-4" /> <span>Ver</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onEdit?.(libro)}>
                  <Edit3 className="w-4 h-4" /> <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onDownload?.(libro)}>
                  <Download className="w-4 h-4" /> <span>Descargar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => onDelete?.(libro.id)}>
                  <Trash2 className="w-4 h-4" /> <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Última actualización</span>
          <span>{libro.actualizado}</span>
        </div>
        <Button variant="outline" className="w-full bg-card" onClick={() => onView?.(libro)}>
          Abrir libro
        </Button>
      </CardContent>
    </Card>
  )
}
