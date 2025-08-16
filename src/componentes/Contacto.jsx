import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_Contacto.scss";

const Contacto = () => {
  // Configuración del slider optimizada para móviles
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
    pauseOnHover: true,
    adaptiveHeight: true // Mejor adaptación a diferentes alturas de imágenes
  };

  // Fotos de los novios con texto alternativo descriptivo
  const couplePhotos = [
    {
      src: "/img/03-img-banners/banner1.png",
      alt: "Alejandro y Fabiola en un momento romántico"
    },
    {
      src: "/img/03-img-banners/banner2.png",
      alt: "Los novios sonriendo en un día soleado"
    },
    {
      src: "/img/03-img-banners/banner3.png",
      alt: "Alejandro y Fabiola en una pose elegante"
    },
    {
      src: "/img/03-img-banners/banner4.png",
      alt: "Foto de compromiso de los novios"
    },
    {
      src: "/img/03-img-banners/banner5.png",
      alt: "Alejandro y Fabiola abrazados"
    }
  ];

  return (
    <div className="contacto-container">
      {/* Sección de contacto con logo y redes sociales */}
      <section className="contact-logo-section" aria-labelledby="redes-title">
        <div className="unified-contact-container">
          <div className="unified-logo-social">
            <div className="unified-logo">
              <img
                src="/img/02-logos/logo-bodaaleyfabi1d.png"
                alt="Logo de la boda de Alejandro y Fabiola"
                className="unified-logo-img"
                loading="lazy"
                width="180"
                height="180"
              />
            </div>
            <div className="unified-social">
              <div className="hashtag-container">
                <h3 id="redes-title" className="hashtag-title">#bodaaleyfabi</h3>
                <p className="hashtag-subtitle">Etiquétanos en tus fotos y videos</p>
              </div>
              <div className="couple-social-links">
                <a
                  href="https://www.instagram.com/fabiolalutrario/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram de Fabiola"
                >
                  @fabiolalutrario
                </a>
                <a
                  href="https://www.instagram.com/alegondramusic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram de Alejandro"
                >
                  @alegondramusic
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de formulario de contacto */}
      <section className="compact-contact-section" aria-labelledby="form-title">
        <div className="compact-form-container">
          <h2 id="form-title" className="compact-form-title">Escríbenos</h2>

          <form
            className="compact-contact-form"
            action="https://formspree.io/f/xbjnlgzz"
            target="_blank"
            method="post"
          >
            <div className="compact-form-group">
              <label htmlFor="nombre" className="sr-only">Tu nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                required
                className="compact-input"
                aria-required="true"
              />
            </div>

            <div className="compact-form-group">
              <label htmlFor="email" className="sr-only">Tu correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
                className="compact-input"
                aria-required="true"
              />
            </div>

            <div className="compact-form-group">
              <label htmlFor="mensaje" className="sr-only">Tu mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={3}
                placeholder="Tu mensaje para nosotros..."
                required
                className="compact-textarea"
                aria-required="true"
              />
            </div>

            <button type="submit" className="compact-submit-btn" aria-label="Enviar mensaje">
              Enviar
            </button>
          </form>

          {/* Slider de fotos con mejor semántica */}
          <div className="couple-slider-container" aria-label="Galería de fotos de los novios">
            <Slider {...sliderSettings} className="couple-slider">
              {couplePhotos.map((photo, index) => (
                <div key={index} className="slider-item">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="couple-photo"
                    loading="lazy"
                    width="400"
                    height="300"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;