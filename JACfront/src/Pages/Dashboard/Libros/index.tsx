"use client"

/*
	Página principal de "Libros de Registro".

	Descripción:
	- Componente de página que muestra los libros agrupados por tipo (inventarios, actas, afiliados, tesorería).
	- Gestiona la carga inicial, búsquedas, vistas en modal, descarga y apertura del formulario de edición.

	Consideraciones para producción:
	- Evitar exposiciones de tokens en URLs: las descargas y vistas usan fetch con cabeceras del cliente (API axios),
		por eso se descargan como blobs y se crean object URLs temporales.
	- Manejo de errores: se muestran toasts genéricos en UI; para producción es recomendable mostrar mensajes más
		descriptivos y loggear detalles en el backend.
	- Rendimiento: la lista se carga completa en memoria; si hay muchos libros, agregar paginación o carga por demanda.
*/

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLibrosGrouped, updateLibro, deleteLibro, fetchLibroBlob, downloadLibro, getLibroById } from "./services/librosGroupedService"
import type { LibrosGrouped, LibroItem } from "./services/librosGroupedService"
import { toast } from 'sonner'
import { getJuntas } from '@/Pages/Dashboard/Juntas/services/juntasService'
import NuevoLibroModal from './components/NuevoLibroModal'

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

import LibroCard from './components/LibroCard'
import EditForm from './components/EditForm'

export default function LibrosPage() {
	// NuevoLibroModal maneja su propio estado de apertura
	const [juntasList, setJuntasList] = useState<any[]>([])
	const [grouped, setGrouped] = useState<LibrosGrouped | null>(null)
	const [search, setSearch] = useState("")
	const [viewLibro, setViewLibro] = useState<LibroItem | null>(null)
	const [editLibro, setEditLibro] = useState<LibroItem | null>(null)
	const [viewBlobUrl, setViewBlobUrl] = useState<string | null>(null)
	const [viewLoading, setViewLoading] = useState(false)

	// Nota: las descargas de PDF se realizan con `downloadLibro` (usa el endpoint backend y auth).
	async function handleDelete(id: string) {
		if (!confirm("¿Eliminar este libro? Esta acción no se puede deshacer.")) return
		if (!grouped) return
		try {
			await deleteLibro(id)
			toast.success('Libro eliminado exitosamente')
		} catch (e: any) {
			console.error('deleteLibro failed', e)
			const msg = e?.response?.data?.message || e?.message || 'Error al eliminar el libro'
			toast.error(String(msg))
			return
		}
		const next: LibrosGrouped = Object.fromEntries(
			Object.entries(grouped).map(([k, items]) => [k, items.filter((it) => it.id !== id)])
		) as LibrosGrouped
		setGrouped(next)
	}

	async function handleSaveEdit(updated: LibroItem) {
		if (!grouped) return
		try {
			const res = await updateLibro(updated.id, { nombre: updated.nombre, junta: updated.junta, tipo: updated.tipo })
			// mapear la respuesta (si el backend devuelve el libro) a nuestra forma LibroItem
			const mapped = {
				id: String(res._id ?? res.id ?? updated.id),
				nombre: res.nombre ?? updated.nombre,
				junta: (res.junta && (typeof res.junta === 'string' ? res.junta : res.junta.nombreJunta)) ?? updated.junta,
				tipo: res.tipo ?? updated.tipo,
				actualizado: res.updatedAt ? new Date(res.updatedAt).toISOString().split('T')[0] : updated.actualizado,
			}
			const next: LibrosGrouped = Object.fromEntries(
				Object.entries(grouped).map(([k, items]) => [k, items.map((it) => (it.id === updated.id ? mapped : it))])
			) as LibrosGrouped
			setGrouped(next)
			toast.success(`Libro ${mapped.nombre} actualizado correctamente`)
		} catch (e) {
			console.error('updateLibro failed', e)
			toast.error('Error al actualizar el libro')
		}
		setEditLibro(null)
	}

	useEffect(() => {
		getLibrosGrouped().then((data) => setGrouped(data))
		getJuntas().then((js) => setJuntasList(js)).catch(() => setJuntasList([]))
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
							{/* NuevoLibroModal incluye su propio trigger */}
							<NuevoLibroModal juntas={juntasList} onCreated={async (created) => {
								toast.success(`Libro ${created.nombre ?? 'creado'} creado correctamente`)
								const refreshed = await getLibrosGrouped()
								setGrouped(refreshed)
							}} />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{items
								.filter((it) => {
									if (!search) return true
									const q = search.toLowerCase()
									return (it.nombre || '').toLowerCase().includes(q) || (it.junta || '').toLowerCase().includes(q)
								})
								.map((libro) => (
									<LibroCard
										key={libro.id}
										libro={libro}
										onView={(l) => {
											// abrir modal y cargar blob PDF
											setViewLibro(l)
											setViewLoading(true)
											fetchLibroBlob(l.id)
												.then((b) => {
													const url = window.URL.createObjectURL(new Blob([b], { type: 'application/pdf' }))
													setViewBlobUrl(url)
												})
												.catch((err) => {
													console.error('fetchLibroBlob failed', err)
													toast.error('No se pudo cargar el archivo del libro')
													setViewLibro(null)
												})
												.finally(() => setViewLoading(false))
										}}
										onEdit={async (l) => {
											try {
												const full = await getLibroById(l.id)
												// normalizar a la forma LibroItem
												const juntaFromRes = full.junta
												let juntaId = ''
												let juntaLabelLocal = ''
												if (juntaFromRes) {
													if (typeof juntaFromRes === 'string') {
														// el backend pudo devolver el nombre en lugar del id; usarlo como etiqueta
														juntaLabelLocal = juntaFromRes
														juntaId = juntaFromRes
													} else {
														// objeto poblado
														juntaId = String(juntaFromRes._id ?? juntaFromRes.id ?? '')
														juntaLabelLocal = juntaFromRes.nombreJunta ?? juntaFromRes.nombre ?? ''
													}
												}
												const mapped: LibroItem = {
													id: String(full._id ?? full.id ?? l.id),
													nombre: full.nombre ?? l.nombre,
													junta: juntaId,
													tipo: full.tipo ?? l.tipo ?? '',
													actualizado: full.updatedAt ? new Date(full.updatedAt).toISOString().split('T')[0] : l.actualizado,
												}
												setEditLibro(mapped)
											} catch (err) {
												console.error('getLibroById failed', err)
												// fallback: abrir el editor con el item agrupado
												setEditLibro(l)
											}
										}}
										onDownload={(l) => downloadLibro(l.id, `${l.nombre.replace(/\s+/g,'_')}.pdf`)}
										onDelete={(id) => handleDelete(id)}
									/>
								))}
						</div>
					</TabsContent>
				))}
			</Tabs>

			{/* View Dialog */}
			<Dialog open={!!viewLibro} onOpenChange={(o) => {
				if (!o) {
					setViewLibro(null)
					if (viewBlobUrl) {
						window.URL.revokeObjectURL(viewBlobUrl)
						setViewBlobUrl(null)
					}
				}
			}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Detalle del Libro</DialogTitle>
					</DialogHeader>
					{viewLibro && (
						<div className="space-y-2 py-2">
							<div className="flex items-center justify-between">
								<div>
									<strong>Nombre:</strong> {viewLibro.nombre}
								</div>
								<div className="flex gap-2">
									<Button size="sm" onClick={() => downloadLibro(viewLibro.id, `${viewLibro.nombre.replace(/\s+/g,'_')}.pdf`)}>Descargar</Button>
									<Button size="sm" variant="ghost" onClick={() => {
										// abrir en nueva pestaña usando el blob ya cargado
										if (viewBlobUrl) window.open(viewBlobUrl, '_blank')
									}}>Abrir en nueva pestaña</Button>
								</div>
							</div>
							<div>
								<strong>Junta:</strong> {viewLibro.junta}
							</div>
							<div>
								<strong>Registros:</strong> {viewLibro.registros ?? '—'}
							</div>
							<div>
								<strong>Última actualización:</strong> {viewLibro.actualizado}
							</div>
							<div className="mt-2">
								{viewLoading && <div>Cargando archivo...</div>}
								{!viewLoading && viewBlobUrl && (
									<iframe title="visor-pdf" src={viewBlobUrl} className="w-full h-[70vh]" />
								)}
								{!viewLoading && !viewBlobUrl && (
									<div className="text-sm text-muted-foreground">No hay archivo disponible para este libro.</div>
								)}
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
						<EditForm libro={editLibro} onCancel={() => setEditLibro(null)} onSave={handleSaveEdit} juntas={juntasList} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
