import React from "react";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Footer.scss";
import { BsInstagram } from "react-icons/bs";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <footer className="footer">
      
        
        {/* Contenido principal del Footer */}
        <div className="footer-content">
          {/* Logo decorativo izquierdo */}
          <div className="footer-logo-container">
            <img 
              src="/img/02-logos/logofooter1a.png"
              alt="Logo decorativo" 
              className="footer-logo"
            />
          </div>
          
          {/* Sección de hashtag y redes sociales */}
          <div className="social-links-container">
            <div className="hashtag-section">
             
              <div className="couple-instagram-links">
                <a 
                  href="https://www.instagram.com/fabiolalutrario/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="instagram-link"
                >
                  <BsInstagram className="instagram-icon" /> @fabiolalutrario
                </a>
                  {/* Botón de contacto */}
        <div className="contact-btn-container">
          <Link 
            to="/contacto" 
            className="contact-btn"
            onClick={scrollToTop}
          >
            CONTACTO
          </Link>
        </div>
                <a 
                  href="https://www.instagram.com/alegondramusic/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="instagram-link"
                >
                  <BsInstagram className="instagram-icon" /> @alegondramusic
                </a>
       

              
              </div>
            </div>
          </div>

          {/* Logo decorativo derecho */}
          <div className="footer-logo-container">
            <img 
              src="/img/02-logos/logofooter1a.png"
              alt="Logo decorativo" 
              className="footer-logo"
            />
          </div>
        </div>
        
        {/* Línea barroca animada inferior */}
        <div className="baroque-line-bottom"></div>
        
        {/* Créditos / Copyright */}
        <div className="copyright-container">
          <div className="copyright-content">
            <a 
              href="https://alejandrobavaro.github.io/gondraworld-dev/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span className="copyright-icon">✧</span>
              <span>Gondra World Dev</span>
              <span className="copyright-icon">✧</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;