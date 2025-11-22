"use client"

import React from "react"
import type { Role } from "../interfaces/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react"

interface Props {
  roles: Role[]
  onView: (r: Role) => void
  onEdit: (r: Role) => void
  onDelete: (id: number) => void
}

export default function RolesTable({ roles, onView, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Rol</TableHead>
            <TableHead className="font-semibold">Permisos</TableHead>
            <TableHead className="font-semibold">Descripción</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-semibold">{role.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((p) => (
                    <Badge key={p} className="text-sm" variant="outline">{p}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm">{role.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><MoreHorizontal /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onView(role)}>
                      <Eye className="w-4 h-4" /> Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onEdit(role)}>
                      <Edit3 className="w-4 h-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => onDelete(role.id)}>
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
