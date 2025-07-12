import "../assets/styles/login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir recarga
    // Aquí podrías validar campos o enviar datos al backend
    navigate("/dashboard"); // Redirige al dashboard
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta con tu correo y contraseña.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="Ingresa tu correo" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Ingresa tu contraseña" />
          </div>
          <button type="submit" className="login-btn-primary">
            Iniciar Sesión
          </button>
        </form>
        <p className="login-register-link">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
