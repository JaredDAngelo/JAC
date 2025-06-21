import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import PrivateLayout from "./Layouts/PrivateLayout";

import Home from "./Pages/Home";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Notfound from "./Pages/Notfound";

import Dashboard from "./Pages/Dashboard"; // Ejemplo
import Libros from "./Pages/Libros/Libros";
import LibroActas from "./Pages/Libros/LibroActas";
import LibroAfiliados from "./Pages/Libros/LibroAfiliados";
import LibroControl from "./Pages/Libros/LibroControl";
import LibroInventarios from "./Pages/Libros/LibroInventario";
import LibroTesoreria from "./Pages/Libros/LibroTesoreria";
import Certificados from "./Pages/Certificados";
import Actas from "./Pages/Actas";
import PerfilUsuario from "./Pages/PerfilUsuario";
import Junta from "./Pages/Juntas/Junta";
import RegistrarJAC from "./Pages/Juntas/RegistrarJAC";
import Configuracion from "./Pages/Configuracion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÚBLICO: Home, Registro, Login */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PRIVADO: Dashboard y módulos */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/junta" element={<Junta />} />
          <Route path="/juntas/registrar" element={<RegistrarJAC />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/libros/actas" element={<LibroActas />} />
          <Route path="/Libros/afiliados" element={<LibroAfiliados />} />
          <Route path="/libros/control" element={<LibroControl />} />
          <Route path="/libros/inventarios" element={<LibroInventarios />} />
          <Route path="/libros/tesoreria" element={<LibroTesoreria />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/actas" element={<Actas />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
