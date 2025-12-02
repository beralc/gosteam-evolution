# 🎯 GoSteam Evolution - Contexto del Proyecto

**Fecha de última actualización:** 2 de diciembre, 2025
**Desarrollador:** beralc
**Plataforma:** GoSteam Evolution by Edelvives

---

## 📝 Resumen del Proyecto

Mockup completo de la plataforma educativa GoSteam para gestión de proyectos STEAM dirigido a docentes españoles. Incluye más de 70 proyectos organizados por categorías, sistema de filtros, asistente AI conversacional, y diseño responsive.

---

## 🎨 Identidad Visual

### Colores de Marca (Oficiales)
```css
Rosa/Magenta (Primario): #C83E7F - rgb(200, 62, 127)
Amarillo (Resaltados):   #FBEB4E - rgb(251, 235, 78) ⭐
Verde:                   #8DB442 - rgb(141, 180, 66)
Azul:                    #49A0DE - rgb(73, 160, 222)
```

### Tipografía
- **Títulos:** Space Grotesk (500, 600, 700)
- **Cuerpo:** Titillium Web (400, 600, 700)
- **Fuente:** Google Fonts

### Footer
- **Fondo:** Negro (#000000)
- **Logo:** Blanco (gosteam_white-logo.svg)
- **Franja:** Gradiente con los 4 colores de marca

---

## 🗂️ Estructura del Proyecto

```
horizonte_talento/
├── src/
│   ├── App.jsx              # Componente principal (770+ líneas)
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globales + animaciones
├── public/
│   ├── gosteam_color-logo.87f8073e.svg  # Logo color (header)
│   ├── gosteam_white-logo.svg           # Logo blanco (footer)
│   └── logo.webp
├── package.json             # Dependencias
├── vite.config.js           # Vite config (puerto 3000)
├── tailwind.config.js       # Colores personalizados GoSteam
├── vercel.json              # Config deployment Vercel
├── README.md                # Documentación principal
├── MEJORAS_IMPLEMENTADAS.md # Lista de mejoras aplicadas
├── ACTUALIZACION_COLORES.md # Guía técnica de colores
└── UX-UI-REVIEW-GOSTEAM.md  # Análisis UX/UI (10,000+ palabras)
```

---

## 🚀 Stack Tecnológico

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.11
- **Estilos:** Tailwind CSS 3.4.15
- **Iconos:** Lucide React 0.454.0
- **Lenguaje:** JavaScript (JSX)

### Deployment
- **GitHub:** https://github.com/beralc/gosteam-evolution
- **Platform:** Vercel (recomendado)
- **Branch:** main

---

## 📊 Contenido del Mockup

### Datos de Prueba
- **Total de proyectos:** 76 proyectos
- **Proyectos iniciales:** 6
- **Proyectos adicionales:** 70 (10 por categoría)

### Categorías (5)
1. **STEAM (Programación y robótica)** - Rosa #C83E7F
2. **Creatividad** - Amarillo #FBEB4E
3. **IA** - Azul #49A0DE
4. **Ciudadanía digital** - Verde #8DB442
5. **Cultura científica** - Azul #49A0DE

### Vistas Principales
1. **Dashboard** - 4 bloques principales (Mis Clases, Biblioteca, Recursos, En tu casa)
2. **Biblioteca** - Catálogo filtrable de 70+ proyectos
3. **Mis Clases** - Gestión de clases (mockup básico)
4. **Recursos** - Placeholder
5. **En tu casa** - Placeholder

### Sistema de Filtros (Biblioteca)
- **Por Etapa:** Educación Infantil, Primaria, Secundaria, Bachillerato
- **Por Área:** Matemáticas, Lenguaje, Ciencias, Tecnología, Artes
- **Por Robot:** Con Robot / Sin Robot
- **Filtrado:** Instantáneo (sin botón "Aplicar")

### Asistente AI
- **Ubicación:** Panel lateral derecho (sidebar)
- **Ancho:** 384px (w-96) en desktop, full screen en móvil
- **Funcionalidad:** Chat conversacional con quick replies
- **Iconos:** Sparkles (Lucide)
- **Features:**
  - Entrada de texto
  - Botones de voz y upload (UI only)
  - Historial de conversación
  - Quick reply buttons
  - Scroll personalizado (rosa)

---

## 🎨 Componentes Clave en App.jsx

### ProjectCard
- Props: project object
- Features: Imagen, título, nivel, sesiones, idioma, docentes
- Hover: Elevación + borde rosa
- Shadow: Multicapa mejorada

### FilterPanel
- Ubicación: Sidebar izquierdo en Biblioteca
- Tipo: Tags seleccionables (toggle)
- Estado: Activo = fondo rosa, texto blanco

### AssistantChatbot
- Tipo: Sidebar modal
- Estados: open/closed
- Transiciones: transform translate-x

### DashboardBlocksView
- Layout: Grid 4 bloques
- Colores: Gradientes por bloque
- Hover: Scale 1.05

### BibliotecaView
- Layout: Grid responsive (2-4 columnas)
- Filtros: Panel lateral + categorías superiores
- Proyectos: Cards filtradas dinámicamente

---

## 🔧 Comandos Importantes

### Desarrollo
```bash
npm install              # Instalar dependencias
npm run dev              # Servidor desarrollo (puerto 3000)
npm run build            # Build para producción
npm run preview          # Preview del build
```

### Git
```bash
git status               # Ver estado
git add .                # Añadir cambios
git commit -m "mensaje"  # Commit
git push                 # Push a GitHub
```

### GitHub CLI
```bash
gh auth status           # Ver autenticación
gh repo view             # Ver info del repo
gh repo view --web       # Abrir en browser
```

---

## 📋 Estado Actual del Proyecto

### ✅ Completado
- [x] Setup inicial (React + Vite + Tailwind)
- [x] 70+ proyectos mock con datos completos
- [x] Sistema de filtros funcional
- [x] Asistente AI con conversaciones
- [x] Navegación completa (Dashboard → Biblioteca)
- [x] Diseño responsive
- [x] Colores de marca implementados
- [x] Tipografía Titillium Web + Space Grotesk
- [x] Footer negro con franja multicolor
- [x] Cards con hover effects mejorados
- [x] Logos correctos (color/blanco)
- [x] Repositorio en GitHub
- [x] Configuración Vercel lista

### 🚧 Pendientes (Recomendaciones de Expertos)

#### Prioridad Alta
- [ ] Chatbot: Bottom sheet en móvil (en lugar de sidebar)
- [ ] Skeleton loading screens
- [ ] Toast notifications para feedback
- [ ] Navegación por teclado completa (Tab index)
- [ ] ARIA labels para accesibilidad

#### Prioridad Media
- [ ] Micro-interacciones mejoradas
- [ ] Estados vacíos ilustrados
- [ ] Animaciones sutiles
- [ ] Panel de filtros persistente en desktop

#### Prioridad Baja
- [ ] Glassmorphism en modales
- [ ] Sistema de animaciones completo
- [ ] Design system documentado

---

## 🌐 URLs Importantes

- **GitHub Repo:** https://github.com/beralc/gosteam-evolution
- **Vercel Deploy:** (Pendiente - configurar en https://vercel.com)
- **Google Fonts:** https://fonts.google.com/specimen/Titillium+Web
- **Lucide Icons:** https://lucide.dev/icons/

---

## 📚 Documentos de Referencia

### En el Repositorio
1. **README.md** - Instalación y uso
2. **MEJORAS_IMPLEMENTADAS.md** - Changelog visual
3. **ACTUALIZACION_COLORES.md** - Guía técnica de colores
4. **UX-UI-REVIEW-GOSTEAM.md** - Análisis UX/UI completo (10,000+ palabras)
5. **CONTEXT.md** - Este archivo

### Externos
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev

---

## 🎯 Próximos Pasos para Deployment

### 1. Vercel (Recomendado)
```
1. Ir a: https://vercel.com/login
2. Conectar con GitHub
3. Importar: gosteam-evolution
4. Deploy automático (detecta Vite)
5. URL: gosteam-evolution.vercel.app
```

### 2. Configuración Automática
- Framework: Vite (auto-detectado)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Deploy Automático
Cada `git push` a main despliega automáticamente.

---

## 🐛 Troubleshooting

### Problema: Colores no se aplican
**Solución:**
```bash
# Limpiar cache y rebuild
rm -rf node_modules dist
npm install
npm run dev
```

### Problema: Fuentes no cargan
**Solución:** Verificar conexión a Google Fonts en `index.html`

### Problema: Imágenes no cargan
**Solución:**
- Logos están en `/public/`
- Placeholders usan `placehold.co`
- Verificar URLs en navegador

### Problema: Git push falla
**Solución:**
```bash
git remote -v  # Verificar remote
gh auth status # Verificar autenticación
```

---

## 💡 Notas Técnicas

### Paleta Tailwind Personalizada
Los colores están en `tailwind.config.js` bajo `extend.colors`:
- `gosteam.*` - Colores de marca
- `category-*` - Colores por categoría
- `gosteam-purple.*` - Alias de compatibilidad (ahora apunta a rosa)

### Componentes sin Backend
Este es un mockup estático. NO hay:
- API calls
- Base de datos
- Autenticación real
- Persistencia de datos

Los datos están hardcoded en `App.jsx`.

### Responsive Breakpoints (Tailwind)
```
sm: 640px   - Tablet pequeño
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Desktop grande
```

---

## 🔐 Accesos y Credenciales

**GitHub:**
- Usuario: beralc
- Repo: gosteam-evolution
- Branch: main

**Vercel:**
- (Pendiente configuración)
- Conectar con cuenta GitHub de beralc

---

## 📞 Contacto y Recursos

**Desarrollado con:**
- Claude Code by Anthropic
- https://claude.com/claude-code

**Agentes Especializados Utilizados:**
- ui-ux-design-expert (Revisión UX/UI)
- graphic-design-consultant (Diseño gráfico)

**Documentos de Agentes:**
- `.claude/agents/ui-ux-design-expert.md`
- `.claude/agents/graphic-design-consultant.md`
- `.claude/agents/react-expert-dev.md`

---

## 🎨 Detalles de Diseño Específicos

### Cards de Proyecto
```css
/* Shadow Multicapa */
shadow-md:
  0 1px 3px rgba(0,0,0,0.08),
  0 1px 2px rgba(0,0,0,0.04)

shadow-xl (hover):
  0 10px 25px rgba(200,62,127,0.12),
  0 6px 12px rgba(200,62,127,0.08)

/* Transición */
transition-all duration-300
hover:-translate-y-1
hover:border-gosteam-purple
```

### Botón Asistente Flotante
```css
bottom-6 right-6
w-16 h-16
bg-gosteam-purple
rounded-full
shadow-2xl
hover:scale-110
```

### Footer Franja
```javascript
linear-gradient(to right,
  #C83E7F 0%,    // Rosa
  #FBEB4E 33%,   // Amarillo
  #8DB442 66%,   // Verde
  #49A0DE 100%   // Azul
)
height: 8px (h-2)
```

---

## ⚠️ Importante para Retomar Sesión

### Comandos de Verificación Rápida
```bash
cd /Users/bernardomorales/Desktop/horizonte_talento
git status
npm run dev
gh repo view --web
```

### Estado del Código
- **Último commit:** "Add Vercel deployment configuration"
- **Branch:** main
- **Remote:** origin (GitHub)
- **Archivos totales:** 23 tracked

### Quick Start para Nueva Sesión
```bash
# 1. Navegar al proyecto
cd /Users/bernardomorales/Desktop/horizonte_talento

# 2. Ver estado
git status

# 3. Si hay cambios, commit
git add .
git commit -m "Descripción de cambios"
git push

# 4. Iniciar desarrollo
npm run dev
```

---

**Fin del Contexto** ✅

Este archivo contiene todo lo necesario para retomar el proyecto en cualquier momento.
