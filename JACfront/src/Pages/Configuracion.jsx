import "../assets/styles/configuracion.css";

function Configuracion() {
  return (
    <div className="settings">
      <h1>Configuración de la Aplicación</h1>
      <p className="settings-subtitle">
        Personaliza la apariencia y comportamiento de la plataforma.
      </p>

      <form className="settings-form">
        <div className="form-group">
          <label htmlFor="darkMode">Modo Oscuro</label>
          <select id="darkMode">
            <option>Desactivado</option>
            <option>Activado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="language">Idioma de la Plataforma</label>
          <select id="language">
            <option>Español</option>
            <option>Inglés</option>
            {/* Agrega más idiomas si quieres */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notifications">Notificaciones</label>
          <select id="notifications">
            <option>Activadas</option>
            <option>Desactivadas</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fontSize">Tamaño de Fuente</label>
          <select id="fontSize">
            <option>Normal</option>
            <option>Grande</option>
          </select>
        </div>

        <button type="submit" className="primary-button">
          Guardar Preferencias
        </button>
      </form>
    </div>
  );
}

export default Configuracion;
