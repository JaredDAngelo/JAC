import "../../assets/styles/libros.css"; // ahora en inglés
import { Link } from "react-router-dom";
import { Upload, BookOpen, ClipboardList, Users, Book, DollarSign, CheckSquare } from "lucide-react";

function Libros() {
  return (
    <div className="books">
      <h1>Gestion de libros</h1>

      <div className="action-buttons">
        <button className="primary-button">
          <Upload size={20} />
          Subir libro
        </button>
        <button className="secondary-button">
          <BookOpen size={20} />
          Solicitar libro
        </button>
      </div>

      <div className="books-grid">
        <Link to="/libros/inventarios" className="book-card">
          <ClipboardList size={32} className="book-card-icon" />
          <h2>Libro de Inventarios</h2>
        </Link>
        <Link to="/libros/afiliados" className="book-card">
          <Users size={32} className="book-card-icon" />
          <h2>Libro de Afiliados</h2>
        </Link>
        <Link to="/libros/actas" className="book-card">
          <Book size={32} className="book-card-icon" />
          <h2>Libro de Actas</h2>
        </Link>
        <Link to="/libros/control" className="book-card">
          <CheckSquare size={32} className="book-card-icon" />
          <h2>Libro de Control</h2>
        </Link>
        <Link to="/libros/tesoreria" className="book-card">
          <DollarSign size={32} className="book-card-icon" />
          <h2>Libro de Tesoreria</h2>
        </Link>
      </div>
    </div>
  );
}

export default Libros;
