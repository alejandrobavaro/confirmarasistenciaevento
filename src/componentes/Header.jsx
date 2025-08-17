import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Modal, Button, Form } from "react-bootstrap";
import { BsListCheck, BsClipboardCheck } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navLinks = [
    { 
      path: "/confirmar/buscar", 
      icon: <BsClipboardCheck />, 
      label: "Confirmar Asistencia",
      shortLabel: "Confirmar Asistencia",
      tooltip: "Confirma tu asistencia a nuestra boda antes del 15 de Octubre",
      isConfirm: true
    },
    { 
      path: "/confirmados", 
      icon: <BsListCheck />, 
      label: "Lista de Confirmados",
      shortLabel: "Lista de Confirmados",
      tooltip: "Ver quiénes han confirmado asistencia a nuestra boda",
      requiresPassword: true
    }
  ];

  const goToPage = (path, requiresPassword = false) => {
    if (requiresPassword) {
      setShowPasswordModal(true);
    } else {
      navigate(path);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "boda") {
      setShowPasswordModal(false);
      setPassword("");
      setError("");
      navigate("/confirmados");
    } else {
      setError("Contraseña incorrecta. Intenta nuevamente.");
    }
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
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(link.path, link.requiresPassword);
                }}
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

      {/* Modal de contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acceso a Lista de Confirmados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group controlId="formPassword">
              <Form.Label>Ingresa la contraseña:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePasswordSubmit}
            className="password-submit-btn"
          >
            Ingresar
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;