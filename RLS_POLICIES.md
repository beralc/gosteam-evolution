# 🔐 GoSteam Evolution - Row Level Security (RLS) Policies

**Backend:** Supabase PostgreSQL
**Objetivo:** Implementar control de acceso granular por rol de usuario

---

## 🎯 Principios de Seguridad

1. **Estudiantes** solo ven sus propias clases y datos
2. **Profesores** solo ven clases de su centro educativo
3. **Admin de centro** ve todo de su centro
4. **Super Admin** ve todo

---

## 📋 Helper Functions

### 1. Obtener rol del usuario actual

```sql
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;
```

### 2. Obtener centro del usuario actual

```sql
CREATE OR REPLACE FUNCTION auth.user_centro()
RETURNS UUID AS $$
  SELECT centro_id FROM user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;
```

### 3. Verificar si usuario es super admin

```sql
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 4. Verificar si usuario es admin de centro

```sql
CREATE OR REPLACE FUNCTION auth.is_admin_centro()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin_centro'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 5. Verificar si usuario es profesor

```sql
CREATE OR REPLACE FUNCTION auth.is_profesor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'profesor'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 6. Verificar si usuario pertenece a una clase

```sql
CREATE OR REPLACE FUNCTION auth.is_member_of_class(class_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM class_members
    WHERE class_id = $1 AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## 🗄️ RLS Policies por Tabla

### 1. user_profiles

```sql
-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuarios ven perfiles según su rol
CREATE POLICY "Users can view profiles based on role"
ON user_profiles FOR SELECT
USING (
  -- Super admin ve todo
  auth.is_super_admin()
  OR
  -- Admin de centro ve usuarios de su centro
  (auth.is_admin_centro() AND centro_id = auth.user_centro())
  OR
  -- Profesores ven otros profesores y estudiantes de su centro
  (auth.is_profesor() AND centro_id = auth.user_centro())
  OR
  -- Estudiantes ven su propio perfil y profesores de sus clases
  (id = auth.uid() OR id IN (
    SELECT DISTINCT cm.user_id FROM class_members cm
    INNER JOIN class_members my_classes ON cm.class_id = my_classes.class_id
    WHERE my_classes.user_id = auth.uid() AND cm.role = 'profesor'
  ))
);

-- UPDATE: Solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- INSERT: Solo super_admin puede crear perfiles manualmente
-- (El registro lo maneja la aplicación)
CREATE POLICY "Only super_admin can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (auth.is_super_admin());

-- DELETE: Solo super_admin
CREATE POLICY "Only super_admin can delete profiles"
ON user_profiles FOR DELETE
USING (auth.is_super_admin());
```

---

### 2. centros_educativos

```sql
ALTER TABLE centros_educativos ENABLE ROW LEVEL SECURITY;

-- SELECT: Super admin ve todo, admin/profesores ven su centro
CREATE POLICY "View centros based on role"
ON centros_educativos FOR SELECT
USING (
  auth.is_super_admin()
  OR
  id = auth.user_centro()
);

-- INSERT: Solo super_admin crea centros
CREATE POLICY "Only super_admin can create centros"
ON centros_educativos FOR INSERT
WITH CHECK (auth.is_super_admin());

-- UPDATE: Super admin o admin del centro
CREATE POLICY "Super admin or centro admin can update centro"
ON centros_educativos FOR UPDATE
USING (
  auth.is_super_admin()
  OR
  (id = auth.user_centro() AND auth.is_admin_centro())
);

-- DELETE: Solo super_admin
CREATE POLICY "Only super_admin can delete centros"
ON centros_educativos FOR DELETE
USING (auth.is_super_admin());
```

---

### 3. license_codes

```sql
ALTER TABLE license_codes ENABLE ROW LEVEL SECURITY;

-- SELECT: Super admin ve todo, admin de centro ve los de su centro
CREATE POLICY "View license codes based on role"
ON license_codes FOR SELECT
USING (
  auth.is_super_admin()
  OR
  (centro_id = auth.user_centro() AND auth.is_admin_centro())
);

-- INSERT: Solo super_admin genera códigos
CREATE POLICY "Only super_admin can create license codes"
ON license_codes FOR INSERT
WITH CHECK (auth.is_super_admin());

-- UPDATE: Solo super_admin (activación se hace por función)
CREATE POLICY "Only super_admin can update license codes"
ON license_codes FOR UPDATE
USING (auth.is_super_admin());

-- DELETE: Solo super_admin
CREATE POLICY "Only super_admin can delete license codes"
ON license_codes FOR DELETE
USING (auth.is_super_admin());
```

---

### 4. license_pools

```sql
ALTER TABLE license_pools ENABLE ROW LEVEL SECURITY;

-- SELECT: Super admin ve todo, admin/profesor ven su centro
CREATE POLICY "View license pools based on role"
ON license_pools FOR SELECT
USING (
  auth.is_super_admin()
  OR
  centro_id = auth.user_centro()
);

-- INSERT/UPDATE/DELETE: Solo por funciones o super_admin
CREATE POLICY "Only super_admin can modify license pools"
ON license_pools FOR ALL
USING (auth.is_super_admin())
WITH CHECK (auth.is_super_admin());
```

---

### 5. classes

```sql
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- SELECT: Ver clases según membresía
CREATE POLICY "View classes based on membership"
ON classes FOR SELECT
USING (
  auth.is_super_admin()
  OR
  centro_id = auth.user_centro()
  OR
  auth.is_member_of_class(id)
);

-- INSERT: Profesores pueden crear clases
CREATE POLICY "Profesores can create classes"
ON classes FOR INSERT
WITH CHECK (
  auth.is_profesor()
  AND profesor_id = auth.uid()
  AND centro_id = auth.user_centro()
);

-- UPDATE: Solo el profesor creador o admin de centro
CREATE POLICY "Profesor or admin can update class"
ON classes FOR UPDATE
USING (
  profesor_id = auth.uid()
  OR
  (centro_id = auth.user_centro() AND auth.is_admin_centro())
  OR
  auth.is_super_admin()
);

-- DELETE: Solo el profesor creador o admin
CREATE POLICY "Profesor or admin can delete class"
ON classes FOR DELETE
USING (
  profesor_id = auth.uid()
  OR
  (centro_id = auth.user_centro() AND auth.is_admin_centro())
  OR
  auth.is_super_admin()
);
```

---

### 6. class_members

```sql
ALTER TABLE class_members ENABLE ROW LEVEL SECURITY;

-- SELECT: Miembros de la clase pueden ver otros miembros
CREATE POLICY "Class members can view members"
ON class_members FOR SELECT
USING (
  auth.is_super_admin()
  OR
  auth.is_member_of_class(class_id)
  OR
  -- Profesores del centro pueden ver
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id
    AND c.centro_id = auth.user_centro()
    AND auth.is_profesor()
  )
);

-- INSERT: Profesor de la clase puede añadir estudiantes
CREATE POLICY "Profesor can add members to class"
ON class_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id AND c.profesor_id = auth.uid()
  )
  OR
  -- Estudiante se une a sí mismo con código
  (user_id = auth.uid() AND role = 'estudiante')
);

-- DELETE: Profesor puede eliminar, estudiante puede salirse
CREATE POLICY "Profesor can remove members or self-remove"
ON class_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id AND c.profesor_id = auth.uid()
  )
  OR
  user_id = auth.uid()
);
```

---

### 7. projects

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- SELECT: Proyectos públicos (templates) visibles para todos
-- Proyectos de centro visibles para ese centro
CREATE POLICY "View projects based on visibility"
ON projects FOR SELECT
USING (
  is_template = TRUE
  OR
  visible = TRUE
  OR
  created_by = auth.uid()
  OR
  centro_id = auth.user_centro()
  OR
  auth.is_super_admin()
);

-- INSERT: Profesores y super_admin pueden crear proyectos
CREATE POLICY "Profesores can create projects"
ON projects FOR INSERT
WITH CHECK (
  (auth.is_profesor() AND created_by = auth.uid())
  OR
  auth.is_super_admin()
);

-- UPDATE: Solo el creador o super_admin
CREATE POLICY "Creator or super_admin can update project"
ON projects FOR UPDATE
USING (
  created_by = auth.uid()
  OR
  auth.is_super_admin()
);

-- DELETE: Solo el creador o super_admin
CREATE POLICY "Creator or super_admin can delete project"
ON projects FOR DELETE
USING (
  created_by = auth.uid()
  OR
  auth.is_super_admin()
);
```

---

### 8. project_phases, project_exercises, exercise_questions, question_options

```sql
-- Todas estas tablas heredan permisos del proyecto padre

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View phases if can view project"
ON project_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_id
    AND (
      p.is_template = TRUE
      OR p.visible = TRUE
      OR p.created_by = auth.uid()
      OR p.centro_id = auth.user_centro()
      OR auth.is_super_admin()
    )
  )
);

CREATE POLICY "Modify phases if can modify project"
ON project_phases FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_id
    AND (p.created_by = auth.uid() OR auth.is_super_admin())
  )
);

-- Similar para project_exercises, exercise_questions, question_options
-- (Copiar patrón de arriba adaptando el JOIN)
```

---

### 9. class_projects

```sql
ALTER TABLE class_projects ENABLE ROW LEVEL SECURITY;

-- SELECT: Miembros de la clase pueden ver proyectos asignados
CREATE POLICY "Class members can view assigned projects"
ON class_projects FOR SELECT
USING (
  auth.is_member_of_class(class_id)
  OR
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id
    AND c.centro_id = auth.user_centro()
    AND (auth.is_profesor() OR auth.is_admin_centro())
  )
  OR
  auth.is_super_admin()
);

-- INSERT: Solo profesor de la clase
CREATE POLICY "Profesor can assign projects to class"
ON class_projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id AND c.profesor_id = auth.uid()
  )
);

-- DELETE: Solo profesor de la clase
CREATE POLICY "Profesor can remove assigned projects"
ON class_projects FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id AND c.profesor_id = auth.uid()
  )
);
```

---

### 10. student_progress

```sql
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- SELECT: Estudiante ve su progreso, profesor ve de su clase
CREATE POLICY "View progress based on role"
ON student_progress FOR SELECT
USING (
  student_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM class_projects cp
    INNER JOIN classes c ON cp.class_id = c.id
    WHERE cp.id = class_project_id
    AND c.profesor_id = auth.uid()
  )
  OR
  auth.is_super_admin()
);

-- INSERT/UPDATE: Estudiante actualiza su progreso
CREATE POLICY "Student can update own progress"
ON student_progress FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());
```

---

### 11. student_answers

```sql
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- SELECT: Estudiante ve sus respuestas, profesor ve de su clase
CREATE POLICY "View answers based on role"
ON student_answers FOR SELECT
USING (
  student_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM class_projects cp
    INNER JOIN classes c ON cp.class_id = c.id
    WHERE cp.id = class_project_id
    AND c.profesor_id = auth.uid()
  )
  OR
  auth.is_super_admin()
);

-- INSERT/UPDATE: Estudiante envía/actualiza respuestas
CREATE POLICY "Student can submit answers"
ON student_answers FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Student can update own answers if not evaluated"
ON student_answers FOR UPDATE
USING (student_id = auth.uid() AND evaluated_at IS NULL)
WITH CHECK (student_id = auth.uid());

-- Profesor evalúa respuestas
CREATE POLICY "Profesor can evaluate answers"
ON student_answers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM class_projects cp
    INNER JOIN classes c ON cp.class_id = c.id
    WHERE cp.id = class_project_id
    AND c.profesor_id = auth.uid()
  )
);
```

---

### 12. student_project_grades

```sql
ALTER TABLE student_project_grades ENABLE ROW LEVEL SECURITY;

-- SELECT: Estudiante ve sus notas, profesor ve de su clase
CREATE POLICY "View grades based on role"
ON student_project_grades FOR SELECT
USING (
  student_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM class_projects cp
    INNER JOIN classes c ON cp.class_id = c.id
    WHERE cp.id = class_project_id
    AND c.profesor_id = auth.uid()
  )
  OR
  auth.is_super_admin()
);

-- INSERT/UPDATE: Sistema o profesor
CREATE POLICY "System can update grades"
ON student_project_grades FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM class_projects cp
    INNER JOIN classes c ON cp.class_id = c.id
    WHERE cp.id = class_project_id
    AND c.profesor_id = auth.uid()
  )
  OR
  auth.is_super_admin()
);
```

---

### 13. project_resources

```sql
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

-- SELECT: Si puedes ver el proyecto, puedes ver los recursos
CREATE POLICY "View resources if can view project"
ON project_resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_id
    AND (
      p.is_template = TRUE
      OR p.visible = TRUE
      OR p.created_by = auth.uid()
      OR p.centro_id = auth.user_centro()
      OR auth.is_super_admin()
    )
  )
);

-- INSERT/UPDATE/DELETE: Creador del proyecto o super_admin
CREATE POLICY "Modify resources if can modify project"
ON project_resources FOR ALL
USING (
  uploaded_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_id
    AND (p.created_by = auth.uid() OR auth.is_super_admin())
  )
);
```

---

## 🚀 Script de Aplicación Completa

```sql
-- Aplicar todas las helper functions
-- (Copiar las funciones de arriba)

-- Aplicar todas las policies
-- (Ejecutar todos los ALTER TABLE y CREATE POLICY de arriba)

-- Verificar que todas las tablas tienen RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## ✅ Testing de Policies

### Test 1: Estudiante solo ve sus clases

```sql
-- Como estudiante
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "student-uuid", "role": "authenticated"}';

SELECT * FROM classes; -- Solo debe ver clases donde es miembro
```

### Test 2: Profesor solo crea clases en su centro

```sql
-- Como profesor intentando crear clase en otro centro
INSERT INTO classes (nombre, profesor_id, centro_id, ...)
VALUES ('Clase Test', auth.uid(), 'otro-centro-uuid', ...);
-- Debe fallar por RLS
```

### Test 3: Admin de centro ve todo su centro

```sql
-- Como admin_centro
SELECT * FROM license_pools WHERE centro_id = auth.user_centro();
-- Debe ver el pool de su centro
```

---

## 🔒 Consideraciones de Seguridad

1. **NUNCA exponer API keys de Supabase en el frontend**
2. **Usar JWT claims para roles** (configurar en Supabase Auth)
3. **Validar en el backend** (las RLS son la última línea de defensa)
4. **Logs de auditoría** para acciones críticas (activar licencias, eliminar clases)
5. **Rate limiting** en Supabase para prevenir abuso

---

**Siguiente paso:** Diseñar los componentes UI y flujos de usuario

