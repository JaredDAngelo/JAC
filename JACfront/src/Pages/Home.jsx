import "../assets/styles/home.css";
import { useNavigate } from "react-router-dom";
// Ya no necesitas importar Navbar aquí, porque se renderiza en App.jsx
// import Navbar from "../Components/Navbar.jsx"; 

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-content"> 
      <h1>Gestión de Juntas de Acción Comunal</h1>
      <p>Accede a tu cuenta para gestionar juntas de acción comunal de manera eficiente.</p>
      <div className="home-buttons">
        <button className="home-btn-primary" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
        <button className="home-btn-outline" onClick={() => navigate("/registro")}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default Home;