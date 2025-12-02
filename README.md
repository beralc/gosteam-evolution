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

### Diseño Gráfico
- ✅ Tipografía: **Space Grotesk** (títulos) + **Titillium Web** (cuerpo)
- ✅ Color de Creatividad cambiado de amarillo a ámbar (#F59E0B)
- ✅ Iconos actualizados: `Sparkles` para STEAM, `Palette` para Creatividad
- ✅ Cards con sombras multicapa y borde púrpura en hover
- ✅ Footer con fondo negro y franja de acento multicolor
- ✅ Logo a color en header, logo blanco en footer

### UX/UI
- ✅ Filtrado instantáneo en Biblioteca
- ✅ Navegación mejorada con botón Home
- ✅ Asistente chatbot con scroll personalizado
- ✅ Cards con transición de elevación
- ✅ Categorías con gradientes en Dashboard
- ✅ Mejor jerarquía visual de información

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
- 6 proyectos iniciales
- 50 proyectos adicionales (10 por categoría)
- Filtros funcionales por:
  - Etapa educativa
  - Área temática
  - Necesidad de robot

## 🔧 Comandos Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## 📝 Próximas Mejoras Recomendadas

Ver documentos:
- `UX-UI-REVIEW-GOSTEAM.md` - Revisión completa de UX/UI
- Análisis de diseño gráfico profesional (output del agente)

### Prioridad Alta
1. Implementar bottom sheet en móvil para el asistente
2. Añadir navegación por teclado y ARIA labels
3. Skeleton loading screens
4. Toast notifications

### Prioridad Media
5. Micro-interacciones mejoradas
6. Estados vacíos ilustrados
7. Animaciones sutiles

## 🤝 Créditos

- **Plataforma:** GoSteam Evolution by EDELVIVES
- **Iconos:** Lucide React
- **Framework:** React + Vite
- **Estilos:** Tailwind CSS
- **Fuentes:** Google Fonts (Space Grotesk, Titillium Web)
