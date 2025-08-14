import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_ListaInvitadosConfirmados.scss';

const ListaInvitadosConfirmados = () => {
  // Estados del componente
  const [confirmaciones, setConfirmaciones] = useState({});
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  // Función mejorada para cargar confirmaciones
  const cargarConfirmaciones = () => {
    try {
      const storedConfirmaciones = localStorage.getItem('confirmaciones');
      if (storedConfirmaciones) {
        const parsed = JSON.parse(storedConfirmaciones);
        // Convertir el objeto a array y ordenar por fecha más reciente primero
        const confirmacionesArray = Object.values(parsed || {});
        confirmacionesArray.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        // Convertir de vuelta a objeto pero manteniendo el orden
        const confirmacionesOrdenadas = {};
        confirmacionesArray.forEach(conf => {
          confirmacionesOrdenadas[conf.nombre] = conf;
        });
        setConfirmaciones(confirmacionesOrdenadas);
      } else {
        setConfirmaciones({});
      }
    } catch (error) {
      console.error("Error al cargar confirmaciones:", error);
      setConfirmaciones({});
    }
  };

  // Efecto para cargar y sincronizar confirmaciones
  useEffect(() => {
    // Cargar datos iniciales
    cargarConfirmaciones();

    // Configurar listeners de eventos
    const manejarActualizacion = () => {
      console.log('Actualizando lista de confirmados...');
      cargarConfirmaciones();
    };

    window.addEventListener('storage', manejarActualizacion);
    window.addEventListener('confirmacionActualizada', manejarActualizacion);

    return () => {
      window.removeEventListener('storage', manejarActualizacion);
      window.removeEventListener('confirmacionActualizada', manejarActualizacion);
    };
  }, []);

  // Función para exportar a CSV
  const exportarConfirmaciones = () => {
    const confirmacionesArray = Object.values(confirmaciones);
    
    let csvContent = "Nombre,Asistencia,Acompañantes,Motivo,Fecha\n";
    
    confirmacionesArray.forEach(conf => {
      const acompanantes = conf.invitadosAdicionales?.length || 0;
      csvContent += `"${conf.nombre}",${conf.asistencia ? 'Confirmado' : 'Rechazado'},${acompanantes},"${!conf.asistencia ? conf.razon || '' : ''}",${new Date(conf.fecha).toLocaleString()}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `confirmaciones_boda_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Procesamiento de datos
  const confirmacionesArray = Object.values(confirmaciones);
  
  const confirmacionesFiltradas = confirmacionesArray.filter(conf => {
    const cumpleFiltro = filtro === 'todos' || 
                       (filtro === 'confirmados' && conf.asistencia) || 
                       (filtro === 'rechazados' && !conf.asistencia);
    const cumpleBusqueda = conf.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  // Cálculo de estadísticas
  const totalAsistentes = confirmacionesArray.filter(c => c.asistencia).length;
  const totalRechazados = confirmacionesArray.length - totalAsistentes;
  const totalInvitados = confirmacionesArray.reduce((total, conf) => 
    total + 1 + (conf.invitadosAdicionales?.length || 0), 0);
  const totalPersonasConfirmadas = confirmacionesArray
    .filter(c => c.asistencia)
    .reduce((total, conf) => total + 1 + (conf.invitadosAdicionales?.length || 0), 0);

  // Renderizado
  return (
    <div className="lista-confirmados-container">
      <div className="controles-superiores">
        <button onClick={() => navigate('/')} className="btn-volver">
          ← Volver al formulario
        </button>
        <h1>Lista de Confirmados <span className="badge">{confirmacionesFiltradas.length}</span></h1>
        <div className="acciones">
          <button onClick={exportarConfirmaciones} className="btn-exportar">
            Exportar CSV
          </button>
        </div>
      </div>
      
      <div className="filtros-container">
        <div className="grupo-filtros">
          <button onClick={() => setFiltro('todos')} className={`filtro ${filtro === 'todos' ? 'active' : ''}`}>
            Todos <span>({confirmacionesArray.length})</span>
          </button>
          <button onClick={() => setFiltro('confirmados')} className={`filtro ${filtro === 'confirmados' ? 'active' : ''}`}>
            Confirmados <span>({totalAsistentes})</span>
          </button>
          <button onClick={() => setFiltro('rechazados')} className={`filtro ${filtro === 'rechazados' ? 'active' : ''}`}>
            No asistirán <span>({totalRechazados})</span>
          </button>
        </div>
        
        <div className="busqueda-container">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="busqueda-input"
          />
        </div>
      </div>
      
      <div className="resumen-estadistico">
        <div className="estadistica">
          <div className="valor">{totalAsistentes}</div>
          <div className="label">Confirmados</div>
        </div>
        <div className="estadistica">
          <div className="valor">{totalRechazados}</div>
          <div className="label">No asistirán</div>
        </div>
        <div className="estadistica">
          <div className="valor">{totalPersonasConfirmadas}</div>
          <div className="label">Personas totales</div>
        </div>
        <div className="estadistica">
          <div className="valor">{totalInvitados}</div>
          <div className="label">Invitados totales</div>
        </div>
      </div>
      
      <div className="lista-confirmaciones">
        {confirmacionesFiltradas.length > 0 ? (
          confirmacionesFiltradas.map((conf, index) => (
            <div key={index} className={`confirmacion ${conf.asistencia ? 'asiste' : 'no-asiste'}`}>
              <div className="confirmacion-header">
                <div className="nombre">{conf.nombre}</div>
                <div className="estado">
                  {conf.asistencia ? (
                    <span className="badge asistencia-si">Confirmado</span>
                  ) : (
                    <span className="badge asistencia-no">No asistirá</span>
                  )}
                </div>
              </div>
              
              <div className="confirmacion-details">
                {conf.asistencia && conf.invitadosAdicionales?.length > 0 && (
                  <div className="acompanantes">
                    <strong>Acompañantes:</strong>
                    <ul>
                      {conf.invitadosAdicionales.map((inv, i) => (
                        <li key={i}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {!conf.asistencia && conf.razon && (
                  <div className="razon">
                    <strong>Motivo:</strong> {conf.razon}
                  </div>
                )}
                
                <div className="fecha">
                  {new Date(conf.fecha).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-resultados">
            {busqueda ? `No hay resultados para "${busqueda}"` : 'No hay confirmaciones registradas'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaInvitadosConfirmados;