import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { fetchSettings } from './services'

type ThemeMode = 'light' | 'dark' | 'system'

const Settings: React.FC = () => {
	const [themeMode, setThemeMode] = useState<ThemeMode>('system')
	const [mounted, setMounted] = useState(false)
	const [changePassOpen, setChangePassOpen] = useState(false)
	const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

	useEffect(() => {
		setMounted(true)
		const savedTheme = localStorage.getItem('theme') as ThemeMode | null
		if (savedTheme) setThemeMode(savedTheme)
		fetchSettings().then(() => {})
	}, [])

	const handleThemeChange = (mode: ThemeMode) => {
		setThemeMode(mode)
		localStorage.setItem('theme', mode)
		if (mode === 'dark') document.documentElement.classList.add('dark')
		else if (mode === 'light') document.documentElement.classList.remove('dark')
		else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			if (prefersDark) document.documentElement.classList.add('dark')
			else document.documentElement.classList.remove('dark')
		}
	}

	const handleChangePassword = () => {
		if (passwords.new !== passwords.confirm) {
			alert('Las contraseñas no coinciden')
			return
		}
		if (passwords.new.length < 6) {
			alert('La contraseña debe tener al menos 6 caracteres')
			return
		}
		alert('Contraseña actualizada correctamente')
		setChangePassOpen(false)
		setPasswords({ current: '', new: '', confirm: '' })
	}

	if (!mounted) return null

	const themeOptions = [
		{ value: 'light' as ThemeMode, label: 'Claro', icon: '☀️', description: 'Fondo blanco' },
		{ value: 'dark' as ThemeMode, label: 'Oscuro', icon: '🌙', description: 'Fondo oscuro' },
		{ value: 'system' as ThemeMode, label: 'Sistema', icon: '💻', description: 'Preferencia del sistema' },
	]

	return (
		<div className="space-y-8 p-6 md:p-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
				<p className="text-muted-foreground mt-2">Personaliza tu experiencia en JAC</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Tema de la aplicación</CardTitle>
					<CardDescription>Elige cómo deseas que se vea la interfaz</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{themeOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleThemeChange(option.value)}
								className={`p-4 rounded-lg border-2 transition-all text-left ${
									themeMode === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
								}`}
							>
								<p className="text-2xl mb-2">{option.icon}</p>
								<p className="font-medium text-sm">{option.label}</p>
								<p className="text-xs text-muted-foreground mt-1">{option.description}</p>
							</button>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Cuenta</CardTitle>
					<CardDescription>Información de tu cuenta</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-sm font-medium">Nombre</label>
						<p className="mt-1 text-sm text-muted-foreground">Jared García</p>
					</div>
					<div>
						<label className="text-sm font-medium">Correo</label>
						<p className="mt-1 text-sm text-muted-foreground">test@example.com</p>
					</div>
					<div className="pt-4 border-t">
						<Dialog open={changePassOpen} onOpenChange={setChangePassOpen}>
							<DialogTrigger asChild>
								<Button variant="default" className="gap-2">
									<Lock /> Cambiar contraseña
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>Cambiar Contraseña</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="current">Contraseña Actual</Label>
										<Input id="current" type="password" placeholder="Ingresa tu contraseña actual" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="new">Nueva Contraseña</Label>
										<Input id="new" type="password" placeholder="Ingresa una nueva contraseña" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="confirm">Confirmar Contraseña</Label>
										<Input id="confirm" type="password" placeholder="Confirma tu nueva contraseña" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
									</div>
									<Button className="w-full bg-primary" onClick={handleChangePassword}>Actualizar Contraseña</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Settings
