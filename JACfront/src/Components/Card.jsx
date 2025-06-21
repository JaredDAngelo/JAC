import "../assets/styles/Card.css";

function Card({ 
  title, 
  image, 
  description, 
  location, 
  creationDate, 
  president,
  membersCount,
  projectsCount,
  level 
}) {
  return (
    <div className="jac-card">
      <div className="jac-card-header">
        <img src={image || "/default-jac-image.jpg"} 
             alt={`Junta de Acción Comunal ${title}`} 
             className="jac-card-img" />
        <div className="jac-card-level">{level || "Local"}</div>
      </div>
      
      <div className="jac-card-body">
        <h3 className="jac-card-title">{title}</h3>
        <span className="jac-card-location">{location}</span>
        
        <p className="jac-card-description">{description}</p>
        
        <div className="jac-card-stats">
          <div className="jac-stat">
            <span className="jac-stat-label">Constitución</span>
            <span className="jac-stat-value">{creationDate}</span>
          </div>
          <div className="jac-stat">
            <span className="jac-stat-label">Presidente</span>
            <span className="jac-stat-value">{president}</span>
          </div>
          <div className="jac-stat">
            <span className="jac-stat-label">Miembros</span>
            <span className="jac-stat-value">{membersCount}</span>
          </div>
          <div className="jac-stat">
            <span className="jac-stat-label">Proyectos</span>
            <span className="jac-stat-value">{projectsCount}</span>
          </div>
        </div>
        
        <div className="jac-card-projects">
          <h4>Proyectos destacados:</h4>
          <ul>
            <li>Fortalecimiento de planeación estratégica</li>
            <li>Registro Censo Nacional</li>
            <li>Formación de Formadores</li>
          </ul>
        </div>
      </div>
      
      <div className="jac-card-footer">
        <button className="jac-card-btn jac-card-btn-primary">Ver detalles</button>
        <button className="jac-card-btn jac-card-btn-secondary">Documentación</button>
      </div>
    </div>
  );
}

export default Card;
