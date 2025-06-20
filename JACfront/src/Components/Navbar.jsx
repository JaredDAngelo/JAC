import React from 'react';
import '../assets/styles/Navbar.css';
import { Link } from 'react-router-dom';
// Asegúrate de que esta ruta sea correcta y el archivo exista
import logoJuntas from '../assets/images/logo-juntas.svg'; // O .png, según tu archivo

function Navbar() {
  return (
    <header className="navbar">
  <div className="navbar-container">
    <div className="navbar-left">
      <div className="logo">
        <img src={logoJuntas} alt="Logo Juntas" />
        <span>JAC</span>
      </div>
    </div>
    <div className="navbar-right">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/informacion">Información</Link></li>
          <li><Link to="/ayuda">Ayuda</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
    </div>
  </div>
    </header>
  );
}

export default Navbar;
