import OpenAI from 'openai';
import {
  PLATFORM_CONTEXT,
  EDUCATIONAL_STAGES,
  SUBJECT_AREAS,
  PROJECT_CATEGORIES,
  NAVIGATION_SECTIONS,
  FILTER_OPTIONS,
  ALL_PROJECTS,
  HOW_TO_GUIDES,
  FAQ,
  PLATFORM_STATS
} from '../data/knowledge-base.js';

/**
 * OpenAI Assistant for GoSteam Evolution Platform
 * Implements adaptive behavior:
 * - Project questions → Guide students with Socratic method
 * - Functionality questions → Provide direct answers
 */

let openaiClient = null;

/**
 * Initialize OpenAI client with API key
 */
export const initializeOpenAI = (apiKey) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  openaiClient = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });

  return openaiClient;
};

/**
 * Check if OpenAI is initialized
 */
export const isOpenAIInitialized = () => {
  return openaiClient !== null;
};

/**
 * Detect the type of question being asked
 * Returns: 'project_content' | 'functionality' | 'general'
 */
const detectQuestionType = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  // Keywords that indicate questions about project content
  const projectContentKeywords = [
    'qué es', 'qué son', 'qué hace', 'qué hacen',
    'cómo funciona', 'cómo funcionan', 'explica', 'explicame',
    'qué aprendo', 'qué enseña', 'de qué trata', 'de qué va',
    'contenido del proyecto', 'sobre el proyecto',
    'cuéntame sobre', 'cuéntame del', 'información sobre',
    'detalles del proyecto', 'detalles sobre'
  ];

  // Keywords that indicate questions about platform functionality
  const functionalityKeywords = [
    'cómo busco', 'cómo filtro', 'cómo uso', 'cómo puedo',
    'dónde está', 'dónde encuentro', 'cómo accedo',
    'cómo crear', 'cómo unirme', 'cómo navego',
    'atajos', 'teclas', 'filtrar', 'buscar en',
    'funciona la plataforma', 'usar la plataforma',
    'cómo se usa', 'cómo funciona el', 'cómo funciona la'
  ];

  // Check if message mentions a specific project by name
  const mentionsProject = ALL_PROJECTS.some(project =>
    lowerMessage.includes(project.title.toLowerCase())
  );

  // Determine question type
  const hasProjectKeyword = projectContentKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  const hasFunctionalityKeyword = functionalityKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  if ((hasProjectKeyword || mentionsProject) && !hasFunctionalityKeyword) {
    return 'project_content';
  } else if (hasFunctionalityKeyword) {
    return 'functionality';
  }

  return 'general';
};

/**
 * Build context string for OpenAI
 */
const buildContextString = () => {
  return `
# CONTEXTO DE LA PLATAFORMA GOSTEAM EVOLUTION

## Información General
- Plataforma: ${PLATFORM_CONTEXT.name}
- Proveedor: ${PLATFORM_CONTEXT.provider}
- Descripción: ${PLATFORM_CONTEXT.description}
- Público: ${PLATFORM_CONTEXT.target_audience}
- Idioma: ${PLATFORM_CONTEXT.language}
- Año Escolar: ${PLATFORM_CONTEXT.year}

## Estadísticas
- Total de proyectos: ${PLATFORM_STATS.total_projects}
- Categorías: ${PLATFORM_STATS.categories}
- Etapas educativas: ${PLATFORM_STATS.educational_stages}
- Áreas temáticas: ${PLATFORM_STATS.subject_areas}

## Etapas Educativas
${EDUCATIONAL_STAGES.map(stage => `- ${stage.name} (${stage.age_range}): ${stage.description}`).join('\n')}

## Áreas Temáticas
${SUBJECT_AREAS.map(area => `- ${area.name}: ${area.description}`).join('\n')}

## Categorías de Proyectos
${PROJECT_CATEGORIES.map(cat => `- ${cat.name}: ${cat.description}`).join('\n')}

## Navegación
${NAVIGATION_SECTIONS.map(section => {
  let text = `- ${section.name}: ${section.description}`;
  if (section.keyboard_shortcut) {
    text += ` (Atajo: ${section.keyboard_shortcut})`;
  }
  return text;
}).join('\n')}

## Filtros Disponibles
${Object.entries(FILTER_OPTIONS).map(([key, filter]) => {
  return `- ${filter.name}: ${filter.description}`;
}).join('\n')}

## Proyectos Disponibles (Resumen)
${ALL_PROJECTS.slice(0, 10).map(p =>
  `- "${p.title}" (${p.level}, ${p.category}, ${p.sessions} sesiones)`
).join('\n')}
... y ${ALL_PROJECTS.length - 10} proyectos más.

## Preguntas Frecuentes
${FAQ.categories.slice(0, 1)[0].questions.map(q =>
  `P: ${q.q}\nR: ${q.a}`
).join('\n\n')}
`;
};

/**
 * Create system prompt based on question type
 */
const createSystemPrompt = (questionType) => {
  const basePrompt = `Eres el Asistente GoSteam, un asistente educativo amigable y profesional de la plataforma GoSteam Evolution de Edelvives.

Tu objetivo es ayudar a profesores españoles a usar la plataforma y gestionar proyectos STEAM.

CONTEXTO DE LA PLATAFORMA:
${buildContextString()}

IMPORTANTE - COMPORTAMIENTO ADAPTATIVO:
`;

  if (questionType === 'project_content') {
    return basePrompt + `
Tipo de pregunta: CONTENIDO DE PROYECTO

La pregunta del usuario es sobre el CONTENIDO o APRENDIZAJES de un proyecto específico.

**NUNCA des respuestas directas sobre el contenido del proyecto.**

En su lugar, GUÍA al estudiante/profesor para que descubra la información por sí mismo usando el MÉTODO SOCRÁTICO:

1. **Haz preguntas guía** que les hagan reflexionar
2. **Sugiere dónde buscar** (en la descripción del proyecto, en los materiales, etc.)
3. **Anima la exploración** del proyecto en la Biblioteca
4. **Reformula la pregunta** de manera que invite a la investigación

Ejemplos de respuestas apropiadas:
- "¡Excelente pregunta! ¿Qué te parece si exploramos juntos el proyecto en la Biblioteca? Fíjate en la descripción y piensa: ¿qué conceptos científicos crees que se trabajan aquí?"
- "En lugar de decirte directamente, te invito a que leas la descripción del proyecto. ¿Qué palabras clave ves que te den pistas sobre el contenido?"
- "Esa es una pregunta muy interesante. ¿Has revisado los materiales del proyecto? ¿Qué áreas temáticas menciona?"

**Nunca digas cosas como:**
- "El proyecto trata sobre..."
- "Aprenderás..."
- "El contenido incluye..."
- "Se trabaja con..."

Tu rol es ser un FACILITADOR del aprendizaje, no un transmisor de información directa.
`;
  } else if (questionType === 'functionality') {
    return basePrompt + `
Tipo de pregunta: FUNCIONALIDAD DE LA PLATAFORMA

La pregunta del usuario es sobre CÓMO USAR LA PLATAFORMA.

**Proporciona respuestas DIRECTAS, CLARAS y ESPECÍFICAS.**

Incluye:
1. **Pasos específicos** numerados
2. **Ubicaciones exactas** de botones y secciones
3. **Atajos de teclado** cuando sea relevante
4. **Consejos prácticos** para optimizar el uso

Ejemplos de respuestas apropiadas:
- "Para filtrar proyectos por etapa educativa, sigue estos pasos: 1) Ve a la Biblioteca (Alt+2), 2) En el panel izquierdo verás 'Filtros', 3) Haz clic en la etapa deseada (Primaria, Secundaria, etc.)"
- "Puedes usar estos atajos de teclado: Alt+1 para Mis Clases, Alt+2 para Biblioteca, Alt+3 para Recursos, Alt+4 para En tu Casa, Alt+H para volver al Dashboard"
- "La barra de búsqueda está en la columna izquierda de la Biblioteca. Escribe el nombre del proyecto y los resultados se filtrarán automáticamente."

Sé **específico, útil y directo**. El objetivo es que el usuario complete su tarea rápidamente.
`;
  } else {
    return basePrompt + `
Tipo de pregunta: GENERAL

La pregunta es general sobre la plataforma o el aprendizaje STEAM.

**Proporciona información ÚTIL y ORIENTADORA.**

Puedes:
1. **Explicar conceptos** generales sobre STEAM
2. **Sugerir proyectos** relevantes según las necesidades del usuario
3. **Ofrecer recursos** disponibles en la plataforma
4. **Dar contexto educativo** sobre metodologías y enfoques

Mantén un tono **amigable, profesional y educativo**.

Si no estás seguro de algo, sé honesto y sugiere alternativas o dónde buscar más información.
`;
  }
};

/**
 * Chat with OpenAI Assistant
 */
export const chatWithAssistant = async (userMessage, conversationHistory = []) => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
  }

  try {
    // Detect question type
    const questionType = detectQuestionType(userMessage);

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: createSystemPrompt(questionType)
      }
    ];

    // Add conversation history (last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Call OpenAI API
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6
    });

    const assistantMessage = response.choices[0].message.content;

    return {
      success: true,
      message: assistantMessage,
      questionType: questionType,
      usage: response.usage
    };

  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    // Provide helpful error messages
    if (error.code === 'invalid_api_key') {
      return {
        success: false,
        error: 'La clave de API de OpenAI no es válida. Por favor, verifica tu configuración.'
      };
    } else if (error.code === 'insufficient_quota') {
      return {
        success: false,
        error: 'Has alcanzado el límite de tu cuota de OpenAI. Por favor, revisa tu cuenta.'
      };
    } else {
      return {
        success: false,
        error: 'Error al conectar con el asistente. Por favor, intenta de nuevo.'
      };
    }
  }
};

/**
 * Search for specific projects based on criteria
 */
export const searchProjects = (query, filters = {}) => {
  let results = ALL_PROJECTS;

  // Text search
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.category.toLowerCase().includes(searchTerm) ||
      (project.description && project.description.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters.etapa) {
    results = results.filter(p => p.etapa === filters.etapa);
  }
  if (filters.area) {
    results = results.filter(p => p.area === filters.area);
  }
  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters.robot_needed !== undefined) {
    results = results.filter(p => p.robot_needed === filters.robot_needed);
  }

  return results;
};

/**
 * Get project details by ID or title
 */
export const getProjectDetails = (identifier) => {
  // Try to find by ID first
  let project = ALL_PROJECTS.find(p => p.id === identifier);

  // If not found, try by title (case insensitive)
  if (!project && typeof identifier === 'string') {
    project = ALL_PROJECTS.find(p =>
      p.title.toLowerCase() === identifier.toLowerCase()
    );
  }

  return project || null;
};

/**
 * Get how-to guide by key
 */
export const getHowToGuide = (guideKey) => {
  return HOW_TO_GUIDES[guideKey] || null;
};

/**
 * Get FAQ by category
 */
export const getFAQByCategory = (categoryName) => {
  return FAQ.categories.find(cat =>
    cat.category.toLowerCase() === categoryName.toLowerCase()
  );
};
