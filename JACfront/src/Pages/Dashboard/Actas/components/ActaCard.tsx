import { Button } from '@/components/ui/button'

export default function ActaCard({ acta, onView, onDownload, onEdit, onDelete, juntas = [] }: any) {
  return (
    <div className="p-4 border rounded-md shadow-sm bg-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Tipo</div>
          <div className="font-medium">{acta.tipo}</div>
          <div className="text-sm text-muted-foreground">Junta: {(() => {
            const raw = acta.junta ?? ''
            if (!raw) return '—'
            const found = (juntas || []).find((j: any) => String(j.id ?? j._id) === String(raw) || String(j.nombre) === String(raw))
            return found ? (found.nombre ?? raw) : raw
          })()}</div>
          <div className="text-sm text-muted-foreground">Creado: {acta.creado ? new Date(acta.creado).toLocaleDateString() : '—'}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onView(acta)}>Ver</Button>
            <Button size="sm" onClick={() => onDownload(acta)}>Descargar</Button>
          </div>
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline" onClick={() => onEdit(acta)}>Editar</Button>
              <Button size="sm" variant="destructive" className="bg-red-600 text-white hover:bg-red-700 border-transparent" onClick={() => onDelete(acta)} aria-label="Eliminar acta" title="Eliminar acta">
              <span>Eliminar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
