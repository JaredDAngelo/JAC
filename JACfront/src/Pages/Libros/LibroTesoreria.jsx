import "../../assets/styles/libros.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function LibroTesoreria() {
  const navigate = useNavigate();
  return (
    <div className="books">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} color="white" />
        Volver
      </button>
      
      <h1>Libro de Tesorería</h1>
      <p className="book-subtitle">
        Administra ingresos, egresos y reportes financieros de la Junta de Acción Comunal.
      </p>
    </div>
  );
}

export default LibroTesoreria;
