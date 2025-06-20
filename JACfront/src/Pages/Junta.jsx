import "../assets/styles/junta.css";
import { useState } from "react";

function Junta() {
  const [formData, setFormData] = useState({
    nombreJunta: "",
    municipio: "",
    NumeroJuridica: "",
    GuiaEstatutos: "",
    InteresesAsociativos: "",
    AsambleaConstitucion: "",
    ActaConstitucion: "",
    ActaDestinatario: "",
    DatosDirectivos: "",
    Libros: "",
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("Formulario enviado con éxito.");
  };

  return (
    <main className="junta-container">
      <h2>Registro de Junta de Acción Comunal</h2>
      <div className="junta-content">
        
        <div className="junta-image">
          <img src="../public/junta-comunal.webp" alt="Imagen alusiva" />
        </div>

        <form onSubmit={handleSubmit} className="junta-form">
          <label>
            Nombre de la Junta:
            <input
              type="text"
              name="nombreJunta"
              value={formData.nombreJunta}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Municipio:
            <input
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Número de Personalidad Jurídica:
            <input
              type="text"
              name="NumeroJuridica"
              value={formData.NumeroJuridica}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Guía de Estatutos:
            <input
              type="text"
              name="GuiaEstatutos"
              value={formData.GuiaEstatutos}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Intereses Asociativos:
            <input
              type="text"
              name="InteresesAsociativos"
              value={formData.InteresesAsociativos}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Asamblea de Constitución:
            <textarea
              name="AsambleaConstitucion"
              value={formData.AsambleaConstitucion}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </label>

          <label>
            Acta de Constitución:
            <input
              type="text"
              name="ActaConstitucion"
              value={formData.ActaConstitucion}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Acta de Destinatario:
            <input
              type="text"
              name="ActaDestinatario"
              value={formData.ActaDestinatario}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Datos de los Directivos:
            <input
              type="text"
              name="DatosDirectivos"
              value={formData.DatosDirectivos}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Libros:
            <input
              type="text"
              name="Libros"
              value={formData.Libros}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Registrar Junta</button>
        </form>
      </div>
    </main>
  );
}

export default Junta;
