import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Juntas Registradas',
      value: '12',
      icon: '👥',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Actas Generadas',
      value: '45',
      icon: '📄',
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Certificados Emitidos',
      value: '30',
      icon: '🏆',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Libros Activos',
      value: '7',
      icon: '📚',
      color: 'text-orange-600 bg-orange-100',
    },
  ]

  const recent = [
    { action: 'Se creó una nueva acta', time: 'Hace 2 horas' },
    { action: 'Se emitió un certificado', time: 'Hace 1 día' },
    { action: 'Se registró una nueva junta', time: 'Hace 3 días' },
  ]

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">¡Hola! Jared García.</h1>
        <p className="text-muted-foreground mt-2">
          Aquí encontrarás un resumen de la información clave de tu Junta de Acción Comunal.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} text-xl`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas operaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recent.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-0">
                <p className="text-sm">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

