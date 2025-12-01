import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import PublicLayout from "./Layouts/PublicLayout";
import PrivateLayout from "./Layouts/PrivateLayout";
import PrivateRoute from "./components/PrivateRoute"; // simple placeholder for now
import AdminRoute from './components/AdminRoute'

// Páginas públicas (usando nuevas vistas organizadas)
import Home from "./Pages/Home";
import Descargas from "./Pages/Descargas";
import Registro from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Notfound from "./Pages/Notfound";

// Páginas privadas
import Dashboard from "./Pages/Dashboard";
import Libros from "./Pages/Dashboard/Libros/";
import Actas from "./Pages/Dashboard/Actas";
import PerfilUsuario from "./Pages/Dashboard/Profile";
import Junta from "./Pages/Dashboard/Juntas";
import RegistrarJAC from "./Pages/Juntas/RegistrarJAC";
import Configuracion from "./Pages/Dashboard/Settings";
import Usuarios from "./Pages/Dashboard/Usuarios";
import RolesPermisos from "./Pages/Dashboard/RolesPermisos";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout público: Home, login, registro */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/descargas" element={<Descargas />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Layout privado: Panel con autenticación */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Listado de juntas (plural) */}
            <Route path="/dashboard/juntas" element={<Junta />} />
            {/* Ruta singular antigua (legacy) kept for compatibility */}
            <Route path="/dashboard/junta" element={<Junta />} />
            <Route path="/dashboard/juntas/registrar" element={<RegistrarJAC />} />

            {/* Subvistas de libros (anidadas bajo /dashboard) */}
            <Route path="/dashboard/libros" element={<Libros />} />

            <Route path="/dashboard/actas" element={<Actas />} />
            <Route path="/dashboard/usuarios" element={<Usuarios />} />
            <Route path="/dashboard/roles-permisos" element={<RolesPermisos />} />
            <Route path="/dashboard/perfil" element={<PerfilUsuario />} />
            <Route path="/dashboard/configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        {/* 404 - Ruta no encontrada */}
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
