import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../assets/scss/_03-Componentes/_ListaInvitados.scss';

const ListaInvitados = () => {
  const [invitados, setInvitados] = useState([]);
  const [confirmaciones, setConfirmaciones] = useState({});
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [grupoActivo, setGrupoActivo] = useState('todos');

  useEffect(() => {
    // Cargar lista de invitados
    fetch('/invitados.json')
      .then(response => response.json())
      .then(data => {
        const todosInvitados = data.grupos.flatMap(grupo => 
          grupo.invitados.map(inv => ({
            ...inv,
            grupo: grupo.nombre
          }))
        );
        setInvitados(todosInvitados);
      });

    // Cargar confirmaciones guardadas
    const stored = localStorage.getItem('confirmaciones');
    if (stored) {
      setConfirmaciones(JSON.parse(stored));
    }

    // Escuchar eventos de confirmación
    const handleConfirmacionActualizada = (event) => {
      const { id, nombre, asistencia } = event.detail;
      
      setConfirmaciones(prev => ({
        ...prev,
        [id]: {
          nombre,
          asistencia,
          fecha: new Date().toISOString(),
          invitadosAdicionales: []
        }
      }));
      
      // Actualizar localStorage
      const stored = JSON.parse(localStorage.getItem('confirmaciones') || {});
      localStorage.setItem('confirmaciones', JSON.stringify({
        ...stored,
        [id]: {
          nombre,
          asistencia,
          fecha: new Date().toISOString(),
          invitadosAdicionales: []
        }
      }));
    };

    window.addEventListener('confirmacionActualizada', handleConfirmacionActualizada);
    
    return () => {
      window.removeEventListener('confirmacionActualizada', handleConfirmacionActualizada);
    };
  }, []);

  const manejarConfirmacion = (id, asistira) => {
    const invitado = invitados.find(i => i.id === id);
    if (!invitado) return;

    const nuevaConfirmacion = {
      ...confirmaciones,
      [id]: {
        nombre: invitado.nombre,
        asistencia: asistira,
        fecha: new Date().toISOString(),
        invitadosAdicionales: []
      }
    };

    localStorage.setItem('confirmaciones', JSON.stringify(nuevaConfirmacion));
    setConfirmaciones(nuevaConfirmacion);
    
    // Notificar actualización para otros componentes
    const event = new CustomEvent('confirmacionActualizada', {
      detail: {
        id,
        nombre: invitado.nombre,
        asistencia: asistira
      }
    });
    window.dispatchEvent(event);
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
    link.click();
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

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h1 className="guest-list-title">Gestión de Invitados</h1>
        <p className="guest-list-subtitle">Administra las confirmaciones de asistencia</p>
        
        <div className="guest-controls">
          <div className="filter-group">
            <label className="filter-label">Filtrar por grupo:</label>
            <select 
              value={grupoActivo} 
              onChange={(e) => setGrupoActivo(e.target.value)}
              className="group-select"
            >
              {grupos.map(grupo => (
                <option key={grupo} value={grupo}>
                  {grupo === 'todos' ? 'Todos los grupos' : grupo}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-group">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar invitado..."
              className="search-input"
            />
          </div>
          
          <div className="quick-filters">
            <button 
              onClick={() => setFiltro('todos')} 
              className={`filter-button ${filtro === 'todos' ? 'active' : ''}`}
            >
              Todos ({totalInvitados})
            </button>
            <button 
              onClick={() => setFiltro('confirmados')} 
              className={`filter-button confirmados ${filtro === 'confirmados' ? 'active' : ''}`}
            >
              Confirmados ({totalConfirmados})
            </button>
            <button 
              onClick={() => setFiltro('rechazados')} 
              className={`filter-button rechazados ${filtro === 'rechazados' ? 'active' : ''}`}
            >
              Rechazados ({totalRechazados})
            </button>
          </div>
          
          <div className="export-buttons">
            <button onClick={exportarATXT} className="export-button">
              Exportar a TXT
            </button>
            <button onClick={exportarAExcel} className="export-button">
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>

      <div className="guest-table-container">
        <table className="guest-table">
          <thead>
            <tr>
              <th className="guest-name">Nombre</th>
              <th className="guest-group">Grupo</th>
              <th className="guest-relation">Relación</th>
              <th className="guest-status">Estado</th>
              <th className="guest-companions">Acompañantes</th>
              <th className="guest-actions">Acciones</th>
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
                        title="Confirmar asistencia"
                      >
                        Confirmar
                      </button>
                      <button 
                        onClick={() => manejarConfirmacion(inv.id, false)}
                        className={`action-button reject ${conf?.asistencia === false ? 'active' : ''}`}
                        title="Rechazar asistencia"
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
        
        {invitadosFiltrados.length === 0 && (
          <div className="no-results">
            No se encontraron invitados con los filtros actuales
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaInvitados;