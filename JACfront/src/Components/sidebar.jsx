import { Link } from "react-router-dom";
import logo from "../assets/images/logo-juntas-blanco.svg"; // usa tu logo real
import "../assets/styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo Juntas" className="sidebar-logo" />
      <h1>JAC</h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-top">
          <li><Link to="/dashboard">Inicio</Link></li>
          <li><Link to="/junta">Juntas</Link></li>
          <li><Link to="/libros">Libros</Link></li>
          <li><Link to="/actas">Actas</Link></li>
          <li><Link to="/certificados">Certificados</Link></li>
        </ul>

        <ul className="nav-bottom">
          <li><Link to="/perfil">Perfil de Usuario</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
          <li><Link to="/login">Cerrar Sesión</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
