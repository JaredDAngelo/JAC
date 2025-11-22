import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchProfile } from './services'
import type { UserProfile } from './interfaces'

const Profile: React.FC = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')

	useEffect(() => {
		fetchProfile().then((p) => {
			setProfile(p)
			setName(p.name || '')
			setEmail(p.email)
		})
	}, [])

	function save() {
		// aquí podríamos llamar al service para persistir; por ahora sólo actualizamos el estado local
		setProfile((prev) => (prev ? { ...prev, name, email } : prev))
		alert('Perfil guardado (simulado)')
	}

	return (
		<div className="space-y-8 p-6 md:p-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Perfil de Usuario</h1>
				<p className="text-muted-foreground mt-2">Gestiona tu información personal</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Información Personal</CardTitle>
					<CardDescription>Actualiza tus datos</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Nombre completo</label>
							<Input placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Correo electrónico</label>
							<Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Teléfono</label>
						<Input placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Rol</label>
						<div className="bg-muted p-3 rounded-lg">
							<p className="text-sm">{profile?.name ? 'Administrador' : 'Usuario'}</p>
						</div>
					</div>

					<div className="flex gap-4 pt-4 border-t">
						<Button className="gap-2" onClick={save}>💾 Guardar cambios</Button>
						<Button variant="outline" onClick={() => {
							// restablecer valores al perfil original
							if (profile) {
								setName(profile.name || '')
								setEmail(profile.email)
							}
						}}>❌ Cancelar</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Profile
