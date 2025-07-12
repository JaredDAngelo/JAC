import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api"; // Asegúrate que este archivo existe y tiene la configuración base
import "../assets/styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", { correo, contraseña });
      const { token } = response.data;

      localStorage.setItem("token", token);
      alert("¡Inicio de sesión exitoso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data?.message || error.message);
      alert("Error al iniciar sesión: " + (error.response?.data?.message || "Intenta más tarde"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta con tu correo y contraseña.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn-primary">Iniciar Sesión</button>
        </form>
        <p className="login-register-link">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
