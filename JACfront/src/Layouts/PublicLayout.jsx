import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/logo-juntas.svg";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 border-b container">
        <div className="flex items-center gap-2">
          <img src={logo} alt="JAC" className="w-13 h-12 sm:w-15 sm:h-14" />
          <span className="font-bold text-xl text-primary">JAC</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition inline">Inicio</Link>
          <Link to="/descargas" className="text-sm text-muted-foreground hover:text-foreground transition inline">Descargas</Link>
          <Link to="/login" className="hidden sm:inline">
            <button className="border px-3 py-1 rounded">Iniciar sesión</button>
          </Link>
          <Link to="/registro" className="hidden sm:inline">
            <button className="border px-3 py-1 rounded">Registrate</button>
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t px-6 py-8 lg:px-12 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 JAC. Gestión de Juntas de Acción Comunal. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
