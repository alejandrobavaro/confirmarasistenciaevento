import React from "react";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Footer.scss";
import { BsInstagram } from "react-icons/bs";

function Footer() {
  // Función para scroll suave al top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      {/* Contenido principal del Footer */}
      <div className="footer-content">
        {/* Logo decorativo izquierdo */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Decoración floral izquierda" 
            className="footer-logo"
            loading="lazy" // Optimización de carga
          />
        </div>
        
        {/* Sección central con redes y contacto */}
        <div className="social-links-container">
          <div className="hashtag-section">
            <div className="couple-instagram-links">
              {/* Enlace Instagram novia */}
              {/* <a 
                href="https://www.instagram.com/fabiolalutrario/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-link"
                aria-label="Instagram de Fabiola"
              >
                <BsInstagram className="instagram-icon" /> 
                <span className="instagram-handle">Fabi</span>
              </a> */}
              
              {/* Botón de contacto */}
              <div className="contact-btn-container">
                <Link 
                  to="/contacto" 
                  className="contact-btn"
                  onClick={scrollToTop}
                  aria-label="Ir a página de contacto"
                >
                  CONTACTO
                </Link>
              </div>
              
              {/* Enlace Instagram novio */}
              {/* <a 
                href="https://www.instagram.com/alegondramusic/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-link"
                aria-label="Instagram de Alejandro"
              >
                <BsInstagram className="instagram-icon" /> 
                <span className="instagram-handle">Ale</span>
              </a> */}
            </div>
          </div>
        </div>

        {/* Logo decorativo derecho */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Decoración floral derecha" 
            className="footer-logo"
            loading="lazy" // Optimización de carga
          />
        </div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className="baroque-line-bottom"></div>
      
      {/* Créditos / Copyright */}
      <div className="copyright-container">
        <div className="copyright-content">
          <a 
            href="https://alejandrobavaro.github.io/gondraworld-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Sitio web del desarrollador"
          >
            <span className="copyright-icon">✧</span>
            <span className="copyright-text">Gondra World Dev</span>
            <span className="copyright-icon">✧</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;