import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsappIcon from './WhatsappIcon';
import Confetti from 'react-confetti';
import '../assets/scss/_03-Componentes/_PaginaDeConfirmacionInvitado.scss';

// Datos estáticos de la boda
const datosBoda = {
  nombresNovios: 'Boda de Ale y Fabi',
  fecha: 'Sábado, 23 de Noviembre de 2025',
  hora: '19:00 horas',
  lugar: 'Casa del Mar - Villa García Uriburu\nC. Seaglia 5400, Camet, Mar del Plata',
  codigoVestimenta: 'Elegante',
  linkUbicacion: 'https://noscasamos-aleyfabi.netlify.app/ubicacion',
  detallesRegalo: 'Nos viene bien juntar para la Luna de Miel.\nCBU o alias: 00000531313113\naleyfabicasamiento'
};

const PaginaDeConfirmacionInvitado = () => {
  // ----------------------------------------------------------
  // ESTADOS DEL COMPONENTE
  // ----------------------------------------------------------
  const [nombre, setNombre] = useState('');
  const [invitadosAdicionales, setInvitadosAdicionales] = useState([]);
  const [nuevoInvitado, setNuevoInvitado] = useState('');
  const [asistencia, setAsistencia] = useState(true);
  const [razon, setRazon] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitadoEncontrado, setInvitadoEncontrado] = useState(null);
  const [mostrarWhatsapp, setMostrarWhatsapp] = useState(false);
  const [mostrarAgregarInvitado, setMostrarAgregarInvitado] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [todosInvitados, setTodosInvitados] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navigate = useNavigate();

  // ----------------------------------------------------------
  // EFECTOS SECUNDARIOS
  // ----------------------------------------------------------
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const response = await fetch('/invitados.json');
        const data = await response.json();
        setTodosInvitados(data.grupos.flatMap(grupo => grupo.invitados));
      } catch (err) {
        console.error("Error al cargar invitados:", err);
      }
    };
    
    cargarInvitados();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (asistencia && success) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [asistencia, success]);

  // ----------------------------------------------------------
  // FUNCIONES PRINCIPALES
  // ----------------------------------------------------------
  const buscarSugerencias = (texto) => {
    if (!texto.trim()) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const textoMin = texto.toLowerCase();
    const sugerenciasEncontradas = todosInvitados
      .filter(inv => inv.nombre.toLowerCase().includes(textoMin))
      .slice(0, 5);
    
    setSugerencias(sugerenciasEncontradas);
    setMostrarSugerencias(sugerenciasEncontradas.length > 0);
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setNombre(valor);
    buscarSugerencias(valor);
  };

  const verificarInvitado = () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    const invitado = todosInvitados.find(
      inv => inv.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (invitado) {
      setInvitadoEncontrado(invitado);
      setError('');
      setMostrarWhatsapp(false);
      
      const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      const confirmacionExistente = confirmaciones[invitado.id];
      
      if (confirmacionExistente) {
        setAsistencia(confirmacionExistente.asistencia);
        setRazon(confirmacionExistente.razon || '');
        setInvitadosAdicionales(confirmacionExistente.invitadosAdicionales || []);
      }
    } else {
      setInvitadoEncontrado(null);
      setMostrarWhatsapp(true);
      setError(sugerencias.length > 0 
        ? 'Nombre no encontrado. ¿Quisiste decir alguno de estos?' 
        : 'Nombre no encontrado. Si crees que es un error, contáctanos.');
    }
  };

  const seleccionarSugerencia = (nombreSugerido) => {
    setNombre(nombreSugerido);
    setMostrarSugerencias(false);
    verificarInvitado();
  };

  const agregarInvitado = () => {
    if (nuevoInvitado.trim() && !invitadosAdicionales.includes(nuevoInvitado)) {
      setInvitadosAdicionales([...invitadosAdicionales, nuevoInvitado]);
      setNuevoInvitado('');
    }
  };

  const eliminarInvitado = (index) => {
    setInvitadosAdicionales(invitadosAdicionales.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!invitadoEncontrado && !mostrarWhatsapp) {
      setError('Por favor verifica tu nombre primero');
      return;
    }

    if (!asistencia && !razon.trim()) {
      setError('Por favor indica el motivo por el que no podrás asistir');
      return;
    }

    const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
    const nuevaConfirmacion = {
      ...confirmaciones,
      [invitadoEncontrado.id]: {
        nombre,
        asistencia,
        invitadosAdicionales,
        razon: !asistencia ? razon : '',
        fecha: new Date().toISOString(),
        datosEvento: asistencia ? datosBoda : null
      }
    };

    localStorage.setItem('confirmaciones', JSON.stringify(nuevaConfirmacion));
    
    const event = new CustomEvent('confirmacionActualizada', {
      detail: { id: invitadoEncontrado.id, nombre, asistencia }
    });
    window.dispatchEvent(event);

    setSuccess(asistencia ? 
      '¡Gracias por confirmar tu asistencia!' : 
      'Lamentamos que no puedas asistir. ¡Gracias por avisarnos!');
  };

  // ----------------------------------------------------------
  // RENDERIZADO CONDICIONAL (Confirmación exitosa)
  // ----------------------------------------------------------
  if (success) {
    return (
      <div className="confirmacion-exitosa">
        {asistencia && showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        
        {!asistencia && (
          <div className="sad-animation">
            <span role="img" aria-label="triste">😢</span>
          </div>
        )}
        
        <div className="confirmacion-content">
          <h1>{asistencia ? '¡Confirmación Exitosa!' : '¡Gracias por avisarnos!'}</h1>
          <p className="confirmacion-message">{success}</p>
          
          <div className="confirmacion-details">
            <p><strong>Nombre:</strong> {nombre}</p>
            
            {asistencia && invitadosAdicionales.length > 0 && (
              <div className="additional-guests">
                <strong>Invitados adicionales:</strong>
                <ul>
                  {invitadosAdicionales.map((invitado, index) => (
                    <li key={index}>{invitado}</li>
                  ))}
                </ul>
              </div>
            )}

            {asistencia && (
              <div className="event-details">
                <h3>Detalles del Evento</h3>
                <p><strong>Fecha:</strong> {datosBoda.fecha}</p>
                <p><strong>Hora:</strong> {datosBoda.hora}</p>
                <p><strong>Lugar:</strong> {datosBoda.lugar}</p>
                <p><strong>Código de vestimenta:</strong> {datosBoda.codigoVestimenta}</p>
                <p><strong>Regalos:</strong> {datosBoda.detallesRegalo}</p>
              </div>
            )}

            {!asistencia && <p><strong>Motivo:</strong> {razon}</p>}
          </div>

          <button 
            onClick={() => window.location.href = "https://noscasamos-aleyfabi.netlify.app/"} 
            className="return-button"
          >
            Volver a la página de la boda
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDERIZADO PRINCIPAL (Formulario)
  // ----------------------------------------------------------
  return (
    <div className="confirmacion-container">
      <div className="confirmacion-header">
        <h1>Confirma tu Asistencia</h1>
             </div>
      <p className="confirmacion-subtitle">Paso 1. Escribe Tu Nombre Completo</p>
      <form onSubmit={handleSubmit} className="confirmacion-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
        <label htmlFor="nombre-input" className="form-label"> 2. Luego dale click en Verificar:</label>
          <div className="name-search-container">
            <input
              id="nombre-input"
              type="text"
              value={nombre}
              onChange={handleNombreChange}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              onFocus={() => nombre.length > 0 && setMostrarSugerencias(true)}
              placeholder="Ej: Juan Pérez"
              className="name-input"
              autoComplete="off"
              aria-describedby="nombre-help"
            />
            <button 
              type="button" 
              onClick={verificarInvitado}
              className="verify-button"
              aria-label="Verificar nombre"
            >
              Verificar
            </button>
          </div>
       
          
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="suggestions-container">
              <ul role="listbox">
                {sugerencias.map((invitado, index) => (
                  <li 
                    key={index}
                    role="option"
                    className="suggestion-item"
                    onClick={() => seleccionarSugerencia(invitado.nombre)}
                  >
                    {invitado.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {mostrarWhatsapp && (
            <div className="whatsapp-contact">
              <p>Si crees que es un error, por favor contáctanos:</p>
              <WhatsappIcon />
            </div>
          )}
        </div>

        {invitadoEncontrado && (
          <>
            <div className="form-group">
              <button 
                type="button" 
                onClick={() => setMostrarAgregarInvitado(!mostrarAgregarInvitado)}
                className="toggle-guests-button"
                aria-expanded={mostrarAgregarInvitado}
              >
                {mostrarAgregarInvitado ? 'Ocultar' : 'Agregar invitados adicionales'}
              </button>
              
              {mostrarAgregarInvitado && (
                <>
                  <div className="add-guest-form">
                    <input
                      type="text"
                      value={nuevoInvitado}
                      onChange={(e) => setNuevoInvitado(e.target.value)}
                      placeholder={`Nombre completo (máx. ${invitadoEncontrado.acompanantes})`}
                      disabled={invitadosAdicionales.length >= invitadoEncontrado.acompanantes}
                      className="guest-input"
                      aria-label="Nombre del invitado adicional"
                    />
                    <button 
                      type="button" 
                      onClick={agregarInvitado}
                      className="add-guest-button"
                      disabled={invitadosAdicionales.length >= invitadoEncontrado.acompanantes}
                    >
                      Agregar
                    </button>
                  </div>
                  
                  {invitadosAdicionales.length > 0 && (
                    <div className="guests-list">
                      <ul>
                        {invitadosAdicionales.map((invitado, index) => (
                          <li key={index} className="guest-item">
                            {invitado}
                            <button 
                              type="button"
                              onClick={() => eliminarInvitado(index)}
                              className="remove-guest-button"
                              aria-label={`Eliminar ${invitado}`}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {invitadosAdicionales.length >= invitadoEncontrado.acompanantes && (
                    <p className="guest-limit-message">
                      Has alcanzado el máximo de acompañantes permitidos
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="form-group attendance-buttons">
              <fieldset>
                <legend className="form-label">¿Asistirás a la boda?</legend>
                <div className="button-options">
                  <button
                    type="button"
                    className={`attendance-button ${asistencia ? 'selected' : ''}`}
                    onClick={() => setAsistencia(true)}
                    aria-pressed={asistencia}
                  >
                    Sí, asistiré
                  </button>
                  <button
                    type="button"
                    className={`attendance-button ${!asistencia ? 'selected' : ''}`}
                    onClick={() => setAsistencia(false)}
                    aria-pressed={!asistencia}
                  >
                    No, no podré asistir...
                  </button>
                </div>
              </fieldset>
            </div>

            {!asistencia && (
              <div className="form-group">
                <label htmlFor="razon-textarea" className="form-label">¿Por qué no podrás asistir?</label>
                <textarea
                  id="razon-textarea"
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  placeholder="Cuéntanos el motivo..."
                  className="reason-textarea"
                  aria-required={!asistencia}
                />
              </div>
            )}

            <button type="submit" className="submit-button">
              Enviar Confirmación
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default PaginaDeConfirmacionInvitado;