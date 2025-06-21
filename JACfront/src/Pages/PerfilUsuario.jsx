import '../assets/styles/perfilUsuario.css';
import { useNavigate } from 'react-router-dom';

function PerfilUsuario() {
  const navigate = useNavigate();

  return (
    <div className="profile">
      <h1>Mi Cuenta</h1>
      <p className="profile-subtitle">
        Administra la información de tu perfil y tus preferencias.
      </p>

      <div className="profile-grid">
        <button className="profile-card" onClick={() => {/* navega o muestra modal */}}>
          Actualizar Datos
        </button>
        <button className="profile-card" onClick={() => {/* navega o muestra modal */}}>
          Cambiar Contraseña
        </button>
        <button className="profile-card" onClick={() => {/* navega o muestra modal */}}>
          Mis Documentos
        </button>
        <button className="profile-card" onClick={() => navigate("/login")}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default PerfilUsuario;
