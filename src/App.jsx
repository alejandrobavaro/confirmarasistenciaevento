// =========================================================
// APP.JSX - ARCHIVO PRINCIPAL DE RUTEO Y ESTRUCTURA DE LA APLICACIÓN
// =========================================================

// -----------------------------------------------------------------
// 1. IMPORTS PRINCIPALES
// -----------------------------------------------------------------
// React: Biblioteca principal para construir la interfaz de usuario.
import React from 'react';
// React Router: Librería para manejar las rutas y navegación en la app.
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
// createBrowserHistory: Función para crear un objeto de historial personalizado.
import { createBrowserHistory } from 'history';

// -----------------------------------------------------------------
// 2. IMPORTS DE COMPONENTES LOCALES (SOLO LOS EXISTENTES)
// -----------------------------------------------------------------
// Componentes de la carpeta './componentes/' que SÍ EXISTEN en tu proyecto.
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import ListaInvitados from './componentes/ListaInvitados';
import PaginaDeConfirmacionInvitado from './componentes/PaginaDeConfirmacionInvitado';
import Contacto from './componentes/Contacto';
import PublicidadSlider from './componentes/PublicidadSlider';
import WhatsappIcon from './componentes/WhatsappIcon';

// -----------------------------------------------------------------
// 3. CONFIGURACIÓN DEL HISTORIAL PARA EL ROUTER
// -----------------------------------------------------------------
// Crea un objeto de historial personalizado para el router.
const history = createBrowserHistory({ window });

// -----------------------------------------------------------------
// 4. CONFIGURACIÓN DE RUTAS DE LA APLICACIÓN (SOLO CON COMPONENTES EXISTENTES)
// -----------------------------------------------------------------
// Array de objetos que define las rutas de la app.
// Cada objeto tiene:
//   - path: Ruta URL.
//   - element: Componente que se renderiza cuando se visita esa ruta.
const routesConfig = [
  {
    path: '/', // Ruta raíz (página de inicio).
    element: <PaginaDeConfirmacionInvitado />, // Muestra el formulario de confirmación.
  },
  {
    path: '/confirmados', // Ruta para ver invitados confirmados.
    element: <ListaInvitados />, // Muestra el componente ListaInvitados.
  },
  {
    path: '/confirmar/:id', // Ruta dinámica para confirmar por ID.
    element: <PaginaDeConfirmacionInvitado />, // Muestra el formulario de confirmación.
  },
  {
    path: '/confirmar/buscar', // Ruta para búsqueda manual de invitados.
    element: <PaginaDeConfirmacionInvitado />, // Muestra el formulario de confirmación.
  },
  {
    path: '/contacto', // Ruta para la página de contacto.
    element: <Contacto />, // Muestra el componente Contacto.
  },
];

// -----------------------------------------------------------------
// 5. COMPONENTE PRINCIPAL DE LA APLICACIÓN (App)
// -----------------------------------------------------------------
function App() {
  return (
    <HistoryRouter
      history={history}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Header: Se muestra en todas las páginas. */}
      <Header />

      {/* main: Contenedor del contenido principal de la página. */}
      <main className="main-content">
        {/* Routes: Contenedor de rutas. */}
        <Routes>
          {/* Mapea el array routesConfig para crear cada Route. */}
          {routesConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {/* Ruta comodín (*): Muestra "Página no encontrada" si la URL no coincide con ninguna ruta. */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </main>

      {/* PublicidadSlider: Slider de publicidad, fijo en todas las páginas. */}
      <PublicidadSlider />

      {/* Footer: Pie de página, fijo en todas las páginas. */}
      <Footer />

      {/* WhatsappIcon: Icono flotante de WhatsApp, fijo en todas las páginas. */}
      <WhatsappIcon />
    </HistoryRouter>
  );
}

// -----------------------------------------------------------------
// 6. EXPORTACIÓN DEL COMPONENTE
// -----------------------------------------------------------------
export default App;
