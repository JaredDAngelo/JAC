import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Asegúrate que apunta al archivo correcto
import "../assets/styles/registro.css";

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    cedula: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      await API.post("/auth/registro", {
        nombre: formData.nombre,
        correo: formData.correo,
        cedula: Number(formData.cedula),
        telefono: formData.telefono,
        contraseña: formData.contraseña,
      });

      alert("¡Registro exitoso!");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error.response?.data?.message || error.message);
      alert("Error al registrar: " + (error.response?.data?.message || "Intenta más tarde"));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Crear una cuenta</h1>
        <p>Regístrate para unirte a tu Junta de Acción Comunal.</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Número de cédula</label>
            <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} required />
          </div>
          <button type="submit" className="register-btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
