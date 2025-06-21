import "../../assets/styles/libros.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LibroInventarios() {
    const navigate = useNavigate();

  return (
    <div className="books">
      <buton className="back-button" onClick={() => navigate(-1)}>
      <ArrowLeft size={20} color="white" />
      Volver 
    </buton>

      <h1>Libro de Inventarios</h1>
      <p className="book-subtitle">
        Administra y controla los bienes y activos de la Junta de Acción Comunal.
      </p>
    </div>
  );
}

export default LibroInventarios;
