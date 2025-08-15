// Importaciones de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsappIcon from './WhatsappIcon';
import Confetti from 'react-confetti';
import '../assets/scss/_03-Componentes/_PaginaDeConfirmacionInvitado.scss';

// Datos estáticos de la boda que se mostrarán al confirmar
const datosBoda = {
  nombresNovios: 'Boda de Ale y Fabi',
  fecha: 'Sábado, 23 de Noviembre de 2025',
  hora: '19:00 horas',
  lugar: 'Casa del Mar - Villa García Uriburu\nC. Seaglia 5400, Camet, Mar del Plata',
  codigoVestimenta: 'Elegante',
  linkUbicacion: 'https://noscasamos-aleyfabi.netlify.app/ubicacion',
  detallesRegalo: 'Nos viene bien juntar para la Luna de Miel.\nCBU o alias: 00000531313113\naleyfabicasamiento'
};

// Componente principal de confirmación
const PaginaDeConfirmacionInvitado = () => {
  // ----------------------------------------------------------
  // SECCIÓN 1: ESTADOS DEL COMPONENTE
  // ----------------------------------------------------------
  
  // [1.1] Estados para el manejo del nombre y acompañantes
  const [nombre, setNombre] = useState(''); // Almacena el nombre ingresado
  const [invitadosAdicionales, setInvitadosAdicionales] = useState([]); // Lista de acompañantes
  const [nuevoInvitado, setNuevoInvitado] = useState(''); // Input temporal para nuevo acompañante

  // [1.2] Estados para la confirmación de asistencia
  const [asistencia, setAsistencia] = useState(true); // Radio button seleccionado
  const [razon, setRazon] = useState(''); // Motivo si no asiste
  const [error, setError] = useState(''); // Mensajes de error al usuario
  const [success, setSuccess] = useState(''); // Mensaje de confirmación exitosa

  // [1.3] Estados para la búsqueda y validación
  const [invitadoEncontrado, setInvitadoEncontrado] = useState(null); // Datos del invitado encontrado
  const [mostrarWhatsapp, setMostrarWhatsapp] = useState(false); // Mostrar opción de contacto
  const [mostrarAgregarInvitado, setMostrarAgregarInvitado] = useState(false); // Mostrar sección acompañantes

  // [1.4] Estados para sugerencias de nombres
  const [sugerencias, setSugerencias] = useState([]); // Lista de nombres sugeridos
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false); // Mostrar/ocultar sugerencias
  const [todosInvitados, setTodosInvitados] = useState([]); // Todos los invitados cargados del JSON

  // [1.5] Estados para efectos visuales
  const [showConfetti, setShowConfetti] = useState(false); // Controla animación de confeti
  const [windowSize, setWindowSize] = useState({ // Tamaño de ventana para el confeti
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Hook para navegación entre páginas
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // SECCIÓN 2: EFECTOS SECUNDARIOS (useEffect)
  // ----------------------------------------------------------

  // [2.1] Efecto para cargar la lista de invitados al inicio
  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        // Hacer petición al archivo JSON
        const response = await fetch('/invitados.json');
        const data = await response.json();
        
        // Convertir la estructura anidada en un array plano
        const invitados = data.grupos.flatMap(grupo => grupo.invitados);
        
        // Guardar en el estado
        setTodosInvitados(invitados);
      } catch (err) {
        console.error("Error al cargar invitados:", err);
      }
    };
    
    cargarInvitados();
  }, []);

  // [2.2] Efecto para manejar cambios en el tamaño de la ventana
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

  // [2.3] Efecto para mostrar confeti al confirmar
  useEffect(() => {
    if (asistencia && success) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // 5 segundos de visualización
      return () => clearTimeout(timer);
    }
  }, [asistencia, success]);

  // ----------------------------------------------------------
  // SECCIÓN 3: FUNCIONES PRINCIPALES
  // ----------------------------------------------------------

  // [3.1] Función para buscar coincidencias de nombres
  const buscarSugerencias = (texto) => {
    if (texto.length === 0) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const textoMin = texto.toLowerCase();
    
    // Filtrar invitados según coincidencias
    const sugerenciasEncontradas = todosInvitados.filter(inv => {
      const nombreMin = inv.nombre.toLowerCase();
      return (
        nombreMin.includes(textoMin) || // Coincidencia en cualquier parte
        nombreMin.startsWith(textoMin) || // Coincidencia al inicio
        nombreMin.split(' ').some(palabra => palabra.startsWith(textoMin)) // Coincidencia en palabras
      );
    }).slice(0, 5); // Limitar a 5 resultados
    
    setSugerencias(sugerenciasEncontradas);
    setMostrarSugerencias(sugerenciasEncontradas.length > 0);
  };

  // [3.2] Manejador de cambio en el input de nombre
  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setNombre(valor);
    buscarSugerencias(valor); // Buscar sugerencias en tiempo real
  };

  // [3.3] Función para verificar si el invitado existe
  const verificarInvitado = () => {
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    // Buscar coincidencia exacta (insensible a mayúsculas)
    const invitado = todosInvitados.find(
      inv => inv.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (invitado) {
      // Si se encuentra el invitado:
      setInvitadoEncontrado(invitado);
      setError('');
      setMostrarWhatsapp(false);
      setSugerencias([]);
      setMostrarSugerencias(false);
      
      // Verificar si ya había confirmado antes - CORRECCIÓN APLICADA AQUÍ
      const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      const confirmacionExistente = confirmaciones[invitado.id];
      
      if (confirmacionExistente) {
        // Cargar datos de confirmación previa
        setAsistencia(confirmacionExistente.asistencia);
        setRazon(confirmacionExistente.razon || '');
        setInvitadosAdicionales(confirmacionExistente.invitadosAdicionales || []);
      }
    } else {
      // Si NO se encuentra el invitado:
      setInvitadoEncontrado(null);
      setMostrarWhatsapp(true);
      setError(sugerencias.length > 0 
        ? 'Nombre no encontrado. ¿Quisiste decir alguno de estos?' 
        : 'Nombre no encontrado. Si crees que es un error, contáctanos.');
    }
  };

  // [3.4] Seleccionar una sugerencia de la lista
  const seleccionarSugerencia = (nombreSugerido) => {
    setNombre(nombreSugerido);
    setMostrarSugerencias(false);
    verificarInvitado(); // Verificar automáticamente
  };

  // [3.5] Agregar un acompañante a la lista
  const agregarInvitado = () => {
    if (nuevoInvitado.trim() && !invitadosAdicionales.includes(nuevoInvitado)) {
      setInvitadosAdicionales([...invitadosAdicionales, nuevoInvitado]);
      setNuevoInvitado('');
    }
  };

  // [3.6] Eliminar un acompañante de la lista
  const eliminarInvitado = (index) => {
    const nuevosInvitados = [...invitadosAdicionales];
    nuevosInvitados.splice(index, 1);
    setInvitadosAdicionales(nuevosInvitados);
  };

  // [3.7] Manejador de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
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

    // Preparar datos para guardar
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

    // Guardar en localStorage
    localStorage.setItem('confirmaciones', JSON.stringify(nuevaConfirmacion));
    
    // Notificar a otros componentes
    const event = new CustomEvent('confirmacionActualizada', {
      detail: {
        id: invitadoEncontrado.id,
        nombre,
        asistencia
      }
    });
    window.dispatchEvent(event);

    // Mostrar mensaje de éxito
    setSuccess(asistencia ? 
      '¡Gracias por confirmar tu asistencia!' : 
      'Lamentamos que no puedas asistir. ¡Gracias por avisarnos!');
  };

  // ----------------------------------------------------------
  // SECCIÓN 4: RENDERIZADO CONDICIONAL (Confirmación exitosa)
  // ----------------------------------------------------------
  if (success) {
    return (
      <div className="confirmacion-exitosa">
        {/* Animación de confeti si confirmó asistencia */}
        {asistencia && showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        
        {/* Icono triste si no asistirá */}
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
            
            {/* Lista de acompañantes si hay */}
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

            {/* Detalles del evento si asiste */}
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

            {/* Motivo si no asiste */}
            {!asistencia && <p><strong>Motivo:</strong> {razon}</p>}
          </div>

          {/* Botón para volver al inicio */}
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
  // SECCIÓN 5: RENDERIZADO PRINCIPAL (Formulario)
  // ----------------------------------------------------------
  return (
    <div className="confirmacion-container">
      <div className="confirmacion-header">
        <h1>Confirmación de Asistencia</h1>
        <p className="confirmacion-subtitle">Por favor confirma tu asistencia a nuestra boda</p>
      </div>
      
      <form onSubmit={handleSubmit} className="confirmacion-form">
        {/* Mensaje de error si existe */}
        {error && <div className="form-error">{error}</div>}

        {/* Grupo del campo de nombre */}
        <div className="form-group">
          <label className="form-label">Tu Nombre Completo:</label>
          <div className="name-search-container">
            <input
              type="text"
              value={nombre}
              onChange={handleNombreChange}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              onFocus={() => nombre.length > 0 && setMostrarSugerencias(true)}
              placeholder="Ej: Juan Pérez"
              className="name-input"
              autoComplete="off"
            />
            <button 
              type="button" 
              onClick={verificarInvitado}
              className="verify-button"
            >
              Verificar
            </button>
          </div>
          
          {/* Lista desplegable de sugerencias */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="suggestions-container">
              <ul>
                {sugerencias.map((invitado, index) => (
                  <li 
                    key={index}
                    className="suggestion-item"
                    onClick={() => seleccionarSugerencia(invitado.nombre)}
                  >
                    {invitado.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Contacto WhatsApp si no encuentra el nombre */}
          {mostrarWhatsapp && (
            <div className="whatsapp-contact">
              <p>Si crees que es un error, por favor contáctanos:</p>
              <WhatsappIcon />
            </div>
          )}
        </div>

        {/* Secciones que aparecen SOLO si se encontró al invitado */}
        {invitadoEncontrado && (
          <>
            {/* Sección para agregar acompañantes */}
            <div className="form-group">
              <button 
                type="button" 
                onClick={() => setMostrarAgregarInvitado(!mostrarAgregarInvitado)}
                className="toggle-guests-button"
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
                  
                  {/* Lista de acompañantes agregados */}
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
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Mensaje si alcanzó el límite de acompañantes */}
                  {invitadosAdicionales.length >= invitadoEncontrado.acompanantes && (
                    <p className="guest-limit-message">
                      Has alcanzado el máximo de acompañantes permitidos
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Opciones de asistencia (radio buttons) */}
            <div className="form-group attendance-buttons">
  <label className="form-label">¿Asistirás a la boda?</label>
  <div className="button-options">
    <button
      type="button"
      className={`attendance-button ${asistencia ? 'selected' : ''}`}
      onClick={() => setAsistencia(true)}
    >
      Sí, asistiré
    </button>
    <button
      type="button"
      className={`attendance-button ${!asistencia ? 'selected' : ''}`}
      onClick={() => setAsistencia(false)}
    >
      No, no podré asistir...
    </button>
  </div>
</div>

            {/* Campo de motivo si no asiste */}
            {!asistencia && (
              <div className="form-group">
                <label className="form-label">¿Por qué no podrás asistir?</label>
                <textarea
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  placeholder="Cuéntanos el motivo..."
                  className="reason-textarea"
                />
              </div>
            )}

            {/* Botón de envío del formulario */}
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