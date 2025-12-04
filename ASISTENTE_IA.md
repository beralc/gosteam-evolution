# 🤖 Asistente IA - GoSteam Evolution

## Descripción

El Asistente GoSteam es un chatbot inteligente impulsado por OpenAI que ayuda a profesores a navegar la plataforma, encontrar proyectos y responder preguntas sobre el contenido educativo.

## ✨ Características Principales

### 🎯 Comportamiento Adaptativo

El asistente cambia su estilo de respuesta según el tipo de pregunta:

#### 1. **Preguntas sobre CONTENIDO de Proyectos**
Cuando preguntas sobre el contenido o aprendizajes de un proyecto específico:
- **NO da respuestas directas** ❌
- **Usa el método socrático** ✅
- **Guía al estudiante** a descubrir la información por sí mismo
- **Hace preguntas que invitan a la reflexión**

**Ejemplo:**
```
Usuario: "¿Qué enseña el proyecto Nicolás Copérnico?"

Asistente: "¡Excelente pregunta! ¿Qué te parece si exploramos juntos
el proyecto en la Biblioteca? Fíjate en la descripción y piensa:
¿qué conceptos científicos crees que se trabajan aquí?"
```

#### 2. **Preguntas sobre FUNCIONALIDAD de la Plataforma**
Cuando preguntas sobre cómo usar la plataforma:
- **Da respuestas directas y específicas** ✅
- **Incluye pasos numerados**
- **Menciona atajos de teclado**
- **Proporciona ubicaciones exactas**

**Ejemplo:**
```
Usuario: "¿Cómo filtro proyectos por etapa?"

Asistente: "Para filtrar proyectos por etapa educativa, sigue estos pasos:
1) Ve a la Biblioteca (Alt+2)
2) En el panel izquierdo verás 'Filtros'
3) Haz clic en la etapa deseada (Primaria, Secundaria, etc.)
Los resultados se actualizan automáticamente."
```

#### 3. **Preguntas Generales**
Preguntas sobre STEAM, metodología educativa, sugerencias:
- **Proporciona información útil y orientadora**
- **Sugiere proyectos relevantes**
- **Ofrece contexto educativo**

## 🚀 Cómo Usar el Asistente

### Paso 1: Abrir el Asistente
1. Haz clic en el botón flotante con el icono ✨ (esquina inferior derecha)
2. Se abrirá un panel lateral con el chat

### Paso 2: Configurar tu API Key de OpenAI

**Primera vez:**
1. Verás un aviso amarillo que dice "Configuración requerida"
2. Haz clic en "Configurar ahora"
3. Pega tu API key de OpenAI (comienza con `sk-...`)
4. Haz clic en "Guardar"

**Obtener tu API key:**
- Ve a https://platform.openai.com/api-keys
- Crea una nueva clave si no tienes una
- Copia la clave (empieza con `sk-...`)
- Pégala en el campo de configuración del asistente

**Configuración posterior:**
- Haz clic en el icono ⚙️ en la parte superior del panel
- Puedes cambiar o eliminar tu API key en cualquier momento

### Paso 3: Hacer Preguntas
¡Ya puedes empezar a conversar! Escribe tu pregunta y presiona Enter o el botón de enviar.

## 💡 Ejemplos de Preguntas

### ✅ Preguntas Recomendadas

**Sobre funcionalidad (incluye enlaces clicables):**
- "¿Cómo busco proyectos en la Biblioteca?"
  - ✨ El asistente incluirá un enlace directo a la Biblioteca
- "¿Qué significan los filtros de etapa y área?"
- "¿Cómo creo una nueva clase?"
  - ✨ Incluirá enlace a Mis Clases
- "¿Qué atajos de teclado puedo usar?"
- "¿Cómo funciona la navegación en móvil?"

**Sobre proyectos (general):**
- "¿Qué proyectos hay para 5º de Primaria?"
  - ✨ Sugerirá explorar la Biblioteca con enlace directo
- "Necesito proyectos de robótica sin hardware"
- "¿Cuántos proyectos hay de IA?"
- "Quiero proyectos cortos de 3-4 sesiones"

**Sobre contenido (guía socrática):**
- "¿Qué es el proyecto de Arduino?"
- "¿Qué aprenden los niños en el proyecto de Stop Motion?"
  - ✨ Te guiará a descubrirlo por ti mismo con enlaces a la Biblioteca

## 🔒 Seguridad y Privacidad

### Tu API Key está segura
- Se guarda **localmente en tu navegador** (localStorage)
- **NO se envía a servidores de GoSteam**
- Solo se usa para comunicarse directamente con OpenAI
- Puedes eliminarla en cualquier momento

### Nota Importante
En producción, se recomienda usar un backend proxy para proteger la API key. La implementación actual es ideal para:
- Desarrollo y pruebas
- Uso personal
- Demos y prototipos

## 📊 Base de Conocimiento

El asistente tiene acceso a:
- ✅ **76 proyectos completos** con descripciones
- ✅ **5 categorías STEAM** (Programación, Creatividad, IA, Ciudadanía, Cultura científica)
- ✅ **4 etapas educativas** (Infantil, Primaria, Secundaria, Bachillerato)
- ✅ **5 áreas temáticas** (Matemáticas, Lenguaje, Ciencias, Tecnología, Artes)
- ✅ **Guías de uso** de la plataforma
- ✅ **Atajos de teclado** y navegación
- ✅ **FAQs** sobre la plataforma

## 🛠️ Características Técnicas

### Modelo de IA
- **Modelo:** GPT-4O Mini (OpenAI)
- **Ventajas:** Rápido, económico, preciso
- **Temperatura:** 0.7 (equilibrio entre creatividad y precisión)
- **Max tokens:** 500 (respuestas concisas)

### Detección Inteligente de Preguntas
El asistente analiza tu pregunta automáticamente para determinar:
1. ¿Es sobre contenido de un proyecto? → Modo Socrático
2. ¿Es sobre funcionalidad de la plataforma? → Respuesta directa con enlaces
3. ¿Es general? → Orientación y sugerencias con enlaces
4. ¿Es fuera de contexto? → Rechazo educado (seguridad para primaria)

### Características de la Interfaz
- ✅ Auto-scroll a mensajes nuevos
- ✅ Indicador de "Pensando..." mientras procesa
- ✅ Manejo de errores con mensajes claros
- ✅ **Enlaces clicables de navegación interna** ✨ NUEVO
- ✅ Cierre automático del asistente al navegar
- ✅ Soporte para links markdown en respuestas
- ✅ Historial de conversación (últimos 10 mensajes)
- ✅ Responsive (funciona en móvil y desktop)

### 🔗 Enlaces de Navegación Inteligentes ✨ NUEVO
El asistente incluye enlaces clicables que navegan a secciones de la plataforma:
- **[Ver Biblioteca](biblioteca)** → Abre la Biblioteca de proyectos
- **[Ir a Mis Clases](mis-clases)** → Abre la gestión de clases
- **[Volver al Dashboard](dashboard)** → Regresa a la página principal
- **[Ver Recursos](recursos)** → Abre la sección de recursos
- **[Ver En tu Casa](en-tu-casa)** → Abre actividades para el hogar

Al hacer clic en un enlace:
1. El asistente se cierra automáticamente
2. Navega a la sección correspondiente
3. Mejora la experiencia de usuario (menos clics)

## ❓ Solución de Problemas

### "La clave de API de OpenAI no es válida"
- Verifica que copiaste la clave completa (comienza con `sk-`)
- Asegúrate de no incluir espacios al inicio o final
- Genera una nueva clave en: https://platform.openai.com/api-keys

### "Has alcanzado el límite de tu cuota de OpenAI"
- Revisa tu cuenta de OpenAI
- Verifica que tienes créditos disponibles
- Añade un método de pago si es necesario

### "Error de conexión"
- Verifica tu conexión a internet
- Comprueba que la API key está configurada correctamente
- Intenta cerrar y volver a abrir el asistente

### El asistente no responde
- Verifica que viste el icono de "✓ OpenAI conectado" en el header
- Revisa que escribiste una pregunta y presionaste Enter
- Mira si hay mensajes de error en la conversación

## 🎓 Filosofía Educativa

### ¿Por qué usar el método socrático para preguntas sobre proyectos?

El objetivo educativo de GoSteam es **fomentar el aprendizaje activo y el pensamiento crítico**. Cuando un estudiante o profesor pregunta sobre el contenido de un proyecto:

1. **Darles la respuesta directa** = Aprendizaje pasivo ❌
2. **Guiarles para que descubran** = Aprendizaje activo ✅

**Beneficios:**
- 🧠 Desarrolla **pensamiento crítico**
- 🔍 Fomenta la **curiosidad y exploración**
- 💪 Construye **autonomía** en el aprendizaje
- 📚 Mejora la **retención** de conocimientos
- ✨ Crea experiencias de aprendizaje **significativas**

## 📝 Registro de Cambios

### Versión 1.0 - Enero 2025
- ✅ Integración inicial con OpenAI GPT-4O Mini
- ✅ Comportamiento adaptativo (Socrático vs Directo)
- ✅ Base de conocimiento con 76 proyectos
- ✅ Configuración de API key por UI
- ✅ Almacenamiento local seguro
- ✅ Detección automática de tipo de pregunta
- ✅ Interfaz responsive con auto-scroll
- ✅ Manejo de errores robusto

## 🔮 Próximas Mejoras

Ideas para futuras versiones:
- [ ] Backend proxy para seguridad mejorada
- [ ] Búsqueda semántica de proyectos
- [ ] Sugerencias proactivas basadas en contexto
- [ ] Exportar conversaciones
- [ ] Modo voz (speech-to-text)
- [ ] Integración con calendario de clases
- [ ] Análisis de sentimiento para personalizar respuestas

## 📧 Soporte

Si encuentras problemas o tienes sugerencias:
- Crea un issue en el repositorio de GitHub
- Contacta al equipo de desarrollo de GoSteam Evolution

---

**¡Disfruta usando el Asistente GoSteam! 🚀**
