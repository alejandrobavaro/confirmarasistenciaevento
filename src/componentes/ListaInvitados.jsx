import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../assets/scss/_03-Componentes/_ListaInvitados.scss";
import { obtenerGruposInvitados } from "../controllers/gruposInvitados";
import {
  guardarConfirmacion,
  obtenerConfirmaciones,
} from "../controllers/confirmaciones";

const ListaInvitados = () => {
  // ----------------------------------------------------------
  // ESTADOS DEL COMPONENTE
  // ----------------------------------------------------------
  const [invitados, setInvitados] = useState([]);
  const [confirmaciones, setConfirmaciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [grupoActivo, setGrupoActivo] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [invitadosFiltrados, setInvitadosFiltrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [totalInvitados, setTotalInvitados] = useState([]);
  const [totalConfirmados, setTotalConfirmados] = useState([]);
  const [totalRechazados, setTotalRechazados] = useState([]);

  // ----------------------------------------------------------
  // EFECTOS SECUNDARIOS
  // ----------------------------------------------------------
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar lista de invitados
        const data = await obtenerGruposInvitados();
        const todosInvitados = data.flatMap((grupo) =>
          grupo.invitados.map((inv) => ({
            ...inv,
            grupo: grupo.nombre,
          }))
        );

        setInvitados(todosInvitados);

        // Cargar confirmaciones guardadas
        const confirmacionesData = await obtenerConfirmaciones();

        // Si viene como objeto, lo transformo en array
        const confirmacionesArray = Array.isArray(confirmacionesData)
          ? confirmacionesData
          : Object.entries(confirmacionesData).map(([id, conf]) => ({
              id: parseInt(id, 10),
              ...conf,
            }));

        setConfirmaciones(confirmacionesArray);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();

    // Escuchar eventos de confirmación
    const handleConfirmacionActualizada = async (event) => {
      const { id, nombre, asistencia } = event.detail;

      setConfirmaciones((prev) => {
        // Si ya existe, lo actualizo
        const existe = prev.find((c) => c.id === id);
        if (existe) {
          return prev.map((c) =>
            c.id === id
              ? { ...c, nombre, asistencia, fecha: new Date().toISOString() }
              : c
          );
        }
        // Si no existe, lo agrego
        return [
          ...prev,
          { id, nombre, asistencia, fecha: new Date().toISOString() },
        ];
      });

      await guardarConfirmacion(id.toString(), {
        nombre,
        asistencia,
        fecha: new Date().toISOString(),
      });
    };

    window.addEventListener(
      "confirmacionActualizada",
      handleConfirmacionActualizada
    );

    return () => {
      window.removeEventListener(
        "confirmacionActualizada",
        handleConfirmacionActualizada
      );
    };
  }, []);

  // ----------------------------------------------------------
  // FUNCIONES PRINCIPALES
  // ----------------------------------------------------------
  const manejarConfirmacion = async (id, asistira) => {
    const invitado = invitados.find((i) => i.id === id);
    if (!invitado) return;

    setConfirmaciones((prev) => {
      const existe = prev.find((c) => c.id === id);
      if (existe) {
        return prev.map((c) =>
          c.id === id
            ? {
                ...c,
                nombre: invitado.nombre,
                asistencia: asistira,
                fecha: new Date().toISOString(),
              }
            : c
        );
      }
      return [
        ...prev,
        {
          id,
          nombre: invitado.nombre,
          asistencia: asistira,
          fecha: new Date().toISOString(),
        },
      ];
    });

    await guardarConfirmacion(id.toString(), {
      nombre: invitado.nombre,
      asistencia: asistira,
      fecha: new Date().toISOString(),
    });

    // Notificar actualización
    const event = new CustomEvent("confirmacionActualizada", {
      detail: { id, nombre: invitado.nombre, asistencia: asistira },
    });
    window.dispatchEvent(event);
  };

  const exportarATXT = () => {
    let content = "Nombre\tGrupo\tRelación\tEstado\tFecha\n";

    invitados.forEach((inv) => {
      const conf = confirmaciones.find((c) => c.id === inv.id); // ✅ usar find
      content += `${inv.nombre}\t${inv.grupo}\t${inv.relacion}\t`;
      content += conf
        ? conf.asistencia
          ? "Confirmado"
          : "Rechazado"
        : "Pendiente";
      content += `\t${conf ? new Date(conf.fecha).toLocaleDateString() : "-"}`;
      content += "\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lista_invitados_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportarAExcel = () => {
    const data = invitados.map((inv) => {
      const conf = confirmaciones.find((c) => c.id === inv.id); // ✅ usar find
      return {
        Nombre: inv.nombre,
        Grupo: inv.grupo,
        Relación: inv.relacion,
        Estado: conf
          ? conf.asistencia
            ? "Confirmado"
            : "Rechazado"
          : "Pendiente",
        Fecha: conf ? new Date(conf.fecha).toLocaleDateString() : "-",
      };
    });

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(libro, hoja, "Invitados");
    XLSX.writeFile(
      libro,
      `lista_invitados_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ----------------------------------------------------------
  // FILTRADO Y CÁLCULOS
  // ----------------------------------------------------------

  useEffect(() => {
    setInvitadosFiltrados(
      invitados.filter((inv) => {
        if (grupoActivo !== "todos" && inv.grupo !== grupoActivo) return false;

        const conf = confirmaciones[inv.id];
        if (filtro === "confirmados" && (!conf || !conf.asistencia))
          return false;
        if (filtro === "rechazados" && (!conf || conf.asistencia)) return false;

        if (
          busqueda &&
          !inv.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
          return false;

        return true;
      })
    );

    const groups = ["todos", ...new Set(invitados.map((inv) => inv.grupo))];

    setGrupos(groups);
    setTotalInvitados(invitados.length);

    const totalInvitadosConfirmados = invitados.filter((inv) =>
      confirmaciones.some(
        (conf) => conf.id === inv.id && conf.asistencia === true
      )
    ).length;

    setTotalConfirmados(totalInvitadosConfirmados);

    const totalInvitadosRechazados = invitados.filter((inv) =>
      confirmaciones.some(
        (conf) => conf.id === inv.id && conf.asistencia === false
      )
    ).length;

    setTotalRechazados(totalInvitadosRechazados);
  }, [invitados, confirmaciones, grupoActivo, filtro, busqueda]);

  // ----------------------------------------------------------
  // RENDERIZADO
  // ----------------------------------------------------------
  if (cargando) {
    return (
      <div className="guest-list-container loading">
        <div className="loading-spinner"></div>
        <p>Cargando lista de invitados...</p>
      </div>
    );
  }

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h1 className="guest-list-title">Gestión de Invitados</h1>
        <p className="guest-list-subtitle">
          Administra las confirmaciones de asistencia
        </p>

        <div className="guest-controls">
          <div className="filter-group">
            <label htmlFor="grupo-select" className="filter-label">
              Filtrar por grupo:
            </label>
            <select
              id="grupo-select"
              value={grupoActivo}
              onChange={(e) => setGrupoActivo(e.target.value)}
              className="group-select"
              aria-label="Seleccionar grupo para filtrar"
            >
              {grupos.map((grupo) => (
                <option key={grupo} value={grupo}>
                  {grupo === "todos" ? "Todos los grupos" : grupo}
                </option>
              ))}
            </select>
          </div>

          <div className="search-group">
            <label htmlFor="busqueda-input" className="sr-only">
              Buscar invitado
            </label>
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
              onClick={() => setFiltro("todos")}
              className={`filter-button ${filtro === "todos" ? "active" : ""}`}
              aria-pressed={filtro === "todos"}
              aria-label="Mostrar todos los invitados"
            >
              Todos ({totalInvitados})
            </button>
            <button
              onClick={() => setFiltro("confirmados")}
              className={`filter-button confirmados ${
                filtro === "confirmados" ? "active" : ""
              }`}
              aria-pressed={filtro === "confirmados"}
              aria-label="Mostrar solo confirmados"
            >
              Confirmados ({totalConfirmados})
            </button>
            <button
              onClick={() => setFiltro("rechazados")}
              className={`filter-button rechazados ${
                filtro === "rechazados" ? "active" : ""
              }`}
              aria-pressed={filtro === "rechazados"}
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
                <th scope="col" className="guest-name">
                  Nombre
                </th>
                <th scope="col" className="guest-group">
                  Grupo
                </th>
                <th scope="col" className="guest-relation">
                  Relación
                </th>
                <th scope="col" className="guest-status">
                  Estado
                </th>
                {/*                 <th scope="col" className="guest-companions">
                  Acompañantes
                </th> */}
                <th scope="col" className="guest-actions">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {invitadosFiltrados.map((inv) => {
                const conf = confirmaciones.find((item) => item.id === inv.id);
                return (
                  <tr key={inv.id} className="guest-row">
                    <td className="guest-name">{inv.nombre}</td>
                    <td className="guest-group">{inv.grupo}</td>
                    <td className="guest-relation">{inv.relacion}</td>
                    <td className="guest-status">
                      {conf ? (
                        <span
                          className={`status-badge ${
                            conf.asistencia ? "confirmed" : "rejected"
                          }`}
                        >
                          {conf.asistencia ? "Confirmado" : "Rechazado"}
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
                          className={`action-button confirm ${
                            conf?.asistencia ? "active" : ""
                          }`}
                          aria-label={`Confirmar asistencia para ${inv.nombre}`}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => manejarConfirmacion(inv.id, false)}
                          className={`action-button reject ${
                            conf?.asistencia === false ? "active" : ""
                          }`}
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