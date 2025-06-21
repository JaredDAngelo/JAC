import "../assets/styles/actas.css";

function Actas() {
  return (
    <div className="actas">
      <h1>Gestión de Actas</h1>
      <p className="actas-subtitle">
        Crea, consulta y administra las actas de reuniones de tu Junta de Acción Comunal.
      </p>

      <div className="actas-actions">
        <button className="btn-primary">Crear Nueva Acta</button>
      </div>

      <div className="actas-list">
        <div className="acta-card">
          <h2>Acta de Reunión Ordinaria</h2>
          <p>Registro de la última reunión ordinaria realizada.</p>
        </div>
        <div className="acta-card">
          <h2>Acta de Asamblea Extraordinaria</h2>
          <p>Registro detallado de una asamblea extraordinaria.</p>
        </div>
        <div className="acta-card">
          <h2>Acta de Comité Financiero</h2>
          <p>Detalles sobre la gestión financiera de la JAC.</p>
        </div>
      </div>
    </div>
  );
}

export default Actas;
