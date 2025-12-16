# 🗄️ GoSteam Evolution - Diseño de Base de Datos

**Fecha:** 9 de diciembre, 2025
**Backend:** Supabase (PostgreSQL + Auth + Storage)
**Sistema:** Gestión educativa STEAM con licencias B2B

---

## 📊 Diagrama de Entidades (Relaciones)

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
│  - id (uuid)    │
│  - email        │
│  - role         │
└────────┬────────┘
         │
         ├──────────────────────────────┬──────────────────┐
         │                              │                  │
┌────────▼──────────┐      ┌───────────▼──────┐   ┌──────▼────────┐
│ centros_educativos│      │  license_codes   │   │    classes    │
│ - id              │◄─────┤  - id            │   │ - id          │
│ - nombre          │      │  - code          │   │ - nombre      │
│ - admin_id (fk)   │      │  - centro_id(fk) │   │ - profesor_id │
│ - direccion       │      │  - num_profesores│   │ - nivel       │
└─────────┬─────────┘      │  - num_alumnos   │   │ - curso       │
          │                │  - activated_at  │   │ - color       │
          │                └──────────────────┘   │ - codigo      │
          │                                       │ - año_escolar │
┌─────────▼──────────┐                           └───────┬───────┘
│  license_pools     │                                   │
│ - id               │                           ┌───────▼────────┐
│ - centro_id (fk)   │                           │ class_members  │
│ - total_profesores │                           │ - id           │
│ - total_alumnos    │                           │ - class_id(fk) │
│ - used_profesores  │                           │ - user_id (fk) │
│ - used_alumnos     │                           │ - role         │
│ - expiry_date      │                           │ - joined_at    │
└────────────────────┘                           └────────────────┘

┌──────────────────┐       ┌────────────────────┐
│    projects      │       │  class_projects    │
│ - id             │◄──────┤ - id               │
│ - title          │       │ - class_id (fk)    │
│ - description    │       │ - project_id (fk)  │
│ - level          │       │ - trimestre (1,2,3)│
│ - curso          │       │ - fecha_inicio     │
│ - sessions       │       │ - fecha_fin        │
│ - category       │       │ - created_at       │
│ - created_by(fk) │       └──────────┬─────────┘
│ - is_template    │                  │
│ - parent_id (fk) │          ┌───────▼──────────┐
└────────┬─────────┘          │student_progress  │
         │                    │ - id             │
         │                    │ - class_proj(fk) │
┌────────▼──────────┐         │ - student_id(fk) │
│ project_phases    │         │ - phase_id (fk)  │
│ - id              │         │ - completed      │
│ - project_id (fk) │         │ - started_at     │
│ - title           │         │ - completed_at   │
│ - description     │         └──────────────────┘
│ - order           │
│ - duration_mins   │
└────────┬──────────┘
         │
┌────────▼──────────┐
│ project_exercises │
│ - id              │
│ - phase_id (fk)   │
│ - title           │
│ - type (open/auto)│
│ - order           │
│ - points          │
└────────┬──────────┘
         │
         ├─────────────────────┐
         │                     │
┌────────▼──────────┐  ┌───────▼──────────┐
│ exercise_questions│  │ student_answers  │
│ - id              │  │ - id             │
│ - exercise_id(fk) │  │ - exercise_id(fk)│
│ - question_text   │  │ - student_id (fk)│
│ - question_type   │  │ - answer_text    │
│ - correct_answer  │  │ - is_correct     │
│ - order           │  │ - score          │
└────────┬──────────┘  │ - submitted_at   │
         │             │ - evaluated_at   │
┌────────▼──────────┐  │ - feedback       │
│ question_options  │  └──────────────────┘
│ - id              │
│ - question_id(fk) │
│ - option_text     │
│ - is_correct      │
│ - order           │
└───────────────────┘
```

---

## 🏗️ SQL - Creación de Tablas

### 1. Extensiones y Setup Inicial

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos ENUM
CREATE TYPE user_role AS ENUM ('super_admin', 'admin_centro', 'profesor', 'estudiante');
CREATE TYPE nivel_educativo AS ENUM ('infantil', 'primaria', 'secundaria', 'bachillerato');
CREATE TYPE trimestre AS ENUM ('1', '2', '3');
CREATE TYPE exercise_type AS ENUM ('open', 'multiple_choice', 'true_false', 'fill_blank', 'matching', 'ordering');
```

---

### 2. Tabla: centros_educativos

```sql
CREATE TABLE centros_educativos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  telefono VARCHAR(20),
  email_contacto VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_centros_admin ON centros_educativos(admin_id);
```

---

### 3. Tabla: license_codes (Códigos de activación)

```sql
CREATE TABLE license_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  centro_id UUID REFERENCES centros_educativos(id) ON DELETE CASCADE,
  num_profesores INTEGER NOT NULL CHECK (num_profesores > 0),
  num_alumnos INTEGER NOT NULL CHECK (num_alumnos > 0),
  activated BOOLEAN DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  activated_by UUID REFERENCES auth.users(id),
  expiry_date DATE,
  created_by UUID REFERENCES auth.users(id), -- super_admin que lo generó
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_license_codes_code ON license_codes(code);
CREATE INDEX idx_license_codes_centro ON license_codes(centro_id);
```

---

### 4. Tabla: license_pools (Pool de licencias activas por centro)

```sql
CREATE TABLE license_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  centro_id UUID UNIQUE REFERENCES centros_educativos(id) ON DELETE CASCADE,
  total_profesores INTEGER NOT NULL DEFAULT 0,
  total_alumnos INTEGER NOT NULL DEFAULT 0,
  used_profesores INTEGER NOT NULL DEFAULT 0,
  used_alumnos INTEGER NOT NULL DEFAULT 0,
  expiry_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_profesores CHECK (used_profesores <= total_profesores),
  CONSTRAINT check_alumnos CHECK (used_alumnos <= total_alumnos)
);

CREATE INDEX idx_license_pools_centro ON license_pools(centro_id);
```

---

### 5. Tabla: user_profiles (Extensión de auth.users)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  centro_id UUID REFERENCES centros_educativos(id) ON DELETE SET NULL,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  role user_role NOT NULL,
  avatar_url TEXT,
  telefono VARCHAR(20),
  bio TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_centro ON user_profiles(centro_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
```

---

### 6. Tabla: classes

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  profesor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  centro_id UUID REFERENCES centros_educativos(id) ON DELETE CASCADE,
  nivel nivel_educativo NOT NULL,
  curso VARCHAR(20) NOT NULL, -- "3 años", "1º", "2º", etc.
  color VARCHAR(7) NOT NULL, -- Hex color: #FF5733
  codigo VARCHAR(8) UNIQUE NOT NULL, -- Código de acceso tipo "ABC12XYZ"
  año_escolar VARCHAR(9) NOT NULL, -- "2025/2026"
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_profesor ON classes(profesor_id);
CREATE INDEX idx_classes_centro ON classes(centro_id);
CREATE INDEX idx_classes_codigo ON classes(codigo);
CREATE INDEX idx_classes_año ON classes(año_escolar);
```

---

### 7. Tabla: class_members

```sql
CREATE TABLE class_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('profesor', 'estudiante')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(class_id, user_id)
);

CREATE INDEX idx_class_members_class ON class_members(class_id);
CREATE INDEX idx_class_members_user ON class_members(user_id);
```

---

### 8. Tabla: projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subtitle TEXT,
  level nivel_educativo,
  curso VARCHAR(20),
  sessions INTEGER,
  language VARCHAR(50) DEFAULT 'Castellano',
  category VARCHAR(100),
  area VARCHAR(100), -- Matemáticas, Ciencias, etc.
  robot_needed BOOLEAN DEFAULT FALSE,
  image_url TEXT,

  -- Para proyectos creados por profesores
  created_by UUID REFERENCES auth.users(id),
  is_template BOOLEAN DEFAULT FALSE, -- TRUE si es de la biblioteca oficial
  parent_id UUID REFERENCES projects(id), -- Si es duplicado de otro proyecto
  centro_id UUID REFERENCES centros_educativos(id), -- NULL si es template oficial

  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_is_template ON projects(is_template);
CREATE INDEX idx_projects_centro ON projects(centro_id);
CREATE INDEX idx_projects_category ON projects(category);
```

---

### 9. Tabla: project_phases (Fases/Sesiones del proyecto)

```sql
CREATE TABLE project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objectives TEXT, -- Objetivos de aprendizaje
  materials TEXT, -- Materiales necesarios
  order_index INTEGER NOT NULL,
  duration_mins INTEGER, -- Duración estimada en minutos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_phases_project ON project_phases(project_id);
CREATE INDEX idx_project_phases_order ON project_phases(project_id, order_index);
```

---

### 10. Tabla: project_exercises

```sql
CREATE TABLE project_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES project_phases(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type exercise_type NOT NULL,
  order_index INTEGER NOT NULL,
  points INTEGER DEFAULT 10, -- Puntos que vale el ejercicio
  required BOOLEAN DEFAULT TRUE, -- Si es obligatorio para completar la fase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_exercises_phase ON project_exercises(phase_id);
CREATE INDEX idx_project_exercises_order ON project_exercises(phase_id, order_index);
```

---

### 11. Tabla: exercise_questions

```sql
CREATE TABLE exercise_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES project_exercises(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type exercise_type NOT NULL,
  hint TEXT, -- Pista opcional
  explanation TEXT, -- Explicación de la respuesta correcta
  order_index INTEGER NOT NULL,
  points INTEGER DEFAULT 1,

  -- Para preguntas autoevaluables
  correct_answer TEXT, -- Para true/false, fill_blank, etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exercise_questions_exercise ON exercise_questions(exercise_id);
```

---

### 12. Tabla: question_options (Para preguntas de opción múltiple)

```sql
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES exercise_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  feedback TEXT -- Feedback específico para esta opción
);

CREATE INDEX idx_question_options_question ON question_options(question_id);
```

---

### 13. Tabla: project_resources (PDFs, videos, enlaces)

```sql
CREATE TABLE project_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES project_phases(id) ON DELETE CASCADE, -- Opcional: recurso específico de una fase
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'pdf', 'video', 'link', 'image', 'file'
  url TEXT, -- URL externa o ruta en Supabase Storage
  file_size BIGINT, -- En bytes
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_resources_project ON project_resources(project_id);
CREATE INDEX idx_project_resources_phase ON project_resources(phase_id);
```

---

### 14. Tabla: class_projects (Asignación de proyecto a clase)

```sql
CREATE TABLE class_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  trimestre trimestre NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  assigned_by UUID REFERENCES auth.users(id), -- Profesor que lo asignó
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(class_id, project_id, trimestre)
);

CREATE INDEX idx_class_projects_class ON class_projects(class_id);
CREATE INDEX idx_class_projects_project ON class_projects(project_id);
CREATE INDEX idx_class_projects_trimestre ON class_projects(trimestre);
```

---

### 15. Tabla: student_progress (Progreso del estudiante en fases)

```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_project_id UUID REFERENCES class_projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES project_phases(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  UNIQUE(class_project_id, student_id, phase_id)
);

CREATE INDEX idx_student_progress_class_project ON student_progress(class_project_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
```

---

### 16. Tabla: student_answers (Respuestas de estudiantes)

```sql
CREATE TABLE student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES project_exercises(id) ON DELETE CASCADE,
  question_id UUID REFERENCES exercise_questions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_project_id UUID REFERENCES class_projects(id) ON DELETE CASCADE,

  -- Respuesta
  answer_text TEXT, -- Respuesta abierta o selección
  selected_options UUID[], -- Array de option_ids para multiple choice

  -- Evaluación automática
  is_correct BOOLEAN,
  auto_score DECIMAL(5,2), -- Puntuación automática

  -- Evaluación manual (para respuestas abiertas)
  manual_score DECIMAL(5,2),
  feedback TEXT, -- Retroalimentación del profesor
  evaluated_by UUID REFERENCES auth.users(id),
  evaluated_at TIMESTAMPTZ,

  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(exercise_id, question_id, student_id, class_project_id)
);

CREATE INDEX idx_student_answers_student ON student_answers(student_id);
CREATE INDEX idx_student_answers_exercise ON student_answers(exercise_id);
CREATE INDEX idx_student_answers_class_project ON student_answers(class_project_id);
```

---

### 17. Tabla: student_project_grades (Calificación final del proyecto)

```sql
CREATE TABLE student_project_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_project_id UUID REFERENCES class_projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  total_points DECIMAL(6,2),
  earned_points DECIMAL(6,2),
  percentage DECIMAL(5,2),
  grade VARCHAR(10), -- "10", "9", "Sobresaliente", etc.

  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(class_project_id, student_id)
);

CREATE INDEX idx_student_project_grades_student ON student_project_grades(student_id);
CREATE INDEX idx_student_project_grades_class_project ON student_project_grades(class_project_id);
```

---

## 🔐 Funciones de PostgreSQL

### 1. Generar código de clase único

```sql
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sin caracteres confusos
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;

  -- Verificar que no existe
  IF EXISTS (SELECT 1 FROM classes WHERE codigo = result) THEN
    RETURN generate_class_code(); -- Recursivo si existe
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. Activar código de licencia

```sql
CREATE OR REPLACE FUNCTION activate_license_code(
  p_code VARCHAR(50),
  p_centro_id UUID,
  p_activated_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_license RECORD;
BEGIN
  -- Buscar el código
  SELECT * INTO v_license FROM license_codes
  WHERE code = p_code AND activated = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Código de licencia inválido o ya activado';
  END IF;

  -- Marcar como activado
  UPDATE license_codes
  SET activated = TRUE,
      activated_at = NOW(),
      activated_by = p_activated_by,
      centro_id = p_centro_id
  WHERE id = v_license.id;

  -- Actualizar o crear pool de licencias
  INSERT INTO license_pools (centro_id, total_profesores, total_alumnos, expiry_date)
  VALUES (p_centro_id, v_license.num_profesores, v_license.num_alumnos, v_license.expiry_date)
  ON CONFLICT (centro_id) DO UPDATE
  SET total_profesores = license_pools.total_profesores + v_license.num_profesores,
      total_alumnos = license_pools.total_alumnos + v_license.num_alumnos,
      expiry_date = GREATEST(license_pools.expiry_date, v_license.expiry_date),
      updated_at = NOW();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

### 3. Verificar licencias disponibles

```sql
CREATE OR REPLACE FUNCTION check_license_available(
  p_centro_id UUID,
  p_type VARCHAR(20) -- 'profesor' o 'alumno'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_pool RECORD;
BEGIN
  SELECT * INTO v_pool FROM license_pools WHERE centro_id = p_centro_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Verificar expiración
  IF v_pool.expiry_date < CURRENT_DATE THEN
    RETURN FALSE;
  END IF;

  -- Verificar disponibilidad
  IF p_type = 'profesor' THEN
    RETURN v_pool.used_profesores < v_pool.total_profesores;
  ELSIF p_type = 'alumno' THEN
    RETURN v_pool.used_alumnos < v_pool.total_alumnos;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

### 4. Consumir licencia

```sql
CREATE OR REPLACE FUNCTION consume_license(
  p_centro_id UUID,
  p_type VARCHAR(20) -- 'profesor' o 'alumno'
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT check_license_available(p_centro_id, p_type) THEN
    RAISE EXCEPTION 'No hay licencias de % disponibles', p_type;
  END IF;

  IF p_type = 'profesor' THEN
    UPDATE license_pools
    SET used_profesores = used_profesores + 1,
        updated_at = NOW()
    WHERE centro_id = p_centro_id;
  ELSIF p_type = 'alumno' THEN
    UPDATE license_pools
    SET used_alumnos = used_alumnos + 1,
        updated_at = NOW()
    WHERE centro_id = p_centro_id;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

### 5. Calcular calificación de proyecto

```sql
CREATE OR REPLACE FUNCTION calculate_project_grade(
  p_class_project_id UUID,
  p_student_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_total_points DECIMAL(6,2) := 0;
  v_earned_points DECIMAL(6,2) := 0;
  v_percentage DECIMAL(5,2);
BEGIN
  -- Sumar puntos totales de todos los ejercicios
  SELECT COALESCE(SUM(pe.points), 0) INTO v_total_points
  FROM project_exercises pe
  INNER JOIN project_phases pp ON pe.phase_id = pp.id
  INNER JOIN class_projects cp ON pp.project_id = cp.project_id
  WHERE cp.id = p_class_project_id;

  -- Sumar puntos obtenidos
  SELECT COALESCE(SUM(COALESCE(sa.manual_score, sa.auto_score, 0)), 0) INTO v_earned_points
  FROM student_answers sa
  WHERE sa.class_project_id = p_class_project_id
    AND sa.student_id = p_student_id;

  -- Calcular porcentaje
  IF v_total_points > 0 THEN
    v_percentage := (v_earned_points / v_total_points) * 100;
  ELSE
    v_percentage := 0;
  END IF;

  -- Actualizar o insertar calificación
  INSERT INTO student_project_grades (
    class_project_id, student_id, total_points, earned_points, percentage
  )
  VALUES (p_class_project_id, p_student_id, v_total_points, v_earned_points, v_percentage)
  ON CONFLICT (class_project_id, student_id) DO UPDATE
  SET total_points = v_total_points,
      earned_points = v_earned_points,
      percentage = v_percentage,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 Triggers

### 1. Actualizar updated_at automáticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_centros_updated_at BEFORE UPDATE ON centros_educativos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. Recalcular calificación cuando se evalúa respuesta

```sql
CREATE OR REPLACE FUNCTION trigger_recalculate_grade()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_project_grade(NEW.class_project_id, NEW.student_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_grade_on_answer_update
AFTER INSERT OR UPDATE ON student_answers
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_grade();
```

---

## 📝 Notas de Implementación

### 1. Datos Iniciales
- Los 76 proyectos actuales se migran como `is_template = TRUE`
- Crear usuario super_admin inicial manualmente
- Definir los 10 colores predefinidos para clases en el frontend

### 2. Supabase Storage
Crear buckets:
- `avatars` - Fotos de perfil (público)
- `project-images` - Imágenes de proyectos (público)
- `project-resources` - PDFs, archivos (privado con RLS)

### 3. Índices Adicionales Recomendados
- Índice compuesto en `class_projects(class_id, trimestre)` para queries frecuentes
- Índice en `student_answers(student_id, class_project_id)` para dashboard de estudiante

### 4. Validaciones a Nivel de Aplicación
- Validar formato de email
- Validar que el código de clase tenga 8 caracteres
- Validar que los colores sean hex válidos
- Validar rangos de fechas

---

**Siguiente paso:** Diseñar las políticas de Row Level Security (RLS)

