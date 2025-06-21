import React from 'react';
import '../assets/styles/footer.css';


function Footer() {
  return (
    <footer className="gov-footer">
      <div className="gov-footer-main">
        <div className="gov-footer-column">
          <img src="/logo.svg" alt="Logo GOV.CO" className="gov-footer-logo" />
          <p>
            Plataforma única del Estado colombiano. Aquí encuentras información oficial y confiable.
          </p>
        </div>

        <div className="gov-footer-column">
          <h4>Enlaces de interés</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>

        <div className="gov-footer-column">
          <h4>Síguenos</h4>
          <div className="gov-footer-social">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter-x"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>

      <div className="gov-footer-bottom">
        © 2025 GOV.CO - Todos los derechos reservados
      </div>
    </footer>
  );
}

export default Footer;
