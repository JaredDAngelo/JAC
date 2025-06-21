import "../../assets/styles/libros.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function LibroActas() {
  const navigate = useNavigate();

  return (
    <div className="books">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} color="white" />
        Volver
      </button>

      <h1>Libro de Actas</h1>
      <p className="book-subtitle">
        Consulta y registra las actas de reuniones de la Junta de Acción Comunal.
      </p>
    </div>
  );
}

export default LibroActas;