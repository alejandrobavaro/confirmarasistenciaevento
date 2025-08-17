// ==============================================
// IMPORTS NECESARIOS
// ==============================================
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";
import { BsListCheck, BsPeople, BsClipboardCheck } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

// ==============================================
// COMPONENTE HEADER - CON BOTÓN DE CONFIRMAR ASISTENCIA
// ==============================================
const Header = () => {
  // Hook para navegación programática
  const navigate = useNavigate();

  // ============================================
  // FUNCIONES DE NAVEGACIÓN
  // ============================================
  const goToPage = (path) => {
    navigate(path);import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { BsListCheck, BsPeople, BsClipboardCheck } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Definición de los enlaces de navegación con tooltips
  const navLinks = [
    { 
      path: "/confirmar/buscar", 
      icon: <BsClipboardCheck />, 
      label: "Confirmar Asistencia",
      shortLabel: "Confirmar",
      tooltip: "Confirma tu asistencia a nuestra boda antes del 15 de Octubre",
      isConfirm: true
    },
    { 
      path: "/confirmados", 
      icon: <BsListCheck />, 
      label: "Lista de Confirmados",
      shortLabel: "Confirmados",
      tooltip: "Ver quiénes han confirmado asistencia a nuestra boda"
    }
  ];

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <header className="app-header">
      {/* Decoración superior */}
      <div className="header-decoration-top"></div>

      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
              loading="lazy"
            />
          </Navbar.Brand>

          {/* Botones de navegación */}
          <Nav className="quick-access-buttons">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                onClick={() => goToPage(link.path)}
                className={`nav-button ${location.pathname === link.path ? "active" : ""} ${
                  link.isConfirm ? "confirm-button" : ""
                }`}
                title={link.tooltip}
                data-label={link.label}
              >
                <span className="icon">{link.icon}</span>
                <span className="nav-label">
                  {window.innerWidth < 768 ? link.label : link.shortLabel}
                </span>
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>

      {/* Decoración inferior */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;
  };

  // ============================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================
  return (
    <header className="app-header">
      {/* Decoración superior - Elemento puramente visual */}
      <div className="header-decoration-top"></div>

      {/* Contenedor principal del header */}
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          {/* Logo que lleva al inicio */}
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="/img/02-logos/logo-bodaaleyfabi1d.png"
              alt="Logo Boda Ale y Fabi"
              className="logo-image"
              loading="lazy" // Mejora performance
            />
          </Navbar.Brand>

          {/* Grupo de botones de acceso rápido */}
          <div className="quick-access-buttons">
            {/* Botón 2: Confirmar Asistencia */}
            <Button
              variant="link"
              onClick={() => goToPage("/confirmar/buscar")}
              className="nav-button confirm-button" // Clase adicional
              title="Confirmar asistencia"
              aria-label="Confirmar asistencia"
            >
              <BsClipboardCheck className="icon" />
              <span className="button-text">Confirmar</span> {/* Clase modificada */}
            </Button>

            {/* Botón 3: Lista Confirmados */}
            <Button
              variant="link"
              onClick={() => goToPage("/confirmados")}
              className="nav-button"
              title="Ver confirmados"
              aria-label="Ver lista de confirmados"
            >
              <BsListCheck className="icon" />
              <span className="button-text">Confirmados</span> {/* Clase modificada */}
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Decoración inferior - Elemento puramente visual */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;