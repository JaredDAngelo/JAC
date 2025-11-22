"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit3, Download, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getLibrosGrouped } from "./services/librosGroupedService"
import type { LibrosGrouped, LibroItem } from "./services/librosGroupedService"

const BookIcon = () => (
	<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747m0-13c5.5 0 10 4.745 10 10.747s-4.5 10.747-10 10.747"
		/>
	</svg>
)

const PlusIcon = () => (
	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
	</svg>
)

// usando iconos de lucide-react para consistencia
function LibroCard({
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
	onDelete?: (id: number) => void
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
							{libro.registros}
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
				<Button variant="outline" className="w-full bg-transparent" onClick={() => onView?.(libro)}>
					Abrir libro
				</Button>
			</CardContent>
		</Card>
	)
}

function EditForm({
	libro,
	onCancel,
	onSave,
}: {
	libro: LibroItem
	onCancel: () => void
	onSave: (l: LibroItem) => void
}) {
	const [nombre, setNombre] = useState(libro.nombre)
	const [junta, setJunta] = useState(libro.junta)
	const [registros, setRegistros] = useState<number | string>(libro.registros)

	function save() {
		const updated: LibroItem = { ...libro, nombre: nombre.trim(), junta: junta.trim(), registros: Number(registros) }
		onSave(updated)
	}

	return (
		<div className="space-y-3">
			<div>
				<Label htmlFor="edit-nombre">Nombre</Label>
				<Input id="edit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
			</div>
			<div>
				<Label htmlFor="edit-junta">Junta</Label>
				<Input id="edit-junta" value={junta} onChange={(e) => setJunta(e.target.value)} />
			</div>
			<div>
				<Label htmlFor="edit-registros">Registros</Label>
				<Input id="edit-registros" value={String(registros)} onChange={(e) => setRegistros(e.target.value === "" ? "" : Number(e.target.value))} type="number" />
			</div>
			<div className="flex gap-2 justify-end">
				<Button variant="ghost" onClick={onCancel}>Cancelar</Button>
				<Button className="bg-[var(--sidebar)]" onClick={save}>Guardar</Button>
			</div>
		</div>
	)
}

export default function LibrosPage() {
	const [isOpen, setIsOpen] = useState(false)
	const [grouped, setGrouped] = useState<LibrosGrouped | null>(null)
	const [search, setSearch] = useState("")
	const [viewLibro, setViewLibro] = useState<LibroItem | null>(null)
	const [editLibro, setEditLibro] = useState<LibroItem | null>(null)

	function handleDownload(libro: LibroItem) {
		const content = `Libro: ${libro.nombre}\nJunta: ${libro.junta}\nRegistros: ${libro.registros}\nÚltima: ${libro.actualizado}`
		const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${libro.nombre.replace(/\s+/g, "_")}.txt`
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
	}

	function handleDelete(id: number) {
		if (!confirm("¿Eliminar este libro? Esta acción no se puede deshacer.")) return
		if (!grouped) return
		const next: LibrosGrouped = Object.fromEntries(
			Object.entries(grouped).map(([k, items]) => [k, items.filter((it) => it.id !== id)])
		) as LibrosGrouped
		setGrouped(next)
	}

	function handleSaveEdit(updated: LibroItem) {
		if (!grouped) return
		const next: LibrosGrouped = Object.fromEntries(
			Object.entries(grouped).map(([k, items]) => [k, items.map((it) => (it.id === updated.id ? updated : it))])
		) as LibrosGrouped
		setGrouped(next)
		setEditLibro(null)
	}

	useEffect(() => {
		getLibrosGrouped().then((data) => setGrouped(data))
	}, [])

	if (!grouped) return <div className="p-4">Cargando...</div>

	return (
		<div className="space-y-6 p-4 md:p-8">
			{/* Header */}
			<div>
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-[var(--sidebar)]/10 rounded-lg">
						<BookIcon />
					</div>
					<h1 className="text-3xl font-bold tracking-tight">Libros de Registro</h1>
				</div>
				<p className="text-muted-foreground">Gestiona libros de inventarios, actas, afiliados y tesorería</p>
			</div>

			{/* Search + Tabs */}
			<div className="mb-4">
				<Input placeholder="Buscar libros o juntas..." value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>

			{/* Tabs */}
			<Tabs defaultValue="inventarios" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="inventarios">Inventarios</TabsTrigger>
					<TabsTrigger value="actas">Actas</TabsTrigger>
					<TabsTrigger value="afiliados">Afiliados</TabsTrigger>
					<TabsTrigger value="tesoreria">Tesorería</TabsTrigger>
				</TabsList>

				{(Object.entries(grouped) as [string, LibrosGrouped[keyof LibrosGrouped]][]).map(([key, items]) => (
					<TabsContent key={key} value={key} className="space-y-4">
						<div className="flex justify-end">
							<Dialog open={isOpen} onOpenChange={setIsOpen}>
								<DialogTrigger asChild>
									<Button className="gap-2 bg-[var(--sidebar)]">
										<PlusIcon /> Nuevo Libro
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Crear Nuevo Libro</DialogTitle>
										<DialogDescription>Registra un nuevo libro de {key}</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="nombre">Nombre del Libro</Label>
											<Input id="nombre" placeholder="Ej: Inventario Equipos 2024" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="junta">Junta</Label>
											<Input id="junta" placeholder="Seleccionar junta" />
										</div>
										<Button className="w-full bg-[var(--sidebar)]">Crear Libro</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{items
								.filter((it) => {
									if (!search) return true
									const q = search.toLowerCase()
									return it.nombre.toLowerCase().includes(q) || it.junta.toLowerCase().includes(q)
								})
								.map((libro) => (
									<LibroCard
										key={libro.id}
										libro={libro}
										onView={(l) => setViewLibro(l)}
										onEdit={(l) => setEditLibro(l)}
										onDownload={(l) => handleDownload(l)}
										onDelete={(id) => handleDelete(id)}
									/>
								))}
						</div>
					</TabsContent>
				))}
			</Tabs>

			{/* View Dialog */}
			<Dialog open={!!viewLibro} onOpenChange={(o) => !o && setViewLibro(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Detalle del Libro</DialogTitle>
					</DialogHeader>
					{viewLibro && (
						<div className="space-y-2 py-2">
							<div>
								<strong>Nombre:</strong> {viewLibro.nombre}
							</div>
							<div>
								<strong>Junta:</strong> {viewLibro.junta}
							</div>
							<div>
								<strong>Registros:</strong> {viewLibro.registros}
							</div>
							<div>
								<strong>Última actualización:</strong> {viewLibro.actualizado}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={!!editLibro} onOpenChange={(o) => !o && setEditLibro(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Libro</DialogTitle>
					</DialogHeader>
					{editLibro && (
						<EditForm libro={editLibro} onCancel={() => setEditLibro(null)} onSave={handleSaveEdit} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
