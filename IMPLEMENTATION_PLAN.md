# 🚀 GoSteam Evolution - Plan de Implementación

**Fecha:** 9 de diciembre, 2025
**Enfoque:** Desarrollo incremental por fases
**Stack:** React + Supabase + Tailwind CSS

---

## 📋 Resumen Ejecutivo

El proyecto se dividirá en **5 fases principales**:

1. **Setup + Auth** - Configuración de Supabase y autenticación
2. **Usuarios + Licencias** - Sistema de gestión de licencias B2B
3. **Clases** - Creación y gestión de clases escolares
4. **Proyectos** - Estructura de proyectos con fases y ejercicios
5. **Evaluación + Seguimiento** - Sistema de calificaciones y progreso

Cada fase es funcional e independiente, permitiendo testing continuo.

---

## 🎯 FASE 1: Setup + Autenticación (1-2 semanas)

### Objetivos
- Configurar proyecto Supabase
- Implementar autenticación multi-rol
- Crear pantallas de login/registro

### Tareas

#### Backend (Supabase)

1. **Crear proyecto en Supabase**
   - Nuevo proyecto: `gosteam-evolution`
   - Región: Europe (Frankfurt o Madrid)
   - Plan: Free tier inicialmente

2. **Configurar Auth**
   ```sql
   -- Habilitar providers
   - Email/Password ✓
   - Google OAuth (opcional para fase posterior)

   -- Configurar Email Templates
   - Confirmación de registro
   - Recuperación de contraseña
   - Invitación a profesor
   ```

3. **Crear tablas básicas**
   - `user_profiles`
   - `centros_educativos`
   - Aplicar RLS policies básicas

4. **Crear funciones helper**
   - `auth.user_role()`
   - `auth.user_centro()`
   - `auth.is_super_admin()`

#### Frontend (React)

1. **Instalar dependencias**
   ```bash
   npm install @supabase/supabase-js
   npm install react-router-dom
   npm install @tanstack/react-query
   npm install zustand
   ```

2. **Estructura de carpetas**
   ```
   src/
   ├── lib/
   │   └── supabase.js         # Cliente Supabase
   ├── hooks/
   │   ├── useAuth.js          # Hook de autenticación
   │   └── useUser.js          # Hook de perfil de usuario
   ├── contexts/
   │   └── AuthContext.jsx     # Contexto de autenticación
   ├── pages/
   │   ├── Login.jsx
   │   ├── Register.jsx
   │   ├── ForgotPassword.jsx
   │   └── Dashboard.jsx
   ├── components/
   │   ├── auth/
   │   │   ├── LoginForm.jsx
   │   │   ├── RegisterForm.jsx
   │   │   └── ProtectedRoute.jsx
   │   └── layout/
   │       ├── Header.jsx
   │       └── Sidebar.jsx
   └── utils/
       └── roles.js            # Utilidades de roles
   ```

3. **Componentes a crear**

   **LoginForm.jsx**
   ```jsx
   - Email input
   - Password input
   - "Recordarme" checkbox
   - "Olvidé mi contraseña" link
   - Botón "Iniciar sesión"
   - Link a registro
   ```

   **RegisterForm.jsx**
   ```jsx
   - Selector de rol (profesor/estudiante)
   - Nombre, apellidos
   - Email
   - Contraseña (con validación de fuerza)
   - Código de centro (si es profesor)
   - Aceptar términos
   - Botón "Crear cuenta"
   ```

   **ProtectedRoute.jsx**
   ```jsx
   - Verificar autenticación
   - Verificar rol permitido
   - Redirect a login si no autenticado
   - Redirect a "sin permisos" si rol incorrecto
   ```

4. **Estados globales (Zustand)**
   ```javascript
   // stores/authStore.js
   {
     user: null,
     profile: null,
     centro: null,
     isLoading: false,
     error: null,
     login: async (email, password) => {},
     logout: async () => {},
     register: async (userData) => {},
     refreshUser: async () => {}
   }
   ```

### Entregables Fase 1
- ✅ Usuario puede registrarse como profesor/estudiante
- ✅ Usuario puede iniciar sesión
- ✅ Sistema detecta rol y muestra UI apropiada
- ✅ Logout funcional
- ✅ Protección de rutas por rol

---

## 🎯 FASE 2: Usuarios + Licencias (2-3 semanas)

### Objetivos
- Sistema completo de licencias B2B
- Panel de super admin
- Panel de admin de centro
- Gestión de profesores

### Tareas

#### Backend

1. **Crear tablas de licencias**
   - `license_codes`
   - `license_pools`
   - Aplicar RLS policies

2. **Crear funciones de licencias**
   - `activate_license_code()`
   - `check_license_available()`
   - `consume_license()`
   - `generate_license_code()` (función para super_admin)

3. **Crear trigger de validación**
   ```sql
   -- Antes de crear usuario profesor, verificar licencias
   CREATE TRIGGER check_profesor_license
   BEFORE INSERT ON user_profiles
   FOR EACH ROW
   WHEN (NEW.role = 'profesor')
   EXECUTE FUNCTION validate_profesor_license();
   ```

#### Frontend

1. **Panel Super Admin** (`/super-admin`)

   **Componentes:**
   - `LicenseCodeGenerator.jsx`
     - Form: Número de profesores, número de alumnos
     - Opción: Fecha de expiración
     - Opción: Generar código único o múltiples
     - Display: Código generado (copiar al portapapeles)

   - `CentrosManagement.jsx`
     - Tabla de centros educativos
     - Ver licencias activas por centro
     - Ver uso de licencias
     - Búsqueda y filtrado

   - `LicenseCodesTable.jsx`
     - Listado de todos los códigos generados
     - Estado: Activado/Pendiente
     - Fecha de activación
     - Centro asociado
     - Filtros y búsqueda

   **Vistas:**
   ```
   /super-admin
   ├── /dashboard          # Estadísticas generales
   ├── /centros            # Gestión de centros
   ├── /licencias          # Generar y ver licencias
   └── /usuarios           # Ver todos los usuarios
   ```

2. **Panel Admin de Centro** (`/admin`)

   **Componentes:**
   - `ActivateLicenseForm.jsx`
     - Input: Código de licencia
     - Botón: Activar
     - Display: Confirmación y detalle de licencias añadidas

   - `LicensePoolDashboard.jsx`
     - Cards:
       - Total profesores / Usadas / Disponibles
       - Total alumnos / Usados / Disponibles
     - Progress bars visuales
     - Fecha de expiración destacada
     - Botón: "Solicitar más licencias" (contacto)

   - `ProfesoresManagement.jsx`
     - Tabla de profesores del centro
     - Ver clases de cada profesor
     - Botón: Invitar nuevo profesor
     - Botón: Desactivar profesor

   **Vistas:**
   ```
   /admin
   ├── /dashboard          # Resumen del centro
   ├── /licencias          # Gestión de licencias
   ├── /profesores         # Profesores del centro
   └── /estadisticas       # Datos del centro
   ```

3. **Flujo de registro mejorado**

   **Para Profesor:**
   ```
   1. Click "Registrarse como profesor"
   2. Form con código de centro
   3. Validación: ¿Centro existe?
   4. Validación: ¿Hay licencias disponibles?
   5. Si OK: Crear cuenta (pendiente aprobación de admin)
   6. Email a admin de centro para aprobar
   7. Admin aprueba → cuenta activada
   ```

   **Para Estudiante:**
   ```
   1. Click "Registrarse como estudiante"
   2. Form básico (nombre, email, contraseña)
   3. Cuenta creada (no consume licencia aún)
   4. Cuando se une a clase → consume licencia
   ```

### Entregables Fase 2
- ✅ Super admin puede generar códigos de licencia
- ✅ Admin de centro puede activar códigos
- ✅ Sistema valida licencias al crear usuarios
- ✅ Dashboard muestra uso de licencias
- ✅ No se puede crear profesor sin licencias disponibles

---

## 🎯 FASE 3: Clases (2-3 semanas)

### Objetivos
- Profesores pueden crear clases
- Estudiantes pueden unirse con código
- Vista de clase con miembros
- Asignación básica de proyectos

### Tareas

#### Backend

1. **Crear tablas**
   - `classes`
   - `class_members`
   - `class_projects`
   - Aplicar RLS policies

2. **Crear funciones**
   - `generate_class_code()` - Código único de 8 caracteres
   - `join_class_with_code()` - Estudiante se une con código
   - `remove_student_from_class()` - Liberar licencia de alumno

#### Frontend

1. **Vista Mis Clases** (ya existe mockup, mejorar)

   **Para Profesor:**

   **CreateClassModal.jsx**
   ```jsx
   Form:
   - Nombre de la clase
   - Nivel (dropdown): Infantil, Primaria, Secundaria, Bachillerato
   - Curso (dropdown dinámico según nivel)
   - Color (selector de 10 colores predefinidos)
   - Año escolar (default: actual)
   - Descripción (opcional, textarea)

   Validaciones:
   - Nombre requerido
   - Nivel y curso requeridos
   - Código se genera automáticamente al crear
   ```

   **ClassCard.jsx**
   ```jsx
   Display:
   - Color como borde o fondo
   - Nombre de la clase
   - Nivel y curso
   - Número de estudiantes
   - Código de acceso (con botón copiar)
   - Botón: "Ver clase"
   - Menú (3 puntos):
     - Editar
     - Compartir código
     - Archivar
     - Eliminar
   ```

   **ClassDetailView.jsx**
   ```jsx
   Tabs:
   1. Proyectos (organizados por trimestre - accordion)
   2. Estudiantes (tabla con nombre, email, fecha de unión)
   3. Configuración

   Header:
   - Nombre de la clase + código
   - Botones:
     - Asignar proyecto
     - Invitar estudiantes (compartir código)
     - Configuración

   Trimestre Accordion:
   - Trimestre 1 (expandible)
     - Proyecto 1: título, imagen, fechas, progreso
     - Proyecto 2: ...
   - Trimestre 2 (expandible)
   - Trimestre 3 (expandible)
   ```

   **Para Estudiante:**

   **JoinClassModal.jsx**
   ```jsx
   Form:
   - Input: Código de clase (8 caracteres)
   - Botón: "Unirse"

   Validación:
   - Código válido
   - Centro tiene licencias disponibles
   - No está ya en la clase

   Al unirse:
   - Consume 1 licencia de alumno
   - Aparece en su lista de clases
   ```

   **StudentClassCard.jsx**
   ```jsx
   Display:
   - Nombre de la clase + color
   - Nombre del profesor
   - Número de proyectos activos
   - Progreso general (%)
   - Botón: "Ver clase"
   ```

   **StudentClassDetailView.jsx**
   ```jsx
   Tabs:
   1. Proyectos (por trimestre)
   2. Calificaciones

   Proyectos:
   - Lista de proyectos asignados
   - Estado: No iniciado / En progreso / Completado
   - Progreso individual (barra)
   - Nota (si está evaluado)
   - Botón: "Continuar" o "Empezar"
   ```

2. **Componente: AsignarProyectoModal.jsx**
   ```jsx
   Steps:
   1. Seleccionar proyecto (de biblioteca o personalizados)
      - Buscador
      - Filtros (categoría, nivel)
      - Cards de proyectos

   2. Configurar asignación
      - Trimestre (1, 2, 3)
      - Fecha inicio (opcional)
      - Fecha fin (opcional)

   3. Confirmar
      - Resumen
      - Botón: "Asignar a la clase"
   ```

### Entregables Fase 3
- ✅ Profesor puede crear clases
- ✅ Código de clase generado automáticamente
- ✅ Estudiante puede unirse con código
- ✅ Lista de estudiantes en clase
- ✅ Profesor puede asignar proyectos de biblioteca
- ✅ Proyectos organizados por trimestre
- ✅ Estudiante ve proyectos asignados

---

## 🎯 FASE 4: Proyectos + Ejercicios (3-4 semanas)

### Objetivos
- Editor de proyectos personalizado
- Sistema de fases y ejercicios
- Preguntas abiertas y autoevaluables
- Recursos adjuntos

### Tareas

#### Backend

1. **Crear tablas**
   - `project_phases`
   - `project_exercises`
   - `exercise_questions`
   - `question_options`
   - `project_resources`
   - Aplicar RLS policies

2. **Configurar Supabase Storage**
   ```javascript
   // Buckets
   - project-images (public)
   - project-resources (private con RLS)
   - user-avatars (public)

   // Policies
   - Profesores pueden subir a project-resources
   - Cualquier usuario puede leer project-images
   ```

3. **Migrar proyectos existentes**
   ```sql
   -- Script para migrar los 76 proyectos del mockup
   -- Marcarlos como is_template = TRUE
   -- Asignar a super_admin como created_by
   ```

#### Frontend

1. **Editor de Proyecto** (`/proyectos/crear` o `/proyectos/:id/editar`)

   **ProjectEditorLayout.jsx**
   ```jsx
   Layout:
   - Sidebar izquierdo: Navegación entre fases
   - Área principal: Edición de contenido
   - Sidebar derecho: Configuración y recursos

   Tabs principales:
   1. Información general
   2. Fases del proyecto
   3. Recursos
   4. Configuración
   ```

   **ProjectInfoForm.jsx**
   ```jsx
   Form:
   - Título, descripción
   - Nivel educativo, curso
   - Número de sesiones
   - Categoría, área
   - ¿Necesita robot?
   - Imagen de portada (upload)
   - Idioma
   ```

   **PhaseEditor.jsx**
   ```jsx
   Components:
   - Lista de fases (drag & drop para reordenar)
   - Botón: "Añadir fase"

   Cada fase:
   - Título, descripción
   - Objetivos de aprendizaje
   - Materiales necesarios
   - Duración estimada
   - Lista de ejercicios
   - Botón: "Añadir ejercicio"
   ```

   **ExerciseEditor.jsx**
   ```jsx
   Form:
   - Título del ejercicio
   - Descripción
   - Tipo (dropdown):
     - Respuesta abierta
     - Opción múltiple
     - Verdadero/Falso
     - Completar espacios
     - Emparejar
     - Ordenar
   - ¿Es obligatorio?
   - Puntos que vale

   Según tipo, mostrar:

   [Respuesta Abierta]
   - Enunciado (rich text)
   - Pista (opcional)
   - Recursos adjuntos (imágenes, PDFs, videos, enlaces)

   [Opción Múltiple]
   - Pregunta
   - Opciones (mínimo 2, máximo 6)
     - Texto de la opción
     - ☑ Es correcta (checkbox)
     - Feedback específico (opcional)
   - ¿Múltiples respuestas correctas?

   [Verdadero/Falso]
   - Afirmación
   - Respuesta correcta (toggle)
   - Explicación

   [Completar Espacios]
   - Texto con espacios marcados: "La capital de España es ___"
   - Respuestas correctas (array)

   [Emparejar]
   - Columna A (términos)
   - Columna B (definiciones)
   - Relaciones correctas

   [Ordenar]
   - Lista de elementos
   - Orden correcto
   ```

   **ResourceManager.jsx**
   ```jsx
   Types:
   - PDF (upload a Supabase Storage)
   - Video (embed YouTube/Vimeo o upload)
   - Enlace externo
   - Imagen
   - Archivo (ZIP, etc.)

   Display:
   - Lista de recursos con preview
   - Drag & drop para subir
   - Botón: "Añadir recurso"
   - Por cada recurso:
     - Título, descripción
     - Tipo y preview
     - Asociar a fase específica o proyecto general
     - Botón: Eliminar
   ```

2. **Vista de Proyecto para Estudiante**

   **StudentProjectView.jsx**
   ```jsx
   Layout:
   - Header:
     - Título del proyecto
     - Progreso general (barra + porcentaje)
     - Calificación (si completado)

   - Sidebar izquierdo:
     - Lista de fases
     - Checkmark si completada
     - Indicador de fase actual

   - Área principal:
     - Contenido de la fase actual
     - Ejercicios de la fase
     - Botón: "Marcar fase como completada"
     - Botón: "Siguiente fase"
   ```

   **ExerciseDisplay.jsx**
   ```jsx
   Para cada tipo de ejercicio:

   [Respuesta Abierta]
   - Enunciado
   - Recursos (si hay)
   - Textarea para respuesta
   - Botón: "Guardar borrador"
   - Botón: "Enviar respuesta"
   - Estado: Enviado / Evaluando / Evaluado
   - Si evaluado: Feedback del profesor + nota

   [Autoevaluable]
   - Pregunta
   - Opciones interactivas (radio/checkbox/etc.)
   - Botón: "Comprobar respuesta"
   - Feedback inmediato (correcto/incorrecto)
   - Explicación
   - Puntuación obtenida
   ```

3. **Vista de Proyecto para Profesor**

   **ProfesorProjectDashboard.jsx**
   ```jsx
   Tabs:
   1. Visión general
   2. Respuestas por evaluar
   3. Estadísticas

   [Visión general]
   - Cards de estadísticas:
     - Estudiantes que han empezado
     - Estudiantes que han completado
     - Promedio de calificación
     - Ejercicios pendientes de evaluar
   - Tabla de estudiantes:
     - Nombre
     - Progreso (barra)
     - Última actividad
     - Nota actual
     - Botón: "Ver detalle"

   [Respuestas por evaluar]
   - Agrupadas por ejercicio
   - Contador de pendientes
   - Click en ejercicio:
     - Ver todas las respuestas de estudiantes
     - Evaluar en lote

   [Estadísticas]
   - Gráficos:
     - Distribución de notas
     - Ejercicios con más errores
     - Tiempo promedio por fase
   ```

   **EvaluarRespuestasView.jsx**
   ```jsx
   Para ejercicios de respuesta abierta:

   Layout:
   - Lista de estudiantes (sidebar)
   - Respuesta actual (área principal)
   - Form de evaluación (sidebar derecho)

   Por cada estudiante:
   - Nombre del estudiante
   - Respuesta (texto completo)
   - Recursos adjuntos (si los subieron)

   Form de evaluación:
   - Puntuación (0 - puntos_max)
   - Feedback (textarea)
   - Botón: "Guardar y siguiente"
   - Botón: "Volver a revisar"

   Navegación:
   - Anterior / Siguiente estudiante
   - Filtros: Todas / Pendientes / Evaluadas
   ```

### Entregables Fase 4
- ✅ Profesor puede crear proyecto personalizado desde cero
- ✅ Profesor puede duplicar proyecto de biblioteca y editarlo
- ✅ Editor de fases con drag & drop
- ✅ Editor de ejercicios con 6 tipos soportados
- ✅ Subir y gestionar recursos (PDFs, videos, imágenes)
- ✅ Estudiante ve proyecto con fases navegables
- ✅ Estudiante responde ejercicios
- ✅ Autoevaluación funciona para ejercicios compatibles
- ✅ Profesor evalúa respuestas abiertas
- ✅ Sistema calcula calificación automáticamente

---

## 🎯 FASE 5: Evaluación + Seguimiento (2-3 semanas)

### Objetivos
- Dashboard de seguimiento completo
- Sistema de notificaciones
- Exportar calificaciones
- Estadísticas avanzadas

### Tareas

#### Backend

1. **Crear tablas adicionales**
   - `notifications` (opcional)
   - `activity_log` (auditoría)

2. **Crear funciones de estadísticas**
   ```sql
   - get_class_statistics(class_id)
   - get_student_summary(student_id, class_project_id)
   - get_centro_statistics(centro_id)
   ```

3. **Crear vistas materializadas** (opcional para performance)
   ```sql
   CREATE MATERIALIZED VIEW class_progress_summary AS
   SELECT ... -- Agregados de progreso por clase
   ```

#### Frontend

1. **Dashboard de Estudiante** (`/estudiante/dashboard`)

   **StudentDashboard.jsx**
   ```jsx
   Cards superiores:
   - Clases activas (contador)
   - Proyectos en progreso
   - Proyectos completados
   - Promedio de calificaciones

   Secciones:
   - Proyectos recientes (cards)
   - Próximas fechas de entrega
   - Últimas calificaciones
   - Actividad reciente
   ```

2. **Dashboard de Profesor** (`/profesor/dashboard`)

   **ProfesorDashboard.jsx**
   ```jsx
   Cards superiores:
   - Clases activas
   - Total de estudiantes
   - Ejercicios por evaluar (badge destacado)
   - Proyectos asignados

   Secciones:
   - Clases (cards con progreso)
   - Tareas pendientes:
     - Evaluar respuestas (con contador)
     - Revisar entregas tardías
   - Actividad reciente de estudiantes
   ```

3. **Sistema de Notificaciones**

   **NotificationBell.jsx** (en Header)
   ```jsx
   - Icono de campana con badge (contador)
   - Dropdown con notificaciones recientes
   - Tipos de notificaciones:
     - Estudiante envió respuesta
     - Estudiante completó proyecto
     - Nuevo estudiante se unió a clase
     - Calificación recibida (para estudiante)
   - Click: Marcar como leída
   - Ver todas las notificaciones
   ```

   **NotificationsPage.jsx**
   ```jsx
   - Lista completa de notificaciones
   - Filtros: Todas / No leídas
   - Agrupadas por fecha
   - Click: Navegar al recurso relacionado
   ```

4. **Exportación de Datos**

   **ExportGradesButton.jsx**
   ```jsx
   Opciones:
   - Exportar a CSV
   - Exportar a Excel
   - Exportar a PDF (boletín)

   Configuración:
   - Elegir clase
   - Elegir trimestre o todo el año
   - Incluir estadísticas
   ```

5. **Estadísticas Avanzadas**

   **StatsView.jsx** (para admin de centro)
   ```jsx
   Métricas:
   - Uso de licencias en el tiempo (gráfico de línea)
   - Proyectos más utilizados (gráfico de barras)
   - Promedio de calificaciones por nivel
   - Engagement de estudiantes (actividad semanal)
   - Profesores más activos
   - Categorías de proyectos más populares

   Filtros:
   - Rango de fechas
   - Nivel educativo
   - Profesor específico
   ```

### Entregables Fase 5
- ✅ Dashboard personalizado por rol
- ✅ Notificaciones en tiempo real
- ✅ Exportar calificaciones a CSV/Excel/PDF
- ✅ Estadísticas avanzadas para admin de centro
- ✅ Gráficos de progreso y engagement
- ✅ Log de actividad para auditoría

---

## 📊 Componentes UI - Librería de Componentes

### Componentes Reutilizables

**Card.jsx**
```jsx
Variantes:
- default
- elevated (con sombra)
- outlined
- clickable (con hover)
```

**Button.jsx**
```jsx
Variantes:
- primary (gosteam-purple)
- secondary (outline)
- danger (red)
- success (green)
Tamaños: sm, md, lg
```

**Modal.jsx**
```jsx
Props:
- isOpen, onClose
- title
- children
- size (sm, md, lg, xl)
- footer (botones de acción)
```

**Badge.jsx**
```jsx
Para notificaciones, estados, contadores
Colores: primary, success, warning, danger, info
```

**ProgressBar.jsx**
```jsx
Props:
- percentage (0-100)
- color
- showLabel
- size (sm, md, lg)
```

**Accordion.jsx**
```jsx
Para trimestres, fases, FAQs
Expandible/colapsable
Múltiple o único abierto
```

**Tabs.jsx**
```jsx
Horizontal o vertical
Con contador en tab (ej: "Por evaluar (5)")
```

**Table.jsx**
```jsx
Props:
- columns (definición)
- data
- sortable
- pagination
- filters
```

**Select.jsx**
```jsx
Dropdown mejorado
Búsqueda interna
Multi-select
```

**FileUpload.jsx**
```jsx
Drag & drop
Vista previa
Progress bar de upload
Validación de tipo y tamaño
```

**RichTextEditor.jsx**
```jsx
Para descripciones, enunciados
Librería: TipTap o Quill
Formato: bold, italic, lists, links, imágenes
```

**DatePicker.jsx**
```jsx
Seleccionar fecha
Rango de fechas
Validaciones
```

**ColorPicker.jsx**
```jsx
10 colores predefinidos para clases
Display como círculos de color
```

---

## 🛣️ Rutas de la Aplicación

```
/
├── /login
├── /register
├── /forgot-password
├── /reset-password
│
├── /dashboard                    # Landing después de login (redirige según rol)
│
├── /super-admin                  # Solo super_admin
│   ├── /dashboard
│   ├── /centros
│   ├── /licencias
│   └── /usuarios
│
├── /admin                        # Solo admin_centro
│   ├── /dashboard
│   ├── /licencias
│   ├── /profesores
│   └── /estadisticas
│
├── /profesor                     # Solo profesor
│   ├── /dashboard
│   ├── /clases
│   │   ├── /:classId
│   │   │   ├── /proyectos
│   │   │   ├── /estudiantes
│   │   │   └── /configuracion
│   ├── /proyectos
│   │   ├── /crear
│   │   ├── /:projectId/editar
│   │   └── /:projectId/evaluar
│   └── /biblioteca              # Ver proyectos de biblioteca
│
├── /estudiante                   # Solo estudiante
│   ├── /dashboard
│   ├── /clases
│   │   └── /:classId
│   ├── /proyectos
│   │   └── /:projectId
│   └── /calificaciones
│
├── /biblioteca                   # Todos los roles
│   └── /:projectId
│
├── /perfil                       # Todos
│   ├── /editar
│   └── /configuracion
│
└── /notificaciones              # Todos
```

---

## 🎨 Guía de Estilo

### Colores (ya definidos en tailwind.config.js)
- Primary: `gosteam-purple` (#C83E7F)
- Amarillo: `gosteam-yellow` (#FBEB4E)
- Verde: `gosteam-green` (#8DB442)
- Azul: `gosteam-blue` (#49A0DE)

### Tipografía
- Headings: Space Grotesk
- Body: Titillium Web

### Espaciado
- Consistente uso de múltiplos de 4px (Tailwind default)

### Componentes
- Bordes redondeados: `rounded-lg` (8px) o `rounded-xl` (12px)
- Sombras: `shadow-md` por defecto, `shadow-xl` para modales
- Transiciones: `transition-all duration-300`

---

## ⚙️ Configuración del Proyecto

### Variables de Entorno (.env)

```bash
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# OpenAI (para asistente - opcional)
VITE_OPENAI_API_KEY=tu-openai-key

# App
VITE_APP_URL=http://localhost:3001
VITE_APP_NAME=GoSteam Evolution
```

### Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^5.8.0",
    "zustand": "^4.4.6",
    "lucide-react": "^0.454.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.2",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "vite": "^5.4.11",
    "tailwindcss": "^3.4.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## ✅ Testing

### Por Fase

**Fase 1:**
- [ ] Registro de profesor con código de centro
- [ ] Registro de estudiante
- [ ] Login y logout
- [ ] Rutas protegidas funcionan

**Fase 2:**
- [ ] Super admin genera código
- [ ] Admin de centro activa código
- [ ] Licencias se incrementan correctamente
- [ ] Validación al crear profesor sin licencias
- [ ] Dashboard muestra uso correcto

**Fase 3:**
- [ ] Crear clase genera código único
- [ ] Estudiante se une con código
- [ ] Asignar proyecto a clase
- [ ] Ver proyectos por trimestre

**Fase 4:**
- [ ] Crear proyecto personalizado
- [ ] Crear ejercicio de respuesta abierta
- [ ] Crear ejercicio autoevaluable
- [ ] Estudiante responde ejercicios
- [ ] Autoevaluación funciona correctamente
- [ ] Profesor evalúa respuesta abierta
- [ ] Calificación se calcula correctamente

**Fase 5:**
- [ ] Notificaciones se crean
- [ ] Dashboard muestra estadísticas correctas
- [ ] Exportar calificaciones funciona
- [ ] Gráficos se renderizan

---

## 📅 Timeline Estimado

| Fase | Duración | Acumulado |
|------|----------|-----------|
| 1. Setup + Auth | 1-2 semanas | 2 semanas |
| 2. Usuarios + Licencias | 2-3 semanas | 5 semanas |
| 3. Clases | 2-3 semanas | 8 semanas |
| 4. Proyectos + Ejercicios | 3-4 semanas | 12 semanas |
| 5. Evaluación + Seguimiento | 2-3 semanas | 15 semanas |
| **Buffer y Testing** | 2 semanas | **17 semanas** |

**Total estimado: ~4 meses** (trabajando a tiempo completo)

---

## 🚦 Próximos Pasos Inmediatos

1. **Crear proyecto en Supabase**
2. **Ejecutar scripts SQL de DATABASE_DESIGN.md**
3. **Configurar RLS policies de RLS_POLICIES.md**
4. **Instalar dependencias en el proyecto React**
5. **Crear estructura de carpetas**
6. **Configurar cliente de Supabase**
7. **Implementar Fase 1: Autenticación**

---

**¿Listo para empezar la implementación?** 🚀

