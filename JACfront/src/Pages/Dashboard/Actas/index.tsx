"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import ActasTable from "./components/ActasTable"
import NuevoActaModal from "./components/NuevoActaModal"
import type { Acta } from "./interfaces/types"
import { getActas, createActa } from "./services/actasService"

export default function ActasPage() {
	const [isOpen, setIsOpen] = useState(false)
	const [actas, setActas] = useState<Acta[]>([])
	const [loading, setLoading] = useState(false)
	const [viewOpen, setViewOpen] = useState(false)
	const [selectedActa, setSelectedActa] = useState<Acta | null>(null)
	const [editOpen, setEditOpen] = useState(false)
	const [editFormData, setEditFormData] = useState<Partial<Acta> | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [filterEstado, setFilterEstado] = useState("Todas")

	const filteredActas = useMemo(() => {
		return actas.filter((acta) => {
			const matchesSearch =
				acta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
				acta.junta.toLowerCase().includes(searchTerm.toLowerCase()) ||
				acta.asunto.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesEstado = filterEstado === "Todas" || acta.estado === filterEstado
			return matchesSearch && matchesEstado
		})
	}, [actas, searchTerm, filterEstado])

  useEffect(() => {
	setLoading(true)
	getActas()
	  .then((data) => setActas(data))
	  .finally(() => setLoading(false))
  }, [])

  async function handleCreate(payload: Omit<Acta, "id">) {
	const created = await createActa(payload)
	setActas((s) => [created, ...s])
  }

	function handleEdit(acta: Acta) {
		setEditFormData(acta)
		setSelectedActa(acta)
		setEditOpen(true)
	}

	function handleSaveEdit() {
		if (!editFormData) return
		setActas((s) => s.map((a) => (a.id === editFormData.id ? (editFormData as Acta) : a)))
		setEditOpen(false)
		setEditFormData(null)
	}

	function handleDelete(id: number) {
		setActas((s) => s.filter((a) => a.id !== id))
	}

	function handleView(acta: Acta) {
		setSelectedActa(acta)
		setViewOpen(true)
	}

	function handleDownload(acta: Acta) {
		const content = `Acta: ${acta.numero}\n\nFecha: ${acta.fecha}\nJunta: ${acta.junta}\nAsunto: ${acta.asunto}\nEstado: ${acta.estado}\n\n${acta.contenido || ''}`
		const el = document.createElement("a")
		el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
		el.setAttribute("download", `Acta_${acta.numero}.txt`)
		el.style.display = "none"
		document.body.appendChild(el)
		el.click()
		document.body.removeChild(el)
	}

	const SearchIcon = () => (
		<svg className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	)

	return (
	<div className="space-y-6 p-4 md:p-8">
	  {/* Header */}
	  <div>
		<div className="flex items-center gap-3 mb-2">
		  <div className="p-2 bg-[var(--sidebar)]/10 rounded-lg">
			{/* icon retained visually */}
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			  <path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			  />
			</svg>
		  </div>
		  <h1 className="text-3xl font-bold tracking-tight">Actas de Reuniones</h1>
		</div>
		<p className="text-muted-foreground">Crea, edita y descarga actas de reuniones</p>
	  </div>

	  {/* Stats */}
	  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Card className="border-l-4 border-l-primary">
		  <CardContent className="pt-6">
			<div className="text-2xl font-bold">{actas.length}</div>
			<p className="text-sm text-muted-foreground">Total de Actas</p>
		  </CardContent>
		</Card>
		<Card className="border-l-4 border-l-green-400">
		  <CardContent className="pt-6">
			<div className="text-2xl font-bold">{actas.filter((a) => a.estado === "Publicada").length}</div>
			<p className="text-sm text-muted-foreground">Publicadas</p>
		  </CardContent>
		</Card>
		<Card className="border-l-4 border-l-yellow-400">
		  <CardContent className="pt-6">
			<div className="text-2xl font-bold">{actas.filter((a) => a.estado === "Borrador").length}</div>
			<p className="text-sm text-muted-foreground">En Borrador</p>
		  </CardContent>
		</Card>
	  </div>

			{/* Barra de filtros */}
			<Card className="border-0 shadow-md">
				<CardHeader className="border-b">
					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div className="flex-1">
							<Label htmlFor="search" className="text-sm">Buscar</Label>
							<div className="relative mt-2">
								<SearchIcon />
								<Input id="search" placeholder="Número, junta o asunto..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
							</div>
						</div>
						<div className="w-full md:w-48">
							<Label htmlFor="estado" className="text-sm">Estado</Label>
							<Select value={filterEstado} onValueChange={setFilterEstado}>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Todas">Todas</SelectItem>
									<SelectItem value="Publicada">Publicada</SelectItem>
									<SelectItem value="Borrador">Borrador</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* New Acta Button and Table */}
	  <div className="space-y-4">
		<div className="flex justify-end">
		  <Button className="gap-2 bg-[var(--sidebar)]" onClick={() => setIsOpen(true)}>
			Nueva Acta
		  </Button>
		  <NuevoActaModal open={isOpen} onOpenChange={setIsOpen} onCreate={(d) => handleCreate(d)} />
		</div>

						<Card>
							<div className="p-2">
								<ActasTable actas={filteredActas} onView={(a) => handleView(a)} onEdit={(a) => handleEdit(a)} onDownload={(a) => handleDownload(a)} onDelete={(id) => handleDelete(id)} />
								{loading && <div className="text-sm text-muted-foreground mt-2">Cargando...</div>}
							</div>
						</Card>
	  </div>
					{/* Detalle de Acta (Dialog) */}
					<Dialog open={viewOpen} onOpenChange={setViewOpen}>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Detalles del Acta</DialogTitle>
							</DialogHeader>
							{selectedActa && (
								<div className="space-y-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label className="text-xs text-muted-foreground">Acta #</Label>
											<p className="font-semibold">{selectedActa.numero}</p>
										</div>
										<div className="space-y-2">
											<Label className="text-xs text-muted-foreground">Fecha</Label>
											<p className="font-semibold">{selectedActa.fecha}</p>
										</div>
									</div>
									<div className="space-y-2">
										<Label className="text-xs text-muted-foreground">Junta</Label>
										<p className="font-semibold">{selectedActa.junta}</p>
									</div>
									<div className="space-y-2">
										<Label className="text-xs text-muted-foreground">Asunto</Label>
										<p className="font-semibold">{selectedActa.asunto}</p>
									</div>
									<div className="space-y-2">
										<Label className="text-xs text-muted-foreground">Contenido</Label>
										<p className="text-sm text-muted-foreground">{selectedActa.contenido}</p>
									</div>
									<div className="space-y-2">
										<Label className="text-xs text-muted-foreground">Estado</Label>
										<Badge className={selectedActa.estado === 'Publicada' ? 'bg-green-500' : 'bg-yellow-500'}>
											{selectedActa.estado}
										</Badge>
									</div>
								</div>
							)}
						</DialogContent>
					</Dialog>

					{/* Edit Dialog */}
					<Dialog open={editOpen} onOpenChange={setEditOpen}>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Editar Acta</DialogTitle>
							</DialogHeader>
							{editFormData && (
								<div className="space-y-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="edit-numero">Número</Label>
											<Input id="edit-numero" value={editFormData.numero || ''} onChange={(e) => setEditFormData({ ...editFormData, numero: e.target.value })} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="edit-junta">Junta</Label>
											<Input id="edit-junta" value={editFormData.junta || ''} onChange={(e) => setEditFormData({ ...editFormData, junta: e.target.value })} />
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="edit-asunto">Asunto</Label>
										<Input id="edit-asunto" value={editFormData.asunto || ''} onChange={(e) => setEditFormData({ ...editFormData, asunto: e.target.value })} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="edit-contenido">Contenido</Label>
										<Textarea id="edit-contenido" className="min-h-32" value={editFormData.contenido || ''} onChange={(e) => setEditFormData({ ...editFormData, contenido: e.target.value })} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="edit-estado">Estado</Label>
										<Select value={String(editFormData.estado || '')} onValueChange={(value) => setEditFormData({ ...editFormData, estado: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Publicada">Publicada</SelectItem>
												<SelectItem value="Borrador">Borrador</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<Button className="w-full bg-[var(--sidebar)]" onClick={handleSaveEdit}>
										Guardar Cambios
									</Button>
								</div>
							)}
						</DialogContent>
					</Dialog>
			</div>
		)
	}
