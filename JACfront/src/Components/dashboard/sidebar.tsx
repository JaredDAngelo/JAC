import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar'
import { useSidebar } from '../ui/sidebar'
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  Key,
  FileTextIcon,
  AwardIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react'
import { logout } from '../../api/auth'
import { toast } from 'sonner'
// Definición de items del sidebar (label, href y componente de icono)
const menuItems = [
  { label: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { label: 'Juntas', href: '/dashboard/juntas', icon: UsersIcon },
  { label: 'Usuarios', href: '/dashboard/usuarios', icon: UsersIcon },
  { label: 'Roles y Permisos', href: '/dashboard/roles-permisos', icon: Key },
  { label: 'Libros', href: '/dashboard/libros', icon: BookOpenIcon },
  { label: 'Actas', href: '/dashboard/actas', icon: FileTextIcon },
  { label: 'Certificados', href: '/dashboard/certificados', icon: AwardIcon },
]

const bottomItems = [
  { label: 'Perfil de Usuario', href: '/dashboard/perfil', icon: UserIcon },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: SettingsIcon },
  { label: 'Cerrar Sesión', href: '/api/auth/logout', icon: LogOutIcon },
]
export function Sidebar() {
  const pathname = useLocation().pathname
  const { state } = useSidebar()

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center shadow-sm">
            <span className="font-bold text-sidebar-primary">J</span>
          </div>
          {state === 'expanded' && <span className="font-bold text-lg">JAC</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon as any

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    // make the whole button transparent so our inner Link controls visuals
                    'bg-transparent',
                  )}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 w-full',
                      isActive ? 'bg-white rounded-md px-2 py-1 text-[#013d2d]' : '',
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-md w-9 h-9 shrink-0',
                        isActive ? 'bg-muted' : 'bg-sidebar-overlay',
                      )}
                    >
                      {Icon ? (
                        <Icon className={cn('size-5', isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground')} />
                      ) : (
                        <span className="text-lg">?</span>
                      )}
                    </div>
                    <span className={cn('text-sm font-medium', isActive ? 'text-sidebar-primary' : '')}>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border p-3">
        <SidebarMenu>
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon as any

            // Si es el item de cerrar sesión, renderizamos un botón que llama a logout
            if (item.label === 'Cerrar Sesión') {
              const navigate = useNavigate()
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={false} tooltip={item.label}>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          logout()
                          toast.success('Sesión finalizada correctamente')
                        } catch (e) {
                          // noop
                        }
                        navigate('/')
                      }}
                      className={cn('flex items-center gap-3 w-full')}
                    >
                      <div className="flex items-center justify-center rounded-md w-8 h-8 shrink-0 bg-sidebar-overlay">
                        {Icon ? <Icon className="size-4 text-sidebar-foreground" /> : <span className="text-lg">?</span>}
                      </div>
                      <span className="text-sm font-medium text-sidebar-foreground">{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link to={item.href} className={cn('flex items-center gap-3 w-full')}> 
                    <div className="flex items-center justify-center rounded-md w-8 h-8 shrink-0 bg-sidebar-overlay">
                      {Icon ? <Icon className="size-4 text-sidebar-foreground" /> : <span className="text-lg">?</span>}
                    </div>
                    <span className="text-sm font-medium text-sidebar-foreground">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

