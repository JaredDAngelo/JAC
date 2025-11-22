"use client"

import React from "react"
import type { Usuario } from "../interfaces/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit3, Download, Trash2 } from "lucide-react"

interface Props {
  usuarios: Usuario[]
  onView: (u: Usuario) => void
  onEdit: (u: Usuario) => void
  onDelete: (id: number) => void
  onDownload: (u: Usuario) => void
}

export default function UsuariosTable({ usuarios, onView, onEdit, onDelete, onDownload }: Props) {
  const getRolBadgeColor = (rol: string) => {
    const base = 'px-2 py-1 rounded-full text-sm'
    const colors: Record<string, string> = {
      Admin: 'bg-red-50 text-red-700 border-red-200',
      Director: 'bg-blue-50 text-blue-700 border-blue-200',
      Miembro: 'bg-green-50 text-green-700 border-green-200',
    }
    return `${base} ${colors[rol] || 'bg-gray-50 text-gray-700'}`
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Rol</TableHead>
            <TableHead className="font-semibold">Junta</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-semibold">{usuario.nombre}</TableCell>
              <TableCell className="text-sm">{usuario.email}</TableCell>
              <TableCell>
                <span className={getRolBadgeColor(usuario.rol)}>{usuario.rol}</span>
              </TableCell>
              <TableCell>{usuario.junta}</TableCell>
              <TableCell>
                <Badge variant="outline" className={usuario.estado === 'Activo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                  {usuario.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onView(usuario)}>
                      <Eye className="w-4 h-4" /> Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onEdit(usuario)}>
                      <Edit3 className="w-4 h-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onDownload(usuario)}>
                      <Download className="w-4 h-4" /> Descargar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => onDelete(usuario.id)}>
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
