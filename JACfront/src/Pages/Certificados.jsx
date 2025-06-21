import "../assets/styles/certificados.css";

function Certificados() {
  return (
    <div className="certificados">
      <h1>Gestión de Certificados</h1>
      <p className="certificados-subtitle">
        Solicita o administra certificados de tu Junta de Acción Comunal.
      </p>

      <div className="certificados-actions">
        <button className="btn-primary">Solicitar Certificado</button>
      </div>

      <div className="certificados-list">
        <div className="certificado-card">
          <h2>Certificado de Existencia</h2>
          <p>Documento que certifica la existencia legal de la JAC.</p>
        </div>
        <div className="certificado-card">
          <h2>Certificado de Afiliación</h2>
          <p>Aval de pertenencia de un miembro a la JAC.</p>
        </div>
        <div className="certificado-card">
          <h2>Certificado de Residencia</h2>
          <p>Prueba de residencia para trámites comunitarios.</p>
        </div>
      </div>
    </div>
  );
}

export default Certificados;
