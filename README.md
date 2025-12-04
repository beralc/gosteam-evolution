# GoSteam Evolution - Mockup

Mockup de la plataforma educativa GoSteam de Edelvives para gestión de proyectos STEAM.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn

### Pasos para ejecutar localmente

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
El proyecto se abrirá automáticamente en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
horizonte_talento/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── public/
│   ├── gosteam_color-logo.87f8073e.svg  # Logo color (header)
│   └── gosteam_white-logo.svg           # Logo blanco (footer)
├── index.html           # HTML base
├── package.json         # Dependencias
├── vite.config.js       # Configuración Vite
├── tailwind.config.js   # Configuración Tailwind
└── postcss.config.js    # Configuración PostCSS
```

## ✨ Mejoras Implementadas

### 🤖 Asistente IA con OpenAI (NUEVO)
- ✅ **Integración completa con OpenAI GPT-4O Mini**
- ✅ **Comportamiento adaptativo inteligente:**
  - Preguntas sobre contenido de proyectos → Método socrático (guía al estudiante)
  - Preguntas sobre funcionalidad → Respuestas directas
  - Preguntas generales → Información orientadora
- ✅ Base de conocimiento con 76 proyectos
- ✅ Configuración de API key por interfaz
- ✅ Almacenamiento seguro en localStorage
- ✅ Detección automática del tipo de pregunta
- ✅ Manejo robusto de errores
- ✅ Ver documentación completa en `ASISTENTE_IA.md`

### Navegación Híbrida
- ✅ **Dashboard con bloques visuales** para acceso rápido
- ✅ **QuickNav** - Barra de navegación horizontal en secciones
- ✅ **MobileBottomNav** - Navegación inferior para móviles
- ✅ **Atajos de teclado:** Alt+1 (Clases), Alt+2 (Biblioteca), Alt+3 (Recursos), Alt+4 (En tu Casa), Alt+H (Dashboard)
- ✅ Activity badges mostrando "3 activas" y "76 proyectos"
- ✅ Accesibilidad mejorada con tabIndex y aria-labels

### Diseño Gráfico
- ✅ Tipografía: **Space Grotesk** (títulos) + **Titillium Web** (cuerpo)
- ✅ Paleta de colores oficial GoSteam (Rosa #C83E7F, Amarillo #FBEB4E, Verde #8DB442, Azul #49A0DE)
- ✅ Iconos actualizados: `Sparkles` para STEAM, `Palette` para Creatividad
- ✅ Cards con sombras multicapa y borde púrpura en hover
- ✅ Footer con fondo negro y franja de acento multicolor
- ✅ Logo a color en header, logo blanco en footer

### UX/UI
- ✅ Filtrado instantáneo en Biblioteca con búsqueda por texto
- ✅ Navegación mejorada con botón Home
- ✅ Asistente chatbot con scroll personalizado y auto-scroll
- ✅ Cards con transición de elevación
- ✅ Categorías con gradientes en Dashboard
- ✅ Mejor jerarquía visual de información
- ✅ Estados de carga con indicadores animados

## 🎨 Paleta de Colores (Identidad GoSteam)

- **Colores de Marca:**
  - Rosa/Magenta: #C83E7F - rgb(200, 62, 127) - Color primario
  - Amarillo: #FBEB4E - rgb(251, 235, 78) - **Resaltados y acentos**
  - Verde: #8DB442 - rgb(141, 180, 66)
  - Azul: #49A0DE - rgb(73, 160, 222)

- **Aplicación por Categorías:**
  - STEAM: #C83E7F (Rosa/Magenta)
  - Creatividad: #FBEB4E (Amarillo)
  - IA: #49A0DE (Azul)
  - Ciudadanía Digital: #8DB442 (Verde)
  - Cultura Científica: #49A0DE (Azul)

## 📊 Datos de Prueba

El mockup incluye:
- **76 proyectos completos** con descripciones detalladas
- **5 categorías STEAM:** Programación y robótica, Creatividad, IA, Ciudadanía digital, Cultura científica
- **4 etapas educativas:** Educación Infantil, Primaria, Secundaria, Bachillerato
- **Filtros funcionales por:**
  - Etapa educativa
  - Área temática (Matemáticas, Lenguaje, Ciencias, Tecnología, Artes)
  - Necesidad de robot (Con Robot / Sin Robot)
- **Sistema de búsqueda por texto** en tiempo real

## 🔧 Comandos Disponibles

- `npm run dev` - Inicia servidor de desarrollo (puerto 3000)
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## 🤖 Configuración del Asistente IA

### Opción 1: Configurar por interfaz (Recomendado)
1. Abre la aplicación
2. Haz clic en el botón flotante ✨ (esquina inferior derecha)
3. Haz clic en el icono ⚙️ de configuración
4. Pega tu API key de OpenAI
5. Haz clic en "Guardar"

### Opción 2: Variables de entorno (Opcional)
1. Copia `.env.example` a `.env`
2. Añade tu API key: `VITE_OPENAI_API_KEY=sk-...`
3. Reinicia el servidor de desarrollo

**Obtener API key:** https://platform.openai.com/api-keys

**Ver documentación completa:** `ASISTENTE_IA.md`

## 📝 Próximas Mejoras Recomendadas

Ver documentos:
- `UX-UI-REVIEW-GOSTEAM.md` - Revisión completa de UX/UI (10,000+ palabras)
- `ASISTENTE_IA.md` - Documentación completa del asistente IA
- `CONTEXT.md` - Contexto técnico del proyecto

### Prioridad Alta
1. ✅ ~~Asistente IA funcional con OpenAI~~ (COMPLETADO)
2. ✅ ~~Navegación híbrida (Dashboard + QuickNav + Mobile)~~ (COMPLETADO)
3. Backend proxy para proteger API keys
4. Skeleton loading screens
5. Toast notifications

### Prioridad Media
6. Búsqueda semántica de proyectos con embeddings
7. Micro-interacciones mejoradas
8. Estados vacíos ilustrados
9. Animaciones sutiles
10. Modo voz para el asistente (speech-to-text)

## 🤝 Créditos

- **Plataforma:** GoSteam Evolution by EDELVIVES
- **Iconos:** Lucide React
- **Framework:** React + Vite
- **Estilos:** Tailwind CSS
- **Fuentes:** Google Fonts (Space Grotesk, Titillium Web)
