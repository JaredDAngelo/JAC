import "../assets/styles/libros.css";
import { Link } from "react-router-dom";

function Libros() {
  return (
    <div className="libros">
      <h1>Menú de Libros</h1>
      <p className="libros-subtitle">
        Selecciona el tipo de libro que deseas consultar o gestionar.
      </p>

      <div className="libros-grid">
        <Link to="/libros/inventarios" className="libro-card">
          <h2>Libro de Inventarios</h2>
          <p>Controla los bienes y activos de la JAC.</p>
        </Link>
        <Link to="/libros/afiliados" className="libro-card">
          <h2>Libro de Afiliados</h2>
          <p>Gestiona la información de miembros y afiliados.</p>
        </Link>
        <Link to="/libros/actas" className="libro-card">
          <h2>Libro de Actas</h2>
          <p>Consulta y registra actas de reuniones.</p>
        </Link>
        <Link to="/libros/tesoreria" className="libro-card">
          <h2>Libro de Tesorería</h2>
          <p>Registra movimientos financieros y estados de cuenta.</p>
        </Link>
      </div>
    </div>
  );
}

export default Libros;
