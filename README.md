# confirmarasistenciaevento
# Documentación del Proyecto: Sitio Web de Boda "Ale y Fabi"

## 📌 Visión General
**Sitio web de boda** moderno y elegante que permite:
- Confirmación digital de asistencia
- Gestión de lista de invitados
- Información detallada del evento
- Interacción con los novios

## 🎯 Objetivos del Proyecto

### Objetivo Principal
Crear una **experiencia digital memorable** para los invitados a la boda, optimizando el proceso de confirmación de asistencia y comunicación.

### Objetivos Específicos
1. ✅ **Automatizar confirmaciones**: Reducir trabajo manual en gestión de invitados
2. 💍 **Mostrar detalles del evento**: Fecha, lugar, dress code y regalos
3. 📱 **Mobile-first**: Priorizar experiencia en dispositivos móviles
4. ✨ **Diseño elegante**: Reflejar la estética de la boda
5. 📊 **Generar reportes**: Exportar listas de confirmados

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Uso |
|------------|-----|
| React 18 | Librería principal para UI |
| React Router | Navegación entre páginas |
| Vite | Bundler y entorno de desarrollo |
| SCSS | Estilos avanzados |
| react-slick | Slider de fotos |
| xlsx | Generación de Excel |
| react-confetti | Efectos visuales |

### Backend (Client-side)
| Tecnología | Uso |
|------------|-----|
| localStorage | Persistencia de confirmaciones |
| Custom Events | Comunicación entre componentes |

## 📂 Estructura del Proyecto

### Componentes Principales

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `App` | `src/App.jsx` | Componente raíz y enrutador principal |
| `Header` | `src/componentes/Header.jsx` | Barra superior con logo y navegación |
| `Footer` | `src/componentes/Footer.jsx` | Pie de página con redes sociales y contacto |
| `PaginaDeConfirmacionInvitado` | `src/componentes/PaginaDeConfirmacionInvitado.jsx` | Formulario de confirmación de asistencia |
| `ListaInvitados` | `src/componentes/ListaInvitados.jsx` | Panel de gestión para los novios (confirmaciones) |
| `Contacto` | `src/componentes/Contacto.jsx` | Formulario de contacto y galería de fotos |
| `WhatsappIcon` | `src/componentes/WhatsappIcon.jsx` | Botón flotante de WhatsApp |
| `PublicidadSlider` | `src/componentes/PublicidadSlider.jsx` | Carrusel de sponsors/patrocinadores |

### Estilos SCSS

| Archivo | Responsabilidad |
|---------|-----------------|
| `_App.scss` | Estilos globales y estructura base |
| `_Header.scss` | Estilos de la barra de navegación |
| `_Footer.scss` | Estilos del pie de página |
| `_PaginaDeConfirmacionInvitado.scss` | Estilos del formulario de confirmación |
| `_ListaInvitados.scss` | Estilos de la tabla de gestión |
| `_Contacto.scss` | Estilos de la página de contacto |
| `_PublicidadSlider.scss` | Estilos del carrusel de sponsors |
| `_WhatsappIcon.scss` | Estilos del botón de WhatsApp |

## 🔍 Flujo de Usuario

### Para Invitados
1. Ingresan al sitio mediante enlace compartido
2. Buscan su nombre en el formulario
3. Confirman/rechazan asistencia
4. Agregan acompañantes (si aplica)
5. Reciben detalles del evento

### Para Novios/Administradores
1. Acceden a la vista de lista de invitados
2. Filtran por estado de confirmación
3. Exportan datos a Excel/TXT
4. Gestionan confirmaciones manuales

## 📊 Especificaciones Técnicas

### Funcionalidades Clave

1. **Sistema de Confirmación**
   - Búsqueda inteligente con sugerencias
   - Validación de acompañantes permitidos
   - Persistencia en localStorage
   - Notificación entre componentes

2. **Panel de Gestión**
   - Filtrado por estado/grupo
   - Exportación a múltiples formatos
   - Visualización de estadísticas

3. **Optimizaciones**
   - Lazy loading de imágenes
   - Carga progresiva de datos
   - Animaciones performance-friendly

### Estructura de Datos

```json
// Ejemplo de datos en localStorage
{
  "confirmaciones": {
    "invitado-123": {
      "nombre": "Juan Pérez",
      "asistencia": true,
      "fecha": "2023-10-15T12:00:00Z",
      "invitadosAdicionales": ["María Pérez"]
    }
  }
}
```


## 📈 Estrategia de Marketing

### Público Objetivo
- Invitados a la boda (18-70 años)
- Familiares cercanos
- Amigos de los novios

### Canales de Distribución
1. **Invitación Digital**: Enlace personalizado vía WhatsApp/email
2. **Código QR**: En invitaciones físicas
3. **Redes Sociales**: Historias destacadas en Instagram

### Métricas de Éxito
| KPI | Objetivo |
|------|----------|
| Tasa de confirmación | >85% en primeros 7 días |
| Tiempo promedio de confirmación | <3 minutos por invitado |
| Retención de detalles | 70% revisa información del evento |

## 🌟 Características Destacadas

1. **Experiencia Mobile-first**
   - Optimizado para visualización en smartphones
   - Integración nativa con WhatsApp
   - Diseño táctil amigable

2. **Personalización Elegante**
   - Paleta de colores vino tinto y dorado
   - Tipografía clásica (Cormorant Garamond)
   - Animaciones sutiles

3. **Funcionalidades Únicas**
   - Exportación de listas para planificación
   - Sistema de búsqueda predictiva
   - Confirmación en 3 pasos

