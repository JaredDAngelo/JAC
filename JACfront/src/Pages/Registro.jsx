import "../assets/styles/registro.css";

function Registro() {
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Crear una cuenta</h1>
        <p>Regístrate para unirte a tu Junta de Acción Comunal.</p>
        <form className="register-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" placeholder="Ingresa tu nombre" />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="Ingresa tu correo" />
          </div>
          <div className="form-group">
            <label>Número de cédula</label>
            <input type="text" placeholder="Ingresa tu cédula" />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" placeholder="Ingresa tu teléfono" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Crea una contraseña" />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" placeholder="Confirma tu contraseña" />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select>
              <option value="">Selecciona tu rol</option>
              <option value="lider">Líder de JAC</option>
              <option value="miembro">Miembro Activo</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="register-btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
