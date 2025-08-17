import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_Contacto.scss";

const Contacto = () => {
  // Configuración del slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: true
  };

  // Fotos de los novios
  const couplePhotos = [
    "/img/03-img-banners/banner1.png",
    "/img/03-img-banners/banner2.png",
    "/img/03-img-banners/banner3.png",
    "/img/03-img-banners/banner4.png",
    "/img/03-img-banners/banner5.png"
  ];

  return (
    <section className="unified-contact-section">
      {/* Sección superior con logo y redes */}
      {/* <div className="unified-contact-top">
        <div className="unified-logo-container">
          <img
            src="/img/02-logos/logo-bodaaleyfabi1d.png"
            alt="Logo Boda Alejandro y Fabiola"
            className="unified-logo"
          />
        </div>

        <div className="unified-social-container">
          <h3 className="unified-social-title">
            <i className="bi bi-heart-fill" /> Síguenos <i className="bi bi-heart-fill" />
          </h3>
          <div className="unified-social-links">
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bi bi-facebook" />
              <span>Facebook</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bi bi-instagram" />
              <span>Instagram</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bi bi-youtube" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div> */}

      {/* Sección media con slider */}
      {/* <div className="unified-slider-container">
        <Slider {...sliderSettings} className="unified-slider">
          {couplePhotos.map((photo, index) => (
            <div key={index} className="slider-item">
              <img 
                src={photo} 
                alt={`Alejandro y Fabiola ${index + 1}`} 
                className="slider-image"
              />
              <div className="slider-overlay"></div>
            </div>
          ))}
        </Slider>
      </div> */}

      {/* Sección inferior con formulario */}
      <div className="unified-form-container">
        <h2 className="unified-form-title">
          <i className="bi bi-envelope-heart" /> Escríbenos <i className="bi bi-envelope-heart" />
        </h2>
        
        <form
          className="unified-contact-form"
          action="https://formspree.io/f/xbjnlgzz"
          target="_blank"
          method="post"
        >
          <div className="form-group">
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Tu correo electrónico"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <textarea
              id="mensaje"
              name="mensaje"
              rows={3}
              placeholder="Tu mensaje para nosotros..."
              required
              className="form-textarea"
            />
          </div>
          
          <button type="submit" className="form-submit-btn">
            Enviar Mensaje <i className="bi bi-send" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacto;