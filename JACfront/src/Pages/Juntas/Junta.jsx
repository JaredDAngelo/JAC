import { useNavigate } from "react-router-dom";
import "../../assets/styles/junta.css";



function Juntas() {
  const navigate = useNavigate();

  return (
    <div className="juntas">
      

      <h1>Gestión de Juntas de Acción Comunal</h1>
      <p className="juntas-subtitle">
        Registra nuevas juntas y gestiona la información de las ya existentes.
      </p>

      <div className="juntas-actions">
        <button className="primary-button" onClick={() => navigate("/juntas/registrar")}>
          Registrar Nueva JAC
        </button>
        <input
          type="text"
          placeholder="Buscar JAC..."
          className="search-input"
        />
      </div>

      <div className="juntas-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Presidente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Junta Barrio El Carmen</td>
              <td>Calle 123 #45-67</td>
              <td>Juan Pérez</td>
              <td>
                <button className="btn-secondary">Ver</button>
                <button className="btn-secondary">Editar</button>
              </td>
            </tr>
            <tr>
              <td>Junta Barrio San Martín</td>
              <td>Carrera 45 #12-34</td>
              <td>María Gómez</td>
              <td>
                <button className="btn-secondary">Ver</button>
                <button className="btn-secondary">Editar</button>
              </td>
            </tr>
            {/* Aquí irán más registros dinámicos */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Juntas;
