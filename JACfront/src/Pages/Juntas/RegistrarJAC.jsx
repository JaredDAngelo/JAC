import { useNavigate } from "react-router-dom";
import "../../assets/styles/junta.css";
import { ArrowLeft } from "lucide-react";

function RegistrarJAC() {
  const navigate = useNavigate();

  return (
    <div className="juntas">
      <button className="back-button" onClick={() => navigate(-1)}>
      <ArrowLeft size={20} color="white" />
      Volver
      </button>

      <h1>Registrar Nueva Junta de Acción Comunal</h1>
      <p className="juntas-subtitle">
        Completa los siguientes campos para registrar una nueva JAC.
      </p>

      <form className="register-form">
        <div className="form-group">
          <label>Nombre de la JAC</label>
          <input type="text" placeholder="Ejemplo: Junta Barrio El Carmen" />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input type="text" placeholder="Dirección completa" />
        </div>

        <div className="form-group">
          <label>Departamento</label>
          <input type="text" placeholder="Departamento" />
        </div>

        <div className="form-group">
          <label>Municipio</label>
          <input type="text" placeholder="Municipio" />
        </div>

        <div className="form-group">
          <label>Barrio</label>
          <input type="text" placeholder="Barrio" />
        </div>

        <div className="form-group">
          <label>Fecha de Fundación</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Número de Registro Legal</label>
          <input type="text" placeholder="Opcional" />
        </div>

        <div className="form-group">
          <label>Presidente</label>
          <input type="text" placeholder="Nombre del presidente" />
        </div>

        <div className="form-group">
          <label>Secretario</label>
          <input type="text" placeholder="Nombre del secretario" />
        </div>

        <div className="form-group">
          <label>Tesorero</label>
          <input type="text" placeholder="Nombre del tesorero" />
        </div>

        <div className="form-group">
          <label>Adjuntar Documentos</label>
          <input type="file" />
        </div>

        <button type="submit" className="primary-button">
          Registrar JAC
        </button>
      </form>
    </div>
  );
}

export default RegistrarJAC;
