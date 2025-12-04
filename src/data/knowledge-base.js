/**
 * Knowledge Base for GoSteam Evolution Platform
 * This file contains all the contextual information about the platform,
 * projects, and functionality to power the AI assistant.
 */

// Platform Context
export const PLATFORM_CONTEXT = {
  name: "GoSteam Evolution",
  provider: "Edelvives",
  description: "Plataforma educativa STEAM para profesores españoles que ofrece proyectos interdisciplinares de ciencia, tecnología, ingeniería, arte y matemáticas.",
  target_audience: "Profesores de educación infantil, primaria, secundaria y bachillerato en España",
  language: "Castellano",
  year: "2025/2026"
};

// Educational Stages
export const EDUCATIONAL_STAGES = [
  {
    name: "Educación Infantil",
    age_range: "3-6 años",
    description: "Etapa inicial con enfoque en exploración sensorial y aprendizaje lúdico"
  },
  {
    name: "Primaria",
    age_range: "6-12 años",
    description: "Seis cursos (1º-6º) enfocados en competencias básicas y pensamiento computacional"
  },
  {
    name: "Secundaria",
    age_range: "12-16 años",
    description: "ESO - Cuatro cursos (1º-4º) con mayor profundidad técnica y científica"
  },
  {
    name: "Bachillerato",
    age_range: "16-18 años",
    description: "Dos cursos con proyectos avanzados y preparación universitaria"
  }
];

// Subject Areas
export const SUBJECT_AREAS = [
  { name: "Matemáticas", description: "Álgebra, geometría, estadística, lógica matemática" },
  { name: "Lenguaje", description: "Lengua castellana, literatura, comunicación" },
  { name: "Ciencias", description: "Ciencias naturales, física, química, biología" },
  { name: "Tecnología", description: "Programación, robótica, diseño digital" },
  { name: "Artes", description: "Artes plásticas, diseño, creatividad visual" }
];

// Project Categories
export const PROJECT_CATEGORIES = [
  {
    key: "steam",
    name: "STEAM (Programación y robótica)",
    color: "#C83E7F",
    description: "Proyectos de programación, robótica, electrónica y pensamiento computacional",
    examples: ["Scratch", "Arduino", "LEGO", "Python", "Drones"]
  },
  {
    key: "creatividad",
    name: "Creatividad",
    color: "#FBEB4E",
    description: "Proyectos artísticos, diseño digital, animación y expresión creativa",
    examples: ["Ilustración digital", "Stop Motion", "Diseño gráfico", "Fotografía"]
  },
  {
    key: "ia",
    name: "IA",
    color: "#49A0DE",
    description: "Inteligencia artificial, aprendizaje automático y tecnologías emergentes",
    examples: ["Redes neuronales", "Teachable Machine", "Chatbots", "Reconocimiento de voz"]
  },
  {
    key: "ciudadania",
    name: "Ciudadanía digital",
    color: "#8DB442",
    description: "Uso responsable de tecnología, privacidad, seguridad online y ética digital",
    examples: ["Privacidad online", "Fake news", "Ciberacoso", "Netiqueta"]
  },
  {
    key: "cultura",
    name: "Cultura científica",
    color: "#49A0DE",
    description: "Proyectos de ciencias naturales, astronomía, química y método científico",
    examples: ["Sistema solar", "Química de la cocina", "Microscopía", "Energías renovables"]
  }
];

// Navigation Sections
export const NAVIGATION_SECTIONS = [
  {
    name: "Dashboard",
    description: "Página principal con acceso rápido a todas las secciones",
    keyboard_shortcut: "Alt+H"
  },
  {
    name: "Mis clases",
    description: "Gestiona tus clases activas, crea nuevas clases o únete a clases existentes",
    keyboard_shortcut: "Alt+1",
    features: ["Crear clase", "Unirse a clase", "Ver clases activas", "Gestionar borradores"]
  },
  {
    name: "Biblioteca",
    description: "Explora más de 76 proyectos STEAM listos para usar",
    keyboard_shortcut: "Alt+2",
    features: ["Buscar proyectos", "Filtrar por etapa", "Filtrar por área", "Filtrar por robot necesario", "Ver por categorías"]
  },
  {
    name: "Recursos",
    description: "Encuentra guías, tutoriales y herramientas de apoyo",
    keyboard_shortcut: "Alt+3"
  },
  {
    name: "En tu casa",
    description: "Actividades y propuestas para hacer fuera del aula",
    keyboard_shortcut: "Alt+4"
  }
];

// Filter Options
export const FILTER_OPTIONS = {
  etapa: {
    name: "Etapa educativa",
    description: "Filtra proyectos por nivel educativo del alumnado",
    options: ["Educación Infantil", "Primaria", "Secundaria", "Bachillerato"]
  },
  area: {
    name: "Área temática",
    description: "Filtra proyectos por asignatura o disciplina",
    options: ["Matemáticas", "Lenguaje", "Ciencias", "Tecnología", "Artes"]
  },
  robot_needed: {
    name: "Necesita Robot",
    description: "Filtra proyectos según si requieren hardware de robótica",
    options: [
      { value: "Con Robot", description: "Proyectos que requieren robots, kits de robótica o hardware específico" },
      { value: "Sin Robot", description: "Proyectos que no requieren hardware adicional" }
    ]
  }
};

// Complete Project Database
export const ALL_PROJECTS = [
  // Initial Projects
  {
    id: 1,
    title: "Nicolás Copérnico",
    subtitle: "Esperando asignaturas...",
    level: "3.ª Primaria",
    sessions: 1,
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Proyecto sobre el astrónomo Nicolás Copérnico y el modelo heliocéntrico del sistema solar"
  },
  {
    id: 10,
    title: "NO TOCAR - SCRATCH JR",
    level: "2.ª Primaria",
    sessions: 5,
    subject: "LENGUA CASTELLANA Y LITERATURA",
    category: "STEAM (Programación y robótica)",
    etapa: "Primaria",
    area: "Lenguaje",
    robot_needed: true,
    description: "Introducción a la programación visual con Scratch Jr integrado con lengua castellana"
  },
  {
    id: 11,
    title: "NO TOCAR - IMPRESIÓN 3D",
    level: "2.ª Secundaria",
    sessions: 10,
    subject: "MATEMÁTICAS",
    category: "STEAM (Programación y robótica)",
    etapa: "Secundaria",
    area: "Matemáticas",
    robot_needed: true,
    description: "Diseño y fabricación de objetos tridimensionales aplicando conceptos matemáticos"
  },
  {
    id: 12,
    title: "NO TOCAR - ESTRELLAS",
    level: "6.ª Primaria",
    sessions: 5,
    subject: "CIENCIAS DE LA NATURALEZA",
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Estudio de las estrellas, constelaciones y astronomía básica"
  },
  {
    id: 13,
    title: "Diseño de Apps con IA",
    level: "Bachillerato",
    sessions: 8,
    subject: "Tecnología",
    category: "IA",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: false,
    description: "Creación de aplicaciones móviles integrando funcionalidades de inteligencia artificial"
  },
  {
    id: 14,
    title: "El Arte y el Código",
    level: "Secundaria",
    sessions: 4,
    subject: "Artes Plásticas",
    category: "Creatividad",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Exploración de la intersección entre arte visual y programación creativa"
  },

  // STEAM Projects (10 projects)
  {
    id: 20,
    title: "Construcción del Robot Rastreador",
    subtitle: "Introducción a la programación de movimientos.",
    level: "3.º Secundaria",
    sessions: 8,
    category: "STEAM (Programación y robótica)",
    etapa: "Secundaria",
    area: "Tecnología",
    robot_needed: true,
    description: "Construcción y programación de un robot que sigue líneas negras usando sensores"
  },
  {
    id: 21,
    title: "Programación de Videojuegos con Scratch",
    subtitle: "Lógica de eventos y desarrollo de historias.",
    level: "4.º Primaria",
    sessions: 6,
    category: "STEAM (Programación y robótica)",
    etapa: "Primaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Creación de videojuegos interactivos usando programación por bloques en Scratch"
  },
  {
    id: 22,
    title: "Introducción a la Electrónica con Arduino",
    subtitle: "Control de luces y componentes básicos.",
    level: "1.º Bachillerato",
    sessions: 10,
    category: "STEAM (Programación y robótica)",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: true,
    description: "Fundamentos de electrónica y programación con placas Arduino y componentes básicos"
  },
  {
    id: 23,
    title: "Diseño y Control de Drones",
    subtitle: "Principios de vuelo y seguridad aérea.",
    level: "2.º Bachillerato",
    sessions: 12,
    category: "STEAM (Programación y robótica)",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: true,
    description: "Estudio de aerodinámica, física del vuelo y control de drones mediante programación"
  },
  {
    id: 24,
    title: "Geometría y Cifrado con Python",
    subtitle: "Aplicación de funciones matemáticas en seguridad.",
    level: "4.º Secundaria",
    sessions: 7,
    category: "STEAM (Programación y robótica)",
    etapa: "Secundaria",
    area: "Matemáticas",
    robot_needed: false,
    description: "Implementación de algoritmos de cifrado usando matemáticas y programación en Python"
  },
  {
    id: 25,
    title: "Desafío de Ingeniería LEGO",
    subtitle: "Estructuras resistentes y mecanismos de poleas.",
    level: "5.º Primaria",
    sessions: 5,
    category: "STEAM (Programación y robótica)",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: true,
    description: "Construcción de estructuras y mecanismos usando kits LEGO aplicando principios de ingeniería"
  },
  {
    id: 26,
    title: "Circuitos Interactivos con Makey Makey",
    subtitle: "Conectando objetos cotidianos al ordenador.",
    level: "6.º Primaria",
    sessions: 4,
    category: "STEAM (Programación y robótica)",
    etapa: "Primaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Creación de interfaces interactivas convirtiendo objetos cotidianos en controladores"
  },
  {
    id: 27,
    title: "Modelado de Ciudad Sostenible (3D)",
    subtitle: "Diseño de infraestructuras verdes en 3D.",
    level: "3.º Secundaria",
    sessions: 9,
    category: "STEAM (Programación y robótica)",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Diseño de ciudades sostenibles usando software de modelado 3D y principios ecológicos"
  },
  {
    id: 28,
    title: "Sensores y Recolección de Datos",
    subtitle: "Medición de temperatura, humedad y luz.",
    level: "1.º Bachillerato",
    sessions: 8,
    category: "STEAM (Programación y robótica)",
    etapa: "Bachillerato",
    area: "Ciencias",
    robot_needed: true,
    description: "Uso de sensores electrónicos para recopilar datos ambientales y analizarlos"
  },
  {
    id: 29,
    title: "Robótica para Infantil",
    subtitle: "Movimiento básico y secuenciación de órdenes.",
    level: "Educación Infantil",
    sessions: 3,
    category: "STEAM (Programación y robótica)",
    etapa: "Educación Infantil",
    area: "Tecnología",
    robot_needed: true,
    description: "Introducción a la robótica con robots educativos como Bee-Bot para los más pequeños"
  },

  // Creatividad Projects (10 projects)
  {
    id: 30,
    title: "Taller de Ilustración Digital",
    subtitle: "Dominio de capas y herramientas de dibujo.",
    level: "3.º Secundaria",
    sessions: 6,
    category: "Creatividad",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Técnicas de ilustración digital usando software profesional y tableta gráfica"
  },
  {
    id: 31,
    title: "Creación de Cuentos Animados",
    subtitle: "Guion, voz en off y animación de personajes.",
    level: "2.º Primaria",
    sessions: 4,
    category: "Creatividad",
    etapa: "Primaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Desarrollo de cuentos digitales animados combinando narrativa y creatividad visual"
  },
  {
    id: 32,
    title: "Escultura con Materiales Reciclados",
    subtitle: "Volumen, forma y conciencia ambiental.",
    level: "Educación Infantil",
    sessions: 3,
    category: "Creatividad",
    etapa: "Educación Infantil",
    area: "Artes",
    robot_needed: false,
    description: "Creación de esculturas usando materiales reciclados, fomentando la creatividad y sostenibilidad"
  },
  {
    id: 33,
    title: "Diseño de Vestuario Teatral",
    subtitle: "Bocetos, texturas y simbolismo en el vestuario.",
    level: "1.º Bachillerato",
    sessions: 5,
    category: "Creatividad",
    etapa: "Bachillerato",
    area: "Artes",
    robot_needed: false,
    description: "Diseño de vestuario para producciones teatrales considerando personajes y narrativa"
  },
  {
    id: 34,
    title: "Fotografía con Efecto Pinhole",
    subtitle: "Construcción de una cámara oscura y revelado.",
    level: "4.º Secundaria",
    sessions: 7,
    category: "Creatividad",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Exploración de principios ópticos mediante la construcción de cámaras estenopeicas"
  },
  {
    id: 35,
    title: "Poesía Visual Interactiva",
    subtitle: "Combinando tipografía, diseño y programación.",
    level: "2.º Bachillerato",
    sessions: 6,
    category: "Creatividad",
    etapa: "Bachillerato",
    area: "Lenguaje",
    robot_needed: false,
    description: "Creación de poesía visual interactiva usando diseño gráfico y código"
  },
  {
    id: 36,
    title: "Creación de Música Electrónica Simple",
    subtitle: "Uso de loops y sintetizadores virtuales.",
    level: "3.º Secundaria",
    sessions: 5,
    category: "Creatividad",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Introducción a la producción musical digital con software de audio"
  },
  {
    id: 37,
    title: "Narrativa Gráfica y Cómic",
    subtitle: "Estructura de viñetas, diálogos y acción.",
    level: "5.º Primaria",
    sessions: 6,
    category: "Creatividad",
    etapa: "Primaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Creación de cómics desarrollando habilidades narrativas y visuales"
  },
  {
    id: 38,
    title: "Diseño de Logotipos y Branding",
    subtitle: "Psicología del color y tipografía de marca.",
    level: "1.º Bachillerato",
    sessions: 4,
    category: "Creatividad",
    etapa: "Bachillerato",
    area: "Artes",
    robot_needed: false,
    description: "Fundamentos de diseño de identidad visual y branding corporativo"
  },
  {
    id: 39,
    title: "Stop Motion Animación",
    subtitle: "Técnicas de captura de movimiento con objetos.",
    level: "6.º Primaria",
    sessions: 7,
    category: "Creatividad",
    etapa: "Primaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Creación de animaciones stop motion usando objetos físicos y fotografía"
  },

  // IA Projects (10 projects)
  {
    id: 40,
    title: "Introducción a Redes Neuronales",
    subtitle: "Conceptos básicos de aprendizaje profundo.",
    level: "2.º Bachillerato",
    sessions: 10,
    category: "IA",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: false,
    description: "Fundamentos de redes neuronales y aprendizaje automático con ejemplos prácticos"
  },
  {
    id: 41,
    title: "Clasificación de Imágenes con Teachable Machine",
    subtitle: "Entrenamiento de modelos de reconocimiento visual.",
    level: "3.º Secundaria",
    sessions: 6,
    category: "IA",
    etapa: "Secundaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Uso de Teachable Machine para entrenar modelos de clasificación de imágenes sin código"
  },
  {
    id: 42,
    title: "Ética y Sesgos en la IA",
    subtitle: "Análisis de algoritmos en la sociedad.",
    level: "1.º Bachillerato",
    sessions: 5,
    category: "IA",
    etapa: "Bachillerato",
    area: "Lenguaje",
    robot_needed: false,
    description: "Reflexión crítica sobre el impacto ético y social de la inteligencia artificial"
  },
  {
    id: 43,
    title: "Chatbots y Procesamiento de Lenguaje Natural",
    subtitle: "Diseño de diálogos y respuestas automáticas.",
    level: "4.º Secundaria",
    sessions: 8,
    category: "IA",
    etapa: "Secundaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Creación de chatbots conversacionales usando procesamiento de lenguaje natural"
  },
  {
    id: 44,
    title: "Reconocimiento de Voz para Control de Robot",
    subtitle: "Integración de IA con hardware de robótica.",
    level: "3.º Secundaria",
    sessions: 9,
    category: "IA",
    etapa: "Secundaria",
    area: "Tecnología",
    robot_needed: true,
    description: "Control de robots mediante comandos de voz usando reconocimiento de habla"
  },
  {
    id: 45,
    title: "Aprendizaje Automático en la Meteorología",
    subtitle: "Predicción de patrones climáticos con datos.",
    level: "2.º Bachillerato",
    sessions: 7,
    category: "IA",
    etapa: "Bachillerato",
    area: "Ciencias",
    robot_needed: false,
    description: "Uso de algoritmos de aprendizaje automático para predecir patrones meteorológicos"
  },
  {
    id: 46,
    title: "Creación de Arte Generativo",
    subtitle: "Uso de algoritmos para crear imágenes abstractas.",
    level: "4.º Secundaria",
    sessions: 5,
    category: "IA",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false,
    description: "Generación de arte visual mediante algoritmos y sistemas de IA"
  },
  {
    id: 47,
    title: "Algoritmos de Recomendación",
    subtitle: "Cómo funcionan Netflix y Spotify por dentro.",
    level: "1.º Bachillerato",
    sessions: 6,
    category: "IA",
    etapa: "Bachillerato",
    area: "Matemáticas",
    robot_needed: false,
    description: "Estudio de sistemas de recomendación y algoritmos de filtrado colaborativo"
  },
  {
    id: 48,
    title: "IA y Medicina Predictiva",
    subtitle: "Simulación de diagnóstico basado en síntomas.",
    level: "2.º Bachillerato",
    sessions: 8,
    category: "IA",
    etapa: "Bachillerato",
    area: "Ciencias",
    robot_needed: false,
    description: "Exploración de aplicaciones de IA en medicina y diagnóstico de enfermedades"
  },
  {
    id: 49,
    title: "Juegos de Estrategia con IA simple",
    subtitle: "Programando un oponente básico para Tres en Raya.",
    level: "4.º Secundaria",
    sessions: 4,
    category: "IA",
    etapa: "Secundaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Programación de algoritmos de juego y estrategias de IA básicas"
  },

  // Ciudadanía Digital Projects (10 projects)
  {
    id: 50,
    title: "Huella Digital y Privacidad Online",
    subtitle: "Rastreo y control de la información personal.",
    level: "3.º Secundaria",
    sessions: 5,
    category: "Ciudadanía digital",
    etapa: "Secundaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Concienciación sobre la huella digital y protección de datos personales en internet"
  },
  {
    id: 51,
    title: "Seguridad en Redes Sociales",
    subtitle: "Configuración de cuentas y gestión de contactos.",
    level: "6.º Primaria",
    sessions: 4,
    category: "Ciudadanía digital",
    etapa: "Primaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Uso seguro y responsable de redes sociales para preadolescentes"
  },
  {
    id: 52,
    title: "Verificación de Noticias Falsas (Fake News)",
    subtitle: "Herramientas de fact-checking y pensamiento crítico.",
    level: "2.º Bachillerato",
    sessions: 6,
    category: "Ciudadanía digital",
    etapa: "Bachillerato",
    area: "Lenguaje",
    robot_needed: false,
    description: "Desarrollo de pensamiento crítico para identificar y verificar noticias falsas"
  },
  {
    id: 53,
    title: "Ciberacoso: Prevención y Respuesta",
    subtitle: "Identificación de riesgos y canales de ayuda.",
    level: "4.º Secundaria",
    sessions: 5,
    category: "Ciudadanía digital",
    etapa: "Secundaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Prevención del ciberacoso y estrategias de respuesta y apoyo"
  },
  {
    id: 54,
    title: "Derechos de Autor y Contenido Digital",
    subtitle: "Uso legítimo de imágenes, música y textos.",
    level: "1.º Bachillerato",
    sessions: 4,
    category: "Ciudadanía digital",
    etapa: "Bachillerato",
    area: "Artes",
    robot_needed: false,
    description: "Comprensión de derechos de autor, licencias Creative Commons y propiedad intelectual"
  },
  {
    id: 55,
    title: "Uso Responsable del Tiempo de Pantalla",
    subtitle: "Equilibrio entre el mundo online y offline.",
    level: "4.º Primaria",
    sessions: 3,
    category: "Ciudadanía digital",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Gestión saludable del tiempo de uso de dispositivos digitales"
  },
  {
    id: 56,
    title: "Netiqueta y Comunicación Online",
    subtitle: "Normas de cortesía y respeto en entornos digitales.",
    level: "3.º Secundaria",
    sessions: 4,
    category: "Ciudadanía digital",
    etapa: "Secundaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Normas de comportamiento y comunicación respetuosa en internet"
  },
  {
    id: 57,
    title: "El Rol del Ciudadano en el Metaverso",
    subtitle: "Interacciones, economía y leyes virtuales.",
    level: "2.º Bachillerato",
    sessions: 6,
    category: "Ciudadanía digital",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: false,
    description: "Exploración de espacios virtuales, identidad digital y ciudadanía en el metaverso"
  },
  {
    id: 58,
    title: "Consumo Crítico de Medios Digitales",
    subtitle: "Análisis de la publicidad y los influencers.",
    level: "4.º Secundaria",
    sessions: 5,
    category: "Ciudadanía digital",
    etapa: "Secundaria",
    area: "Lenguaje",
    robot_needed: false,
    description: "Desarrollo de pensamiento crítico frente al consumo de contenido digital"
  },
  {
    id: 59,
    title: "Creando Contraseñas Fuertes",
    subtitle: "Técnicas de seguridad y gestión de claves.",
    level: "5.º Primaria",
    sessions: 2,
    category: "Ciudadanía digital",
    etapa: "Primaria",
    area: "Tecnología",
    robot_needed: false,
    description: "Fundamentos de seguridad digital y creación de contraseñas robustas"
  },

  // Cultura Científica Projects (10 projects)
  {
    id: 60,
    title: "Exploración del Universo y Telescopios",
    subtitle: "Observación de planetas y constelaciones.",
    level: "5.º Primaria",
    sessions: 6,
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Introducción a la astronomía observacional y uso de telescopios"
  },
  {
    id: 61,
    title: "La Química de la Cocina",
    subtitle: "Reacciones químicas en alimentos cotidianos.",
    level: "3.º Secundaria",
    sessions: 7,
    category: "Cultura científica",
    etapa: "Secundaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Exploración de reacciones químicas mediante experimentos culinarios"
  },
  {
    id: 62,
    title: "Modelado del Sistema Solar",
    subtitle: "Escalas, órbitas y leyes de Kepler.",
    level: "4.º Primaria",
    sessions: 5,
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Construcción de modelos del sistema solar y estudio de movimientos planetarios"
  },
  {
    id: 63,
    title: "Bacterias y Microscopía",
    subtitle: "Cultivo y observación de microorganismos.",
    level: "4.º Secundaria",
    sessions: 8,
    category: "Cultura científica",
    etapa: "Secundaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Introducción a la microbiología mediante cultivo y observación microscópica"
  },
  {
    id: 64,
    title: "Lógica y Demostraciones Matemáticas",
    subtitle: "Introducción al razonamiento deductivo.",
    level: "1.º Bachillerato",
    sessions: 9,
    category: "Cultura científica",
    etapa: "Bachillerato",
    area: "Matemáticas",
    robot_needed: false,
    description: "Desarrollo del razonamiento lógico y demostraciones matemáticas formales"
  },
  {
    id: 65,
    title: "Energías Renovables y Sostenibilidad",
    subtitle: "Construcción de un pequeño panel solar.",
    level: "3.º Secundaria",
    sessions: 7,
    category: "Cultura científica",
    etapa: "Secundaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Estudio de energías renovables con construcción de proyectos solares prácticos"
  },
  {
    id: 66,
    title: "Máquinas Simples: Palancas y Poleas",
    subtitle: "Experimentación con principios de la física.",
    level: "Educación Infantil",
    sessions: 3,
    category: "Cultura científica",
    etapa: "Educación Infantil",
    area: "Ciencias",
    robot_needed: false,
    description: "Introducción a la física mediante máquinas simples de forma lúdica"
  },
  {
    id: 67,
    title: "Análisis de Datos Genéticos",
    subtitle: "Conceptos básicos de ADN y herencia.",
    level: "2.º Bachillerato",
    sessions: 10,
    category: "Cultura científica",
    etapa: "Bachillerato",
    area: "Ciencias",
    robot_needed: false,
    description: "Introducción a la genética y análisis de patrones de herencia"
  },
  {
    id: 68,
    title: "Biomasa y Ciclos del Carbono",
    subtitle: "Impacto ambiental y producción de energía.",
    level: "4.º Secundaria",
    sessions: 6,
    category: "Cultura científica",
    etapa: "Secundaria",
    area: "Ciencias",
    robot_needed: true,
    description: "Estudio del ciclo del carbono y producción de energía a partir de biomasa"
  },
  {
    id: 69,
    title: "Los Secretos del Agua",
    subtitle: "Ciclo del agua, estados y purificación.",
    level: "6.º Primaria",
    sessions: 4,
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false,
    description: "Exploración del ciclo del agua y métodos de purificación"
  }
];

// How-to guides for common tasks
export const HOW_TO_GUIDES = {
  search_projects: {
    title: "Cómo buscar proyectos",
    steps: [
      "Ve a la sección 'Biblioteca' desde el Dashboard o presiona Alt+2",
      "Usa la barra de búsqueda en la columna izquierda para buscar por nombre",
      "Aplica filtros por Etapa educativa, Área temática o Necesidad de robot",
      "Haz clic en las categorías en la parte superior para ver proyectos por tipo",
      "Los filtros se aplican automáticamente - verás el número de proyectos coincidentes"
    ]
  },
  filter_by_stage: {
    title: "Cómo filtrar por etapa educativa",
    steps: [
      "En la Biblioteca, ve al panel de filtros en la columna izquierda",
      "En la sección 'Etapa', haz clic en: Educación Infantil, Primaria, Secundaria o Bachillerato",
      "El filtro se aplica inmediatamente y solo verás proyectos de esa etapa",
      "Para quitar el filtro, haz clic nuevamente en la misma etapa"
    ]
  },
  filter_by_robot: {
    title: "Cómo filtrar proyectos con/sin robot",
    steps: [
      "En la Biblioteca, busca la sección 'Necesita Robot' en el panel de filtros",
      "Haz clic en 'Con Robot' para ver solo proyectos que requieren hardware de robótica",
      "Haz clic en 'Sin Robot' para ver proyectos que no necesitan equipamiento adicional",
      "Esto es útil para planificar según los recursos disponibles en tu centro"
    ]
  },
  create_class: {
    title: "Cómo crear una clase",
    steps: [
      "Ve a la sección 'Mis clases' desde el Dashboard o presiona Alt+1",
      "Haz clic en el botón 'Crear Clase'",
      "Completa el formulario con el nombre de la clase, nivel educativo y asignatura",
      "Una vez creada, podrás añadir proyectos de la Biblioteca a tu clase"
    ]
  },
  join_class: {
    title: "Cómo unirse a una clase",
    steps: [
      "Ve a la sección 'Mis clases'",
      "Haz clic en el botón 'Unirse a Clase'",
      "Introduce el código de clase que te proporcionó el docente creador",
      "Una vez unido, verás la clase en tu lista de clases activas"
    ]
  },
  keyboard_shortcuts: {
    title: "Atajos de teclado disponibles",
    shortcuts: [
      { key: "Alt + 1", action: "Ir a Mis Clases" },
      { key: "Alt + 2", action: "Ir a Biblioteca" },
      { key: "Alt + 3", action: "Ir a Recursos" },
      { key: "Alt + 4", action: "Ir a En tu Casa" },
      { key: "Alt + H", action: "Volver al Dashboard" }
    ]
  },
  mobile_navigation: {
    title: "Navegación en dispositivos móviles",
    steps: [
      "En móvil, encontrarás una barra de navegación en la parte inferior de la pantalla",
      "Los iconos representan: Inicio (Dashboard), Clases, Proyectos (Biblioteca) y Más (Recursos)",
      "Toca cualquier icono para cambiar de sección",
      "La sección activa se muestra con color rosa/morado"
    ]
  }
};

// Common questions and answers
export const FAQ = {
  categories: [
    {
      category: "General",
      questions: [
        {
          q: "¿Qué es GoSteam Evolution?",
          a: "GoSteam Evolution es una plataforma educativa de Edelvives diseñada para profesores españoles. Ofrece más de 76 proyectos interdisciplinares STEAM (Ciencia, Tecnología, Ingeniería, Arte y Matemáticas) listos para usar en el aula."
        },
        {
          q: "¿Cuántos proyectos hay disponibles?",
          a: "Actualmente hay 76 proyectos disponibles distribuidos en 5 categorías: STEAM (Programación y robótica), Creatividad, IA, Ciudadanía digital y Cultura científica."
        },
        {
          q: "¿Los proyectos son gratuitos?",
          a: "La disponibilidad y coste de los proyectos depende de tu suscripción a Edelvives. Contacta con tu centro educativo o con Edelvives para más información."
        }
      ]
    },
    {
      category: "Uso de la plataforma",
      questions: [
        {
          q: "¿Cómo busco proyectos?",
          a: "Ve a la sección Biblioteca (Alt+2), donde puedes usar la barra de búsqueda o aplicar filtros por etapa educativa, área temática y necesidad de robot. También puedes filtrar por las 5 categorías STEAM."
        },
        {
          q: "¿Qué significa 'Con Robot' o 'Sin Robot'?",
          a: "'Con Robot' indica que el proyecto requiere hardware de robótica (como LEGO, Arduino, Bee-Bot, etc.). 'Sin Robot' significa que el proyecto se puede hacer solo con ordenadores o materiales básicos."
        },
        {
          q: "¿Puedo usar atajos de teclado?",
          a: "Sí, puedes usar: Alt+1 (Mis Clases), Alt+2 (Biblioteca), Alt+3 (Recursos), Alt+4 (En tu Casa) y Alt+H (Dashboard)."
        },
        {
          q: "¿Cómo funciona en móvil?",
          a: "En dispositivos móviles encontrarás una barra de navegación inferior con accesos directos a las principales secciones. La interfaz está optimizada para pantallas táctiles."
        }
      ]
    },
    {
      category: "Proyectos",
      questions: [
        {
          q: "¿Cuántas sesiones dura cada proyecto?",
          a: "La duración varía según el proyecto. Pueden ser desde 2 sesiones (ej: Creando Contraseñas Fuertes) hasta 12 sesiones (ej: Diseño y Control de Drones). La información aparece en cada tarjeta de proyecto."
        },
        {
          q: "¿Los proyectos están adaptados a diferentes edades?",
          a: "Sí, todos los proyectos indican claramente la etapa educativa recomendada: Educación Infantil (3-6 años), Primaria (6-12 años), Secundaria (12-16 años) o Bachillerato (16-18 años)."
        },
        {
          q: "¿Puedo modificar los proyectos?",
          a: "Los proyectos están diseñados para ser flexibles y personalizables según las necesidades de tu aula. Puedes adaptarlos a tu contexto educativo específico."
        }
      ]
    }
  ]
};

// Platform statistics
export const PLATFORM_STATS = {
  total_projects: 76,
  active_classes_example: 3,
  categories: 5,
  educational_stages: 4,
  subject_areas: 5
};
