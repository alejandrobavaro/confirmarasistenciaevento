// =========================================================
// IMPORTS PRINCIPALES
// =========================================================
import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// --- Componentes permitidos según tu estructura ---
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import ListaInvitadosConfirmados from './componentes/ListaInvitadosConfirmados';
import ListaInvitadosSinConfirmar from './componentes/ListaInvitadosSinConfirmar';
import PaginaDeConfirmacionInvitado from './componentes/PaginaDeConfirmacionInvitado';
import Contacto from './componentes/Contacto';
import PublicidadSlider from './componentes/PublicidadSlider';
import WhatsappIcon from './componentes/WhatsappIcon';

// --- Configuración del historial para el router ---
const history = createBrowserHistory({ window });

// --- Configuración de rutas (solo las necesarias) ---
const routesConfig = [
  {
    path: '/',
    element: <ListaInvitadosSinConfirmar />, // Página principal: lista de invitados sin confirmar
  },
  {
    path: '/confirmados',
    element: <ListaInvitadosConfirmados />, // Lista de invitados confirmados
  },
  {
    path: '/confirmar/:id',
    element: <PaginaDeConfirmacionInvitado />, // Página de confirmación individual
  },
  {
    path: '/confirmar/buscar',
    element: <PaginaDeConfirmacionInvitado />, // Modo búsqueda manual
  },
  {
    path: '/contacto',
    element: <Contacto />, // Página de contacto
  },
];

// --- Componente principal de la aplicación ---
function App() {
  return (
    <HistoryRouter
      history={history}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Header fijo en todas las páginas */}
      <Header />

      {/* Contenido principal (centrado y con padding) */}
      <main className="main-content">
        <Routes>
          {routesConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {/* Ruta 404: página no encontrada */}
          <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
        </Routes>
      </main>

      {/* Publicidad (slider) */}
      <PublicidadSlider />

      {/* Footer fijo en todas las páginas */}
      <Footer />

      {/* Icono de WhatsApp flotante */}
      <WhatsappIcon />
    </HistoryRouter>
  );
}

export default App;
