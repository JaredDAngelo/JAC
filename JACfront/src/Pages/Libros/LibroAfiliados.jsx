import "../../assets/styles/libros.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function LibroAfiliados() {
    const navigate = useNavigate();
  return (
    <div className="books">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} color="white" />
        Volver
      </button>

      <h1>Libro de Afiliados</h1>
      <p className="book-subtitle">
        Registra y gestiona la información de los miembros activos de la Junta.
      </p>
    </div>
  );
}

export default LibroAfiliados;
