import "../../assets/styles/libros.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"

function LibroControl() {
  const navigate = useNavigate();
  return (
    <div className="books">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} color="white"/>
        Volver
      </button>
      
      <h1>Libro de Control</h1>
      <p className="book-subtitle">
        Supervisa los procesos internos y controles administrativos de la Junta.
      </p>
    </div>
  );
}

export default LibroControl;
