import '../assets/styles/perfilUsuario.css';

function PerfilUsuario() {
  return (
    <div className="perfil">
      <h1>Mi cuenta</h1>
      <div className="perfil-grid">
        <div>Actualizar datos</div>
        <div>Cambiar contraseña</div>
        <div>Mis documentos</div>
        <div>Cerrar sesión</div>
      </div>
    </div>
  );
}

export default PerfilUsuario;