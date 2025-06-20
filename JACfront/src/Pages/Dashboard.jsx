import "../assets/styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Bienvenido al Panel de Control</h1>
      <p className="dashboard-subtitle">Aquí encontrarás un resumen de la información clave de tu Junta de Acción Comunal.</p>

      <div className="dashboard-widgets">
        <div className="widget">
          <h2>Juntas Registradas</h2>
          <p>12</p>
        </div>
        <div className="widget">
          <h2>Actas Generadas</h2>
          <p>45</p>
        </div>
        <div className="widget">
          <h2>Certificados Emitidos</h2>
          <p>30</p>
        </div>
        <div className="widget">
          <h2>Libros Activos</h2>
          <p>7</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
