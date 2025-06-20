import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import PrivateLayout from "./Layouts/PrivateLayout";

import Home from "./Pages/Home";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Notfound from "./Pages/Notfound";

import Dashboard from "./Pages/Dashboard"; // Ejemplo
import Libros from "./Pages/Libros";
import Certificados from "./Pages/Certificados";
import Actas from "./Pages/Actas";
import PerfilUsuario from "./Pages/PerfilUsuario";

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
          <Route path="/libros" element={<Libros />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/actas" element={<Actas />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
