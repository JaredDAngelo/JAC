import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "../components/ui/sidebar"
import { Sidebar as DashboardMenu } from "../components/dashboard/sidebar"
import { TopBar } from "../components/dashboard/top-bar"

function PrivateLayout() {
  // LayoutContent must be a child of SidebarProvider to use the hook
  function LayoutContent() {
    const { state, isMobile } = useSidebar()

    const containerClass = `flex h-screen bg-background text-foreground ${
      state === 'expanded' ? 'sidebar-expanded' : 'sidebar-collapsed'
    }`

    return (
      <div className={containerClass}>
        {/* Sidebar (collapsible provided by ui/sidebar) */}
        <UiSidebar className="border-r border-border bg-sidebar text-sidebar-foreground" collapsible="icon">
          <SidebarContent>
            <DashboardMenu />
          </SidebarContent>
        </UiSidebar>

        {/* Main content area: top bar + outlet; scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="private-main flex-1 overflow-auto p-4 min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  )
}

export default PrivateLayout
