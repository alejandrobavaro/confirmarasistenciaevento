/**
 * COMPONENTE PRINCIPAL DE CONFIRMACIÓN DE ASISTENCIA
 * 
 * Propósito: Manejar el proceso de confirmación de asistencia a la boda
 * 
 * Flujo principal:
 * 1. Verificación de invitados contra lista JSON
 * 2. Registro de confirmación/negación
 * 3. Gestión de invitados adicionales
 * 4. Comunicación con WhatsApp para casos especiales
 * 5. Actualización en tiempo real de la lista de confirmados
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsappIcon from './WhatsappIcon';
import Confetti from 'react-confetti';
import '../assets/scss/_03-Componentes/_PaginaDeConfirmacionInvitado.scss';

// ==============================================
// SECCIÓN DE DATOS ESTÁTICOS DEL EVENTO
// ==============================================
// Estos datos se muestran al confirmar asistencia
// No modificar estructura, solo contenido si es necesario
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
  // ==============================================
  // SECCIÓN DE ESTADOS DEL COMPONENTE
  // ==============================================
  // Cada estado controla una parte específica de la UI
  
  // Estado para el nombre ingresado por el usuario
  const [nombre, setNombre] = useState('');
  
  // Estado para almacenar invitados adicionales agregados
  const [invitadosAdicionales, setInvitadosAdicionales] = useState([]);
  
  // Estado temporal para el nombre de nuevo invitado
  const [nuevoInvitado, setNuevoInvitado] = useState('');
  
  // Estado para controlar si asiste (true) o no (false)
  const [asistencia, setAsistencia] = useState(true);
  
  // Estado para el motivo si no asiste
  const [razon, setRazon] = useState('');
  
  // Estado para mensajes de error
  const [error, setError] = useState('');
  
  // Estado para mensajes de éxito
  const [success, setSuccess] = useState('');
  
  // Estado con los datos del invitado si se encuentra en el JSON
  const [invitadoEncontrado, setInvitadoEncontrado] = useState(null);
  
  // Estado para mostrar/ocultar opción de WhatsApp
  const [mostrarWhatsapp, setMostrarWhatsapp] = useState(false);
  
  // Estado para controlar visibilidad de sección invitados adicionales
  const [mostrarAgregarInvitado, setMostrarAgregarInvitado] = useState(false);
  
  // Estado para sugerencias de nombres similares
  const [sugerencias, setSugerencias] = useState([]);
  
  // Estado para mostrar/ocultar sugerencias
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  // Estado para controlar animación de confetti
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Estado para dimensiones de la ventana (para confetti)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Hook de navegación para redirecciones
  const navigate = useNavigate();

  // ==============================================
  // EFECTOS SECUNDARIOS
  // ==============================================

  // Efecto para manejar redimensionamiento de ventana
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

  // Efecto para controlar animación de confetti
  useEffect(() => {
    if (asistencia && success) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [asistencia, success]);

  // ==============================================
  // FUNCIONES PRINCIPALES
  // ==============================================

  /**
   * FUNCIÓN: verificarInvitado
   * Propósito: Buscar el nombre ingresado en la lista de invitados (invitados.json)
   * Comunicación: Hace fetch a invitados.json
   * Estados que modifica:
   * - invitadoEncontrado: si encuentra coincidencia exacta
   * - sugerencias: si no encuentra coincidencia exacta pero hay nombres similares
   * - error: mensajes de error
   * - mostrarWhatsapp: si no se encuentra el nombre
   */
  const verificarInvitado = () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    fetch('/invitados.json')
      .then(response => response.json())
      .then(data => {
        const todosInvitados = data.grupos.flatMap(grupo => grupo.invitados);
        const invitado = todosInvitados.find(
          inv => inv.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (invitado) {
          setInvitadoEncontrado(invitado);
          setError('');
          setMostrarWhatsapp(false);
          setSugerencias([]);
        } else {
          // Buscar sugerencias de nombres similares
          const sugerencias = todosInvitados
            .filter(inv => 
              inv.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
              nombre.toLowerCase().includes(inv.nombre.split(' ')[0].toLowerCase())
            )
            .slice(0, 3);
          
          setSugerencias(sugerencias);
          setInvitadoEncontrado(null);
          setMostrarWhatsapp(true);
          setError(sugerencias.length > 0 
            ? 'Nombre no encontrado en la lista. ¿Quisiste decir alguno de estos?' 
            : 'Nombre no encontrado. Si crees que es un error, contáctanos.');
        }
      })
      .catch(err => {
        console.error("Error al cargar invitados:", err);
        setError('Error al verificar invitación');
      });
  };

  /**
   * FUNCIÓN: agregarInvitado
   * Propósito: Agregar un nuevo invitado a la lista de adicionales
   * Validaciones:
   * - Nombre no vacío
   * - No duplicados
   * Estados que modifica:
   * - invitadosAdicionales: agrega el nuevo nombre
   * - nuevoInvitado: limpia el input
   */
  const agregarInvitado = () => {
    if (nuevoInvitado.trim() && !invitadosAdicionales.includes(nuevoInvitado)) {
      setInvitadosAdicionales([...invitadosAdicionales, nuevoInvitado]);
      setNuevoInvitado('');
    }
  };

  /**
   * FUNCIÓN: eliminarInvitado
   * Propósito: Quitar un invitado de la lista de adicionales
   * Estados que modifica:
   * - invitadosAdicionales: filtra el array por índice
   */
  const eliminarInvitado = (index) => {
    const nuevosInvitados = [...invitadosAdicionales];
    nuevosInvitados.splice(index, 1);
    setInvitadosAdicionales(nuevosInvitados);
  };

  /**
   * FUNCIÓN: notificarActualizacionConfirmados
   * Propósito: Notificar a la lista de confirmados que hay una nueva confirmación
   * Mecanismo:
   * - Dispara un evento personalizado que el otro componente puede escuchar
   * - Actualiza una marca en localStorage para sincronización entre pestañas
   */
  const notificarActualizacionConfirmados = () => {
    // Evento personalizado para actualización en la misma pestaña
    const event = new CustomEvent('confirmacionActualizada', {
      detail: { nombre }
    });
    window.dispatchEvent(event);
    
    // Marca en localStorage para sincronización entre pestañas
    localStorage.setItem('ultimaActualizacion', Date.now());
  };

  /**
   * FUNCIÓN: handleSubmit
   * Propósito: Manejar el envío del formulario de confirmación
   * Validaciones:
   * - Nombre obligatorio
   * - Motivo obligatorio si no asiste
   * Acciones:
   * - Guarda en localStorage
   * - Notifica la actualización
   * - Muestra mensaje de éxito
   * - Activa animación de confetti si es confirmación positiva
   */
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

    // GUARDADO EN LOCALSTORAGE
    const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
    const nuevaConfirmacion = {
      nombre,
      invitadosAdicionales,
      asistencia,
      razon: !asistencia ? razon : '',
      fecha: new Date().toISOString(),
      datosEvento: asistencia ? datosBoda : null
    };

    confirmaciones[nombre.toLowerCase()] = nuevaConfirmacion;
    localStorage.setItem('confirmaciones', JSON.stringify(confirmaciones));
    
    // NOTIFICAR ACTUALIZACIÓN
    notificarActualizacionConfirmados();

    setSuccess(asistencia ? 
      '¡Gracias por confirmar tu asistencia!' : 
      'Lamentamos que no puedas asistir. ¡Gracias por avisarnos!');
  };

  // ==============================================
  // RENDERIZADO DE VISTAS
  // ==============================================

  // VISTA DE CONFIRMACIÓN EXITOSA - Se muestra después del envío exitoso
  if (success) {
    return (
      <div className="confirmacion-exitosa">
        {/* Animación de confetti solo para confirmaciones positivas */}
        {asistencia && showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        
        {/* Icono triste para confirmaciones negativas */}
        {!asistencia && (
          <div className="sad-animation">
            <span role="img" aria-label="triste">😢</span>
          </div>
        )}
        
        <h1>{asistencia ? '¡Confirmación Exitosa!' : '¡Gracias por avisarnos!'}</h1>
        <p>{success}</p>
        
        <div className="detalles-confirmacion">
          <p><strong>Nombre:</strong> {nombre}</p>
          
          {asistencia && invitadosAdicionales.length > 0 && (
            <div className="lista-invitados">
              <strong>Invitados adicionales:</strong>
              <ul>
                {invitadosAdicionales.map((invitado, index) => (
                  <li key={index}>{invitado}</li>
                ))}
              </ul>
            </div>
          )}

          {asistencia && (
            <div className="detalles-evento">
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

        {/* Botón que redirige a la página principal de la boda */}
        <button 
          onClick={() => window.location.href = "https://noscasamos-aleyfabi.netlify.app/"} 
          className="volver-inicio"
        >
          Volver a la página de la boda
        </button>
      </div>
    );
  }

  // VISTA PRINCIPAL DEL FORMULARIO - Se muestra inicialmente
  return (
    <div className="confirmacion-container">
      <h1>Confirmación de Asistencia</h1>
      <p>Por favor confirma tu asistencia a nuestra boda</p>
      
      <form onSubmit={handleSubmit} className="formulario-confirmacion">
        {error && <div className="error-message">{error}</div>}

        {/* SECCIÓN DE VERIFICACIÓN DE NOMBRE */}
        <div className="form-group">
          <label>Tu Nombre Completo:</label>
          <div className="busqueda-container">
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setMostrarSugerencias(e.target.value.length > 2);
              }}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              onFocus={() => setMostrarSugerencias(nombre.length > 2)}
              placeholder="Ej: Juan Pérez"
            />
            <button 
              type="button" 
              onClick={verificarInvitado}
              className="btn-verificar"
            >
              Verificar
            </button>
          </div>
          
          {/* Mostrar sugerencias si hay nombres similares */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="sugerencias-container">
              <ul>
                {sugerencias.map((invitado, index) => (
                  <li 
                    key={index}
                    onClick={() => {
                      setNombre(invitado.nombre);
                      setMostrarSugerencias(false);
                      verificarInvitado();
                    }}
                  >
                    {invitado.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Mostrar opción de WhatsApp si no se encuentra el nombre */}
          {mostrarWhatsapp && (
            <div className="contacto-whatsapp">
              <p>Si crees que es un error, por favor contáctanos:</p>
              <WhatsappIcon />
            </div>
          )}
        </div>

        {/* FORMULARIO PRINCIPAL (visible solo si se verificó el nombre) */}
        {invitadoEncontrado && (
          <>
            {/* SECCIÓN PARA AGREGAR INVITADOS ADICIONALES (con toggle) */}
            <div className="form-group invitados-adicionales">
              <button 
                type="button" 
                onClick={() => setMostrarAgregarInvitado(!mostrarAgregarInvitado)}
                className="btn-toggle-invitados"
              >
                {mostrarAgregarInvitado ? 'Ocultar' : 'Agregar invitados adicionales'}
              </button>
              
              {mostrarAgregarInvitado && (
                <>
                  <div className="agregar-invitado">
                    <input
                      type="text"
                      value={nuevoInvitado}
                      onChange={(e) => setNuevoInvitado(e.target.value)}
                      placeholder="Nombre completo"
                    />
                    <button 
                      type="button" 
                      onClick={agregarInvitado}
                      className="btn-agregar"
                    >
                      Agregar
                    </button>
                  </div>
                  
                  {invitadosAdicionales.length > 0 && (
                    <div className="lista-invitados">
                      <ul>
                        {invitadosAdicionales.map((invitado, index) => (
                          <li key={index}>
                            {invitado}
                            <button 
                              type="button"
                              onClick={() => eliminarInvitado(index)}
                              className="btn-eliminar"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* RADIO BUTTONS DE CONFIRMACIÓN (mejorados visualmente) */}
            <div className="form-group radio-group">
              <label>¿Asistirás a la boda?</label>
              <div className="radio-options">
                <label className={`radio-option ${asistencia ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="asistencia"
                    checked={asistencia}
                    onChange={() => setAsistencia(true)}
                    className="visually-hidden"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Sí, asistiré</span>
                </label>
                <label className={`radio-option ${!asistencia ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="asistencia"
                    checked={!asistencia}
                    onChange={() => setAsistencia(false)}
                    className="visually-hidden"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">No, no podré asistir</span>
                </label>
              </div>
            </div>

            {/* CAMPO DE TEXTO PARA MOTIVO (solo si no asiste) */}
            {!asistencia && (
              <div className="form-group">
                <label>¿Por qué no podrás asistir?</label>
                <textarea
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  placeholder="Cuéntanos el motivo..."
                />
              </div>
            )}

            {/* BOTÓN DE ENVÍO */}
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