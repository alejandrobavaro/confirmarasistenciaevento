import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../assets/scss/_03-Componentes/_ListaInvitados.scss';

/* ============================================= */
/* CONFIGURACIÓN JSONBIN.IO (Mismos valores que PaginaDeConfirmacionInvitado) */
/* ============================================= */
const BIN_ID = "68a108aa43b1c97be92019ad"; // Debe coincidir con el otro componente
const API_KEY = "$2a$10$tTu..."; // Misma API Key en ambos archivos

const ListaInvitados = () => {
  /* ============================================= */
  /* ESTADOS DEL COMPONENTE */
  /* ============================================= */
  const [invitados, setInvitados] = useState([]);
  const [confirmaciones, setConfirmaciones] = useState({});
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [grupoActivo, setGrupoActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  /* ============================================= */
  /* EFECTOS SECUNDARIOS */
  /* ============================================= */
  useEffect(() => {
    /**
     * Carga inicial de datos (invitados + confirmaciones)
     * Fuente:
     * - Invitados: archivo local invitados.json
     * - Confirmaciones: JSONBin.io o localStorage
     */
    const cargarDatos = async () => {
      try {
        // 1. Cargar lista de invitados estática
        const response = await fetch('/invitados.json');
        const data = await response.json();
        setInvitados(data.grupos.flatMap(grupo =>
          grupo.invitados.map(inv => ({ ...inv, grupo: grupo.nombre }))
        ));
        // 2. Cargar confirmaciones remotas
        await cargarConfirmaciones();
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrorCarga('Error al cargar los datos. Por favor recarga la página.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
    // Listener para actualizaciones en tiempo real
    const handleConfirmacionActualizada = () => {
      cargarConfirmaciones();
    };
    window.addEventListener('confirmacionActualizada', handleConfirmacionActualizada);

    return () => {
      window.removeEventListener('confirmacionActualizada', handleConfirmacionActualizada);
    };
  }, []);

  /* ============================================= */
  /* FUNCIONES PRINCIPALES */
  /* ============================================= */
  /**
   * Carga las confirmaciones desde JSONBin.io con fallback a localStorage
   */
  const cargarConfirmaciones = async () => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Error en la respuesta");

      const { record } = await response.json();
      setConfirmaciones(record.confirmaciones || {});
    } catch (error) {
      console.error("Error al cargar confirmaciones:", error);
      // Fallback a localStorage
      const localData = JSON.parse(localStorage.getItem('confirmaciones') || '{}');
      setConfirmaciones(localData);
    }
  };

  /**
   * Actualiza el estado de confirmación de un invitado
   * @param {string} id - ID del invitado
   * @param {boolean} asistira - Estado de confirmación
   */
  const manejarConfirmacion = async (id, asistira) => {
    const invitado = invitados.find(i => i.id === id);
    if (!invitado) return;
    const nuevaConfirmacion = {
      nombre: invitado.nombre,
      asistencia: asistira,
      fecha: new Date().toISOString(),
      invitadosAdicionales: []
    };
    try {
      // 1. Obtener estado actual
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });

      if (!res.ok) throw new Error("Error al obtener datos");

      const { record } = await res.json();

      // 2. Enviar actualización
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
          'X-Bin-Versioning': 'false'
        },
        body: JSON.stringify({
          ...record,
          confirmaciones: {
            ...(record.confirmaciones || {}),
            [id]: nuevaConfirmacion
          }
        })
      });
      // 3. Actualizar UI y notificar
      setConfirmaciones(prev => ({ ...prev, [id]: nuevaConfirmacion }));
      window.dispatchEvent(new CustomEvent('confirmacionActualizada', {
        detail: {
          id,
          nombre: invitado.nombre,
          asistencia: asistira
        }
      }));

    } catch (error) {
      console.error("Error:", error);
      // Fallback local
      localStorage.setItem('confirmaciones', JSON.stringify({
        ...JSON.parse(localStorage.getItem('confirmaciones') || '{}'),
        [id]: nuevaConfirmacion
      }));
      setConfirmaciones(prev => ({ ...prev, [id]: nuevaConfirmacion }));
    }
  };

  const exportarATXT = () => {
    let content = "Nombre\tGrupo\tRelación\tEstado\tAcompañantes\tFecha\n";

    invitados.forEach(inv => {
      const conf = confirmaciones[inv.id];
      content += `${inv.nombre}\t${inv.grupo}\t${inv.relacion}\t`;
      content += conf ? (conf.asistencia ? 'Confirmado' : 'Rechazado') : 'Pendiente';
      content += `\t${inv.acompanantes}\t`;
      content += conf ? new Date(conf.fecha).toLocaleDateString() : '-\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista_invitados_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportarAExcel = () => {
    const data = invitados.map(inv => {
      const conf = confirmaciones[inv.id];
      return {
        Nombre: inv.nombre,
        Grupo: inv.grupo,
        Relación: inv.relacion,
        Estado: conf ? (conf.asistencia ? 'Confirmado' : 'Rechazado') : 'Pendiente',
        Acompañantes: inv.acompanantes,
        Fecha: conf ? new Date(conf.fecha).toLocaleDateString() : '-'
      };
    });

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(libro, hoja, "Invitados");
    XLSX.writeFile(libro, `lista_invitados_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  /* ============================================= */
  /* FILTRADO Y CÁLCULOS */
  /* ============================================= */
  const invitadosFiltrados = invitados.filter(inv => {
    if (grupoActivo !== 'todos' && inv.grupo !== grupoActivo) return false;

    const conf = confirmaciones[inv.id];
    if (filtro === 'confirmados' && (!conf || !conf.asistencia)) return false;
    if (filtro === 'rechazados' && (!conf || conf.asistencia)) return false;

    if (busqueda && !inv.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;

    return true;
  });

  const grupos = ['todos', ...new Set(invitados.map(inv => inv.grupo))];
  const totalInvitados = invitados.length;
  const totalConfirmados = invitados.filter(inv => confirmaciones[inv.id]?.asistencia).length;
  const totalRechazados = invitados.filter(inv => confirmaciones[inv.id] && !confirmaciones[inv.id]?.asistencia).length;

  /* ============================================= */
  /* RENDERIZADO */
  /* ============================================= */
  if (cargando) {
    return (
      <div className="guest-list-container loading">
        <div className="loading-spinner"></div>
        <p>Cargando lista de invitados...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="guest-list-container error">
        <p className="error-message">{errorCarga}</p>
        <button
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Recargar Página
        </button>
      </div>
    );
  }

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h1 className="guest-list-title">Gestión de Invitados</h1>
        <p className="guest-list-subtitle">Administra las confirmaciones de asistencia</p>

        <div className="guest-controls">
          <div className="filter-group">
            <label htmlFor="grupo-select" className="filter-label">Filtrar por grupo:</label>
            <select
              id="grupo-select"
              value={grupoActivo}
              onChange={(e) => setGrupoActivo(e.target.value)}
              className="group-select"
              aria-label="Seleccionar grupo para filtrar"
            >
              {grupos.map(grupo => (
                <option key={grupo} value={grupo}>
                  {grupo === 'todos' ? 'Todos los grupos' : grupo}
                </option>
              ))}
            </select>
          </div>

          <div className="search-group">
            <label htmlFor="busqueda-input" className="sr-only">Buscar invitado</label>
            <input
              id="busqueda-input"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar invitado..."
              className="search-input"
              aria-label="Buscar invitado por nombre"
            />
          </div>

          <div className="quick-filters">
            <button
              onClick={() => setFiltro('todos')}
              className={`filter-button ${filtro === 'todos' ? 'active' : ''}`}
              aria-pressed={filtro === 'todos'}
              aria-label="Mostrar todos los invitados"
            >
              Todos ({totalInvitados})
            </button>
            <button
              onClick={() => setFiltro('confirmados')}
              className={`filter-button confirmados ${filtro === 'confirmados' ? 'active' : ''}`}
              aria-pressed={filtro === 'confirmados'}
              aria-label="Mostrar solo confirmados"
            >
              Confirmados ({totalConfirmados})
            </button>
            <button
              onClick={() => setFiltro('rechazados')}
              className={`filter-button rechazados ${filtro === 'rechazados' ? 'active' : ''}`}
              aria-pressed={filtro === 'rechazados'}
              aria-label="Mostrar solo rechazados"
            >
              Rechazados ({totalRechazados})
            </button>
          </div>

          <div className="export-buttons">
            <button
              onClick={exportarATXT}
              className="export-button"
              aria-label="Exportar lista a archivo de texto"
            >
              Exportar a TXT
            </button>
            <button
              onClick={exportarAExcel}
              className="export-button"
              aria-label="Exportar lista a Excel"
            >
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>
      <div className="guest-table-container">
        {invitadosFiltrados.length > 0 ? (
          <table className="guest-table" aria-label="Lista de invitados">
            <thead>
              <tr>
                <th scope="col" className="guest-name">Nombre</th>
                <th scope="col" className="guest-group">Grupo</th>
                <th scope="col" className="guest-relation">Relación</th>
                <th scope="col" className="guest-status">Estado</th>
                <th scope="col" className="guest-companions">Acompañantes</th>
                <th scope="col" className="guest-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitadosFiltrados.map(inv => {
                const conf = confirmaciones[inv.id];
                return (
                  <tr key={inv.id} className="guest-row">
                    <td className="guest-name">{inv.nombre}</td>
                    <td className="guest-group">{inv.grupo}</td>
                    <td className="guest-relation">{inv.relacion}</td>
                    <td className="guest-status">
                      {conf ? (
                        <span className={`status-badge ${conf.asistencia ? 'confirmed' : 'rejected'}`}>
                          {conf.asistencia ? 'Confirmado' : 'Rechazado'}
                        </span>
                      ) : (
                        <span className="status-badge pending">Pendiente</span>
                      )}
                    </td>
                    <td className="guest-companions">{inv.acompanantes}</td>
                    <td className="guest-actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => manejarConfirmacion(inv.id, true)}
                          className={`action-button confirm ${conf?.asistencia ? 'active' : ''}`}
                          aria-label={`Confirmar asistencia para ${inv.nombre}`}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => manejarConfirmacion(inv.id, false)}
                          className={`action-button reject ${conf?.asistencia === false ? 'active' : ''}`}
                          aria-label={`Rechazar asistencia para ${inv.nombre}`}
                        >
                          No puede Asistir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            No se encontraron invitados con los filtros actuales
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaInvitados;
