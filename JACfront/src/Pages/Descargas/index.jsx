import React, { useEffect, useState } from 'react'
import { getPublicDocuments } from './services/documentsService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function Descargas() {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    getPublicDocuments().then(setDocs)
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Descargas públicas</h1>
        </div>

        <p className="text-muted-foreground">Aquí puedes descargar actas y otros documentos públicos sin necesidad de iniciar sesión.</p>

        <div className="grid grid-cols-1 gap-4">
          {docs.map((d) => (
            <Card key={d.id} className="border-0 shadow-sm">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">{d.title}</CardTitle>
                <a href={d.url} download>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Descargar
                  </Button>
                </a>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Tipo: {d.type} · Tamaño: {d.size}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
