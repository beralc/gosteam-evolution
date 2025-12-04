import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Bell, UserCircle, BookOpen, Clock, Users, MoreVertical, Image, Menu, Sparkles, Palette, Cpu, Shield, Globe, Home, X, Send, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { initializeOpenAI, chatWithAssistant } from './utils/openai.js';

// --- Mock Data y Nuevas Estructuras ---

// Se añade información de etapa, área y si requiere robot para los filtros.
const initialMockProjects = [
  {
    id: 1,
    title: "Nicolás Copérnico",
    image: "https://placehold.co/200x120/C83E7F/ffffff?text=Copernico",
    subtitle: "Esperando asignaturas...",
    level: "3.ª Primaria",
    sessions: 1,
    language: "Castellano",
    teachers: 0,
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false
  },
  {
    id: 10,
    title: "NO TOCAR - SCRATCH JR - ...",
    image: "https://placehold.co/200x120/C83E7F/ffffff?text=Scratch",
    level: "2.ª Primaria",
    sessions: 5,
    language: "Castellano",
    teachers: 3,
    tag: "Proyecto Interdisciplinar",
    subject: "LENGUA CASTELLANA Y LITERA",
    category: "STEAM (Programación y robótica)",
    etapa: "Primaria",
    area: "Lenguaje",
    robot_needed: true
  },
  {
    id: 11,
    title: "NO TOCAR - IMPRESIÓN 3D...",
    image: "https://placehold.co/200x120/C83E7F/ffffff?text=3D",
    level: "2.ª Secundaria",
    sessions: 10,
    language: "Castellano",
    teachers: 1,
    subject: "MATEMÁTICAS",
    category: "STEAM (Programación y robótica)",
    etapa: "Secundaria",
    area: "Matemáticas",
    robot_needed: true
  },
  {
    id: 12,
    title: "NO TOCAR - ESTRELLAS...",
    image: "https://placehold.co/200x120/49A0DE/ffffff?text=Chimps",
    level: "6.ª Primaria",
    sessions: 5,
    language: "Castellano",
    teachers: 1,
    subject: "CIENCIAS DE LA NATURALEZA",
    category: "Cultura científica",
    etapa: "Primaria",
    area: "Ciencias",
    robot_needed: false
  },
  {
    id: 13,
    title: "Diseño de Apps con IA",
    image: "https://placehold.co/200x120/49A0DE/ffffff?text=IA+App",
    level: "Bachillerato",
    sessions: 8,
    language: "Castellano",
    teachers: 2,
    subject: "Tecnología",
    category: "IA",
    etapa: "Bachillerato",
    area: "Tecnología",
    robot_needed: false
  },
  {
    id: 14,
    title: "El Arte y el Código",
    image: "https://placehold.co/200x120/FBEB4E/000000?text=Arte",
    level: "Secundaria",
    sessions: 4,
    language: "Castellano",
    teachers: 1,
    subject: "Artes Plásticas",
    category: "Creatividad",
    etapa: "Secundaria",
    area: "Artes",
    robot_needed: false
  },
];

// --- 50 Proyectos adicionales (10 por categoría) ---

const steamProjects = [
    // STEAM (Programación y robótica) - 10 proyectos
    { id: 20, title: "Construcción del Robot Rastreador", subtitle: "Introducción a la programación de movimientos.", level: "3.º Secundaria", sessions: 8, language: "Castellano", teachers: 2, category: "STEAM (Programación y robótica)", etapa: "Secundaria", area: "Tecnología", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Robot+1" },
    { id: 21, title: "Programación de Videojuegos con Scratch", subtitle: "Lógica de eventos y desarrollo de historias.", level: "4.º Primaria", sessions: 6, language: "Castellano", teachers: 1, category: "STEAM (Programación y robótica)", etapa: "Primaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Scratch+Juego" },
    { id: 22, title: "Introducción a la Electrónica con Arduino", subtitle: "Control de luces y componentes básicos.", level: "1.º Bachillerato", sessions: 10, language: "Castellano", teachers: 2, category: "STEAM (Programación y robótica)", etapa: "Bachillerato", area: "Tecnología", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Arduino" },
    { id: 23, title: "Diseño y Control de Drones", subtitle: "Principios de vuelo y seguridad aérea.", level: "2.º Bachillerato", sessions: 12, language: "Castellano", teachers: 3, category: "STEAM (Programación y robótica)", etapa: "Bachillerato", area: "Tecnología", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Drone" },
    { id: 24, title: "Geometría y Cifrado con Python", subtitle: "Aplicación de funciones matemáticas en seguridad.", level: "4.º Secundaria", sessions: 7, language: "Castellano", teachers: 1, category: "STEAM (Programación y robótica)", etapa: "Secundaria", area: "Matemáticas", robot_needed: false, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Python+Code" },
    { id: 25, title: "Desafío de Ingeniería LEGO", subtitle: "Estructuras resistentes y mecanismos de poleas.", level: "5.º Primaria", sessions: 5, language: "Castellano", teachers: 1, category: "STEAM (Programación y robótica)", etapa: "Primaria", area: "Ciencias", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=LEGO+Eng" },
    { id: 26, title: "Circuitos Interactivos con Makey Makey", subtitle: "Conectando objetos cotidianos al ordenador.", level: "6.º Primaria", sessions: 4, language: "Castellano", teachers: 1, category: "STEAM (Programación y robótica)", etapa: "Primaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Makey+Makey" },
    { id: 27, title: "Modelado de Ciudad Sostenible (3D)", subtitle: "Diseño de infraestructuras verdes en 3D.", level: "3.º Secundaria", sessions: 9, language: "Castellano", teachers: 2, category: "STEAM (Programación y robótica)", etapa: "Secundaria", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/C83E7F/ffffff?text=3D+City" },
    { id: 28, title: "Sensores y Recolección de Datos", subtitle: "Medición de temperatura, humedad y luz.", level: "1.º Bachillerato", sessions: 8, language: "Castellano", teachers: 2, category: "STEAM (Programación y robótica)", etapa: "Bachillerato", area: "Ciencias", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Sensores" },
    { id: 29, title: "Robótica para Infantil", subtitle: "Movimiento básico y secuenciación de órdenes.", level: "Educación Infantil", sessions: 3, language: "Castellano", teachers: 1, category: "STEAM (Programación y robótica)", etapa: "Educación Infantil", area: "Tecnología", robot_needed: true, image: "https://placehold.co/200x120/C83E7F/ffffff?text=Beebot" },
];

const creatividadProjects = [
    // Creatividad - 10 proyectos
    { id: 30, title: "Taller de Ilustración Digital", subtitle: "Dominio de capas y herramientas de dibujo.", level: "3.º Secundaria", sessions: 6, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Secundaria", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Digital+Art" },
    { id: 31, title: "Creación de Cuentos Animados", subtitle: "Guion, voz en off y animación de personajes.", level: "2.º Primaria", sessions: 4, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Primaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Cuentos" },
    { id: 32, title: "Escultura con Materiales Reciclados", subtitle: "Volumen, forma y conciencia ambiental.", level: "Educación Infantil", sessions: 3, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Educación Infantil", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Reciclaje" },
    { id: 33, title: "Diseño de Vestuario Teatral", subtitle: "Bocetos, texturas y simbolismo en el vestuario.", level: "1.º Bachillerato", sessions: 5, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Bachillerato", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Teatro" },
    { id: 34, title: "Fotografía con Efecto Pinhole", subtitle: "Construcción de una cámara oscura y revelado.", level: "4.º Secundaria", sessions: 7, language: "Castellano", teachers: 2, category: "Creatividad", etapa: "Secundaria", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Pinhole" },
    { id: 35, title: "Poesía Visual Interactiva", subtitle: "Combinando tipografía, diseño y programación.", level: "2.º Bachillerato", sessions: 6, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Bachillerato", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Poesia+Web" },
    { id: 36, title: "Creación de Música Electrónica Simple", subtitle: "Uso de loops y sintetizadores virtuales.", level: "3.º Secundaria", sessions: 5, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Secundaria", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Musica+Dig" },
    { id: 37, title: "Narrativa Gráfica y Cómic", subtitle: "Estructura de viñetas, diálogos y acción.", level: "5.º Primaria", sessions: 6, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Primaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Comic" },
    { id: 38, title: "Diseño de Logotipos y Branding", subtitle: "Psicología del color y tipografía de marca.", level: "1.º Bachillerato", sessions: 4, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Bachillerato", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Branding" },
    { id: 39, title: "Stop Motion Animación", subtitle: "Técnicas de captura de movimiento con objetos.", level: "6.º Primaria", sessions: 7, language: "Castellano", teachers: 1, category: "Creatividad", etapa: "Primaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/FBEB4E/000000?text=Stop+Motion" },
];

const iaProjects = [
    // IA - 10 proyectos
    { id: 40, title: "Introducción a Redes Neuronales", subtitle: "Conceptos básicos de aprendizaje profundo.", level: "2.º Bachillerato", sessions: 10, language: "Castellano", teachers: 2, category: "IA", etapa: "Bachillerato", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=NN+Basic" },
    { id: 41, title: "Clasificación de Imágenes con Teachable Machine", subtitle: "Entrenamiento de modelos de reconocimiento visual.", level: "3.º Secundaria", sessions: 6, language: "Castellano", teachers: 1, category: "IA", etapa: "Secundaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Teachable" },
    { id: 42, title: "Ética y Sesgos en la IA", subtitle: "Análisis de algoritmos en la sociedad.", level: "1.º Bachillerato", sessions: 5, language: "Castellano", teachers: 1, category: "IA", etapa: "Bachillerato", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=IA+Etica" },
    { id: 43, title: "Chatbots y Procesamiento de Lenguaje Natural", subtitle: "Diseño de diálogos y respuestas automáticas.", level: "4.º Secundaria", sessions: 8, language: "Castellano", teachers: 2, category: "IA", etapa: "Secundaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Chatbot" },
    { id: 44, title: "Reconocimiento de Voz para Control de Robot", subtitle: "Integración de IA con hardware de robótica.", level: "3.º Secundaria", sessions: 9, language: "Castellano", teachers: 2, category: "IA", etapa: "Secundaria", area: "Tecnología", robot_needed: true, image: "https://placehold.co/200x120/49A0DE/ffffff?text=IA+Robot" },
    { id: 45, title: "Aprendizaje Automático en la Meteorología", subtitle: "Predicción de patrones climáticos con datos.", level: "2.º Bachillerato", sessions: 7, language: "Castellano", teachers: 1, category: "IA", etapa: "Bachillerato", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=IA+Meteo" },
    { id: 46, title: "Creación de Arte Generativo", subtitle: "Uso de algoritmos para crear imágenes abstractas.", level: "4.º Secundaria", sessions: 5, language: "Castellano", teachers: 1, category: "IA", etapa: "Secundaria", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Arte+IA" },
    { id: 47, title: "Algoritmos de Recomendación", subtitle: "Cómo funcionan Netflix y Spotify por dentro.", level: "1.º Bachillerato", sessions: 6, language: "Castellano", teachers: 1, category: "IA", etapa: "Bachillerato", area: "Matemáticas", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Recomendador" },
    { id: 48, title: "IA y Medicina Predictiva", subtitle: "Simulación de diagnóstico basado en síntomas.", level: "2.º Bachillerato", sessions: 8, language: "Castellano", teachers: 2, category: "IA", etapa: "Bachillerato", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Medicina+IA" },
    { id: 49, title: "Juegos de Estrategia con IA simple", subtitle: "Programando un oponente básico para Tres en Raya.", level: "4.º Secundaria", sessions: 4, language: "Castellano", teachers: 1, category: "IA", etapa: "Secundaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=IA+Juegos" },
];

const ciudadaniaProjects = [
    // Ciudadanía digital - 10 proyectos
    { id: 50, title: "Huella Digital y Privacidad Online", subtitle: "Rastreo y control de la información personal.", level: "3.º Secundaria", sessions: 5, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Secundaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Privacidad" },
    { id: 51, title: "Seguridad en Redes Sociales", subtitle: "Configuración de cuentas y gestión de contactos.", level: "6.º Primaria", sessions: 4, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Primaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=RRSS" },
    { id: 52, title: "Verificación de Noticias Falsas (Fake News)", subtitle: "Herramientas de fact-checking y pensamiento crítico.", level: "2.º Bachillerato", sessions: 6, language: "Castellano", teachers: 2, category: "Ciudadanía digital", etapa: "Bachillerato", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Fake+News" },
    { id: 53, title: "Ciberacoso: Prevención y Respuesta", subtitle: "Identificación de riesgos y canales de ayuda.", level: "4.º Secundaria", sessions: 5, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Secundaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Ciberacoso" },
    { id: 54, title: "Derechos de Autor y Contenido Digital", subtitle: "Uso legítimo de imágenes, música y textos.", level: "1.º Bachillerato", sessions: 4, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Bachillerato", area: "Artes", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Copyright" },
    { id: 55, title: "Uso Responsable del Tiempo de Pantalla", subtitle: "Equilibrio entre el mundo online y offline.", level: "4.º Primaria", sessions: 3, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Primaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Screen+Time" },
    { id: 56, title: "Netiqueta y Comunicación Online", subtitle: "Normas de cortesía y respeto en entornos digitales.", level: "3.º Secundaria", sessions: 4, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Secundaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Netiqueta" },
    { id: 57, title: "El Rol del Ciudadano en el Metaverso", subtitle: "Interacciones, economía y leyes virtuales.", level: "2.º Bachillerato", sessions: 6, language: "Castellano", teachers: 2, category: "Ciudadanía digital", etapa: "Bachillerato", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Metaverso" },
    { id: 58, title: "Consumo Crítico de Medios Digitales", subtitle: "Análisis de la publicidad y los influencers.", level: "4.º Secundaria", sessions: 5, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Secundaria", area: "Lenguaje", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Consumo+Crit" },
    { id: 59, title: "Creando Contraseñas Fuertes", subtitle: "Técnicas de seguridad y gestión de claves.", level: "5.º Primaria", sessions: 2, language: "Castellano", teachers: 1, category: "Ciudadanía digital", etapa: "Primaria", area: "Tecnología", robot_needed: false, image: "https://placehold.co/200x120/8DB442/ffffff?text=Contraseñas" },
];

const culturaProjects = [
    // Cultura científica - 10 proyectos
    { id: 60, title: "Exploración del Universo y Telescopios", subtitle: "Observación de planetas y constelaciones.", level: "5.º Primaria", sessions: 6, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Primaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Telescopio" },
    { id: 61, title: "La Química de la Cocina", subtitle: "Reacciones químicas en alimentos cotidianos.", level: "3.º Secundaria", sessions: 7, language: "Castellano", teachers: 2, category: "Cultura científica", etapa: "Secundaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Quimica+Coc" },
    { id: 62, title: "Modelado del Sistema Solar", subtitle: "Escalas, órbitas y leyes de Kepler.", level: "4.º Primaria", sessions: 5, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Primaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Sistema+Sol" },
    { id: 63, title: "Bacterias y Microscopía", subtitle: "Cultivo y observación de microorganismos.", level: "4.º Secundaria", sessions: 8, language: "Castellano", teachers: 2, category: "Cultura científica", etapa: "Secundaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Microscopio" },
    { id: 64, title: "Lógica y Demostraciones Matemáticas", subtitle: "Introducción al razonamiento deductivo.", level: "1.º Bachillerato", sessions: 9, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Bachillerato", area: "Matemáticas", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Logica+Mat" },
    { id: 65, title: "Energías Renovables y Sostenibilidad", subtitle: "Construcción de un pequeño panel solar.", level: "3.º Secundaria", sessions: 7, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Secundaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Renovables" },
    { id: 66, title: "Máquinas Simples: Palancas y Poleas", subtitle: "Experimentación con principios de la física.", level: "Educación Infantil", sessions: 3, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Educación Infantil", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Maquinas+Sim" },
    { id: 67, title: "Análisis de Datos Genéticos", subtitle: "Conceptos básicos de ADN y herencia.", level: "2.º Bachillerato", sessions: 10, language: "Castellano", teachers: 2, category: "Cultura científica", etapa: "Bachillerato", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Genetica" },
    { id: 68, title: "Biomasa y Ciclos del Carbono", subtitle: "Impacto ambiental y producción de energía.", level: "4.º Secundaria", sessions: 6, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Secundaria", area: "Ciencias", robot_needed: true, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Carbono" },
    { id: 69, title: "Los Secretos del Agua", subtitle: "Ciclo del agua, estados y purificación.", level: "6.º Primaria", sessions: 4, language: "Castellano", teachers: 1, category: "Cultura científica", etapa: "Primaria", area: "Ciencias", robot_needed: false, image: "https://placehold.co/200x120/49A0DE/ffffff?text=Agua" },
];

const mockProjects = [
    ...initialMockProjects,
    ...steamProjects,
    ...creatividadProjects,
    ...iaProjects,
    ...ciudadaniaProjects,
    ...culturaProjects,
];

const BIBLIOTECA_DATA = mockProjects;

// ✨ CAMBIO: Iconos y colores según identidad de marca GoSteam
const libraryCategories = [
    { name: "STEAM (Programación y robótica)", icon: Sparkles, color: "text-[#C83E7F]", key: "steam" },
    { name: "Creatividad", icon: Palette, color: "text-[#FBEB4E]", key: "creatividad" },
    { name: "IA", icon: Cpu, color: "text-[#49A0DE]", key: "ia" },
    { name: "Ciudadanía digital", icon: Shield, color: "text-[#8DB442]", key: "ciudadania" },
    { name: "Cultura científica", icon: Globe, color: "text-[#49A0DE]", key: "cultura" },
];

// Opciones para los filtros
const filterOptions = {
    etapa: ["Educación Infantil", "Primaria", "Secundaria", "Bachillerato"],
    area: ["Matemáticas", "Lenguaje", "Ciencias", "Tecnología", "Artes"],
    robot_needed: ["Con Robot", "Sin Robot"],
};

// Note: ASSISTANT_RESPONSES removed - now using OpenAI integration

// --- Sub-Components ---

// Componente para el Panel Lateral del Asistente con OpenAI
const AssistantChatbot = ({ isOpen, setIsOpen, setActiveTab }) => {
    const [query, setQuery] = useState('');
    const [conversationHistory, setConversationHistory] = useState([
        { type: 'bot', text: '¡Hola! Soy tu Asistente GoSteam. Puedo ayudarte a encontrar recursos, planificar clases o responder dudas sobre la plataforma. ¿Qué necesitas hoy?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isConfigured, setIsConfigured] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [configError, setConfigError] = useState('');
    const chatEndRef = React.useRef(null);

    // Check for API key in environment variables or localStorage on mount
    useEffect(() => {
        // First, check for environment variable
        const envKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (envKey) {
            try {
                initializeOpenAI(envKey);
                setApiKey(envKey);
                setIsConfigured(true);
                // Don't store env key in localStorage
                return;
            } catch (error) {
                console.error('Error initializing OpenAI from env:', error);
            }
        }

        // If no env key, check localStorage
        const storedKey = localStorage.getItem('gosteam_openai_key');
        if (storedKey) {
            try {
                initializeOpenAI(storedKey);
                setApiKey(storedKey);
                setIsConfigured(true);
            } catch (error) {
                console.error('Error initializing OpenAI from storage:', error);
            }
        }
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationHistory]);

    const handleConfigureAPI = () => {
        if (!apiKey.trim()) {
            setConfigError('Por favor, introduce una clave de API válida.');
            return;
        }

        try {
            initializeOpenAI(apiKey.trim());
            localStorage.setItem('gosteam_openai_key', apiKey.trim());
            setIsConfigured(true);
            setShowConfig(false);
            setConfigError('');
            setConversationHistory([
                { type: 'bot', text: '¡Perfecto! La clave de API se ha configurado correctamente. Ahora puedo ayudarte con tus preguntas. ¿Qué necesitas saber?' }
            ]);
        } catch (error) {
            setConfigError('Error al configurar la API. Verifica que la clave sea correcta.');
        }
    };

    const handleSend = async (userText) => {
        if (!userText.trim()) return;

        // Add user message
        const userMessage = { type: 'user', text: userText };
        setConversationHistory(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);

        try {
            // Call OpenAI
            const response = await chatWithAssistant(userText, conversationHistory);

            if (response.success) {
                const botMessage = { type: 'bot', text: response.message };
                setConversationHistory(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    type: 'bot',
                    text: `❌ ${response.error || 'Hubo un error al procesar tu consulta. Por favor, intenta de nuevo.'}`,
                    isError: true
                };
                setConversationHistory(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error in handleSend:', error);
            const errorMessage = {
                type: 'bot',
                text: '❌ Error de conexión. Por favor, verifica tu clave de API y tu conexión a internet.',
                isError: true
            };
            setConversationHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBotLinkClick = (e, href) => {
        e.preventDefault();

        // Map of link hrefs to tab names
        const linkToTab = {
            'biblioteca': 'Biblioteca',
            'mis-clases': 'Mis clases',
            'dashboard': 'Dashboard',
            'recursos': 'Recursos',
            'en-tu-casa': 'En tu casa'
        };

        // Find matching tab
        const lowerHref = href.toLowerCase();
        for (const [key, tabName] of Object.entries(linkToTab)) {
            if (lowerHref.includes(key)) {
                setIsOpen(false); // Close assistant
                setActiveTab(tabName); // Navigate to section
                return;
            }
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            handleSend(query);
        }
    };

    const handleResetConfig = () => {
        localStorage.removeItem('gosteam_openai_key');
        setApiKey('');
        setIsConfigured(false);
        setShowConfig(false);
        setConversationHistory([
            { type: 'bot', text: 'Configuración eliminada. Por favor, introduce tu clave de API de OpenAI para comenzar.' }
        ]);
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full lg:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header del Asistente */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-gosteam-purple" />
                    <h3 className="text-lg font-bold text-gray-800 font-display">Asistente GoSteam</h3>
                    {isConfigured && (
                        <CheckCircle className="w-4 h-4 text-green-500" title="OpenAI conectado" />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                        aria-label="Configuración"
                        title="Configurar API"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                        aria-label="Cerrar Asistente"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Configuration Panel */}
            {showConfig && (
                <div className="p-4 bg-amber-50 border-b border-amber-200">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configuración de API
                    </h4>
                    <div className="space-y-2">
                        <input
                            type="password"
                            placeholder="sk-..."
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gosteam-purple"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        {configError && (
                            <p className="text-xs text-red-600">{configError}</p>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfigureAPI}
                                className="flex-1 py-2 px-3 bg-gosteam-purple text-white text-sm rounded-lg hover:bg-gosteam-purple-dark transition"
                            >
                                Guardar
                            </button>
                            {isConfigured && (
                                <button
                                    onClick={handleResetConfig}
                                    className="py-2 px-3 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-600">
                            Tu clave se guarda localmente en tu navegador y nunca se envía a nuestros servidores.
                        </p>
                    </div>
                </div>
            )}

            {/* API Key Warning */}
            {!isConfigured && !showConfig && (
                <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-800 font-medium">
                                Configuración requerida
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Necesitas configurar tu clave de API de OpenAI para usar el asistente.
                            </p>
                            <button
                                onClick={() => setShowConfig(true)}
                                className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
                            >
                                Configurar ahora
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Historial de Conversación */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto assistant-scrollbar">
                {conversationHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg shadow-sm whitespace-pre-line ${msg.type === 'user'
                            ? 'bg-gosteam-purple text-white rounded-br-none'
                            : msg.isError
                            ? 'bg-red-50 text-red-800 rounded-tl-none border border-red-200'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}
                        >
                            {msg.type === 'bot' && !msg.isError && <span className="font-semibold block mb-1">GoSteam:</span>}

                            {/* Parse markdown-style links */}
                            {msg.text.split(/(\[.*?\]\([^)]*\))/g).map((part, pIndex) => {
                                if (part.startsWith('[')) {
                                    const match = part.match(/\[(.*?)\]\(([^)]*)\)/);
                                    if (match) {
                                        const text = match[1];
                                        const href = match[2];
                                        return <a
                                            key={pIndex}
                                            href={href}
                                            className="text-gosteam-purple hover:text-gosteam-purple-dark underline font-medium"
                                            onClick={(e) => handleBotLinkClick(e, href)}
                                        >
                                            {text}
                                        </a>;
                                    }
                                }
                                return <span key={pIndex}>{part}</span>;
                            })}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 rounded-tl-none">
                            <span className="font-semibold block mb-1">GoSteam:</span>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gosteam-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gosteam-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gosteam-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">Pensando...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Barra de Entrada */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <form onSubmit={handleFormSubmit} className="flex items-center bg-white border border-gray-300 rounded-xl p-1 shadow-inner">
                    <input
                        type="text"
                        placeholder={isConfigured ? "Escribe tu consulta o pide ayuda..." : "Configura la API primero..."}
                        className="flex-grow p-2 text-sm border-none focus:outline-none bg-transparent disabled:text-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={!isConfigured || isLoading}
                    />

                    <div className="flex items-center space-x-1 pr-1">
                        <button
                            type="submit"
                            disabled={!query.trim() || !isConfigured || isLoading}
                            className={`p-2 rounded-lg transition ${query.trim() && isConfigured && !isLoading ? 'bg-gosteam-purple text-white hover:bg-gosteam-purple-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            aria-label="Enviar consulta"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ✨ MEJORA: Componente para la Tarjeta de Proyecto con sombras mejoradas
const ProjectCard = ({ project }) => {
    const isPublished = !project.isDraft;
    const primaryColor = isPublished ? 'text-green-600' : 'text-gosteam-purple';

    return (
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gosteam-purple">
            {/* Área de Imagen */}
            <div className={`relative h-36 flex justify-center items-center ${project.image ? '' : 'bg-gray-100'}`}>
                {project.tag && (
                    <span className="absolute top-2 left-2 bg-gosteam-purple text-white text-xs font-semibold px-2 py-1 rounded-full z-10 shadow-md">
                        {project.tag}
                    </span>
                )}
                {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Image className="w-12 h-12" />
                        <p className="mt-2 text-sm">{project.level}</p>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-sm font-semibold text-gray-800 mb-1 font-display">{project.title}</h4>
                {project.subject && <p className="text-xs text-gray-500 mb-2 uppercase">{project.subject}</p>}

                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.subtitle || project.linkText}</p>

                <p className={`text-sm font-bold ${primaryColor} mb-3`}>{project.level}</p>

                {/* Metadata */}
                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {project.sessions} sesiones
                    </span>
                    <span className="flex items-center">{project.language}</span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                    <span className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" /> {project.teachers > 0 ? `${project.teachers} docentes` : "Sin docentes"}
                    </span>
                    <div className="flex items-center">
                        <a href="#" className={`text-xs font-bold ${primaryColor} hover:underline mr-3`}>
                            Ver
                        </a>
                        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gosteam-purple" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para el Panel de Filtros
const FilterPanel = ({ filters, setFilters }) => {
    const handleFilterClick = (filterKey, option) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey] === option ? null : option
        }));
    };

    const FilterGroup = ({ title, options, filterKey }) => (
        <div className="mb-4 pb-2 border-b border-gray-100">
            <h5 className="font-semibold text-gray-700 mb-2 font-display">{title}</h5>
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleFilterClick(filterKey, option)}
                        className={`text-xs px-3 py-1 rounded-full transition
                            ${filters[filterKey] === option
                                ? 'bg-gosteam-purple text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg h-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center font-display">
                <Filter className="w-5 h-5 mr-2 text-gosteam-purple" />
                Filtros
            </h3>
            <FilterGroup
                title="Etapa"
                options={filterOptions.etapa}
                filterKey="etapa"
            />
            <FilterGroup
                title="Área"
                options={filterOptions.area}
                filterKey="area"
            />
            <FilterGroup
                title="Necesita Robot"
                options={filterOptions.robot_needed}
                filterKey="robot_needed"
            />
            <div className="text-xs text-gray-500 mt-4 italic">El filtrado se aplica al instante.</div>
        </div>
    );
};

// Componente para la Vista "Mis Clases"
const MisClasesView = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 font-display">Mis Clases</h2>

            <div className="flex space-x-6 mb-8">
                <button className="flex items-center py-3 px-6 rounded-lg text-white font-semibold transition bg-gosteam-purple hover:bg-gosteam-purple-dark">
                    <Plus className="w-5 h-5 mr-2" /> Crear Clase
                </button>
                <button className="flex items-center py-3 px-6 rounded-lg text-gosteam-purple border border-gosteam-purple font-semibold hover:bg-purple-50 transition">
                    <Users className="w-5 h-5 mr-2" /> Unirse a Clase
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-700 font-display">Clases Activas (Ejemplo)</h3>
                <p className="text-gray-500">Aquí se mostrarían las clases activas a las que el usuario está unido o que ha creado, junto con sus borradores.</p>
            </div>
        </div>
    );
};

// Componente para la Vista "Biblioteca"
const BibliotecaView = () => {
    const [activeFilter, setActiveFilter] = useState({
        etapa: null,
        area: null,
        robot_needed: null,
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = BIBLIOTECA_DATA.filter(p => {
        let matchesCategory = true;
        if (selectedCategory !== 'all') {
            const categoryObj = libraryCategories.find(c => c.key === selectedCategory);
            matchesCategory = p.category === categoryObj?.name;
        }

        let matchesEtapa = activeFilter.etapa ? p.etapa === activeFilter.etapa : true;
        let matchesArea = activeFilter.area ? p.area === activeFilter.area : true;

        let matchesRobot = true;
        if (activeFilter.robot_needed) {
            if (activeFilter.robot_needed === "Con Robot") {
                matchesRobot = p.robot_needed === true;
            } else if (activeFilter.robot_needed === "Sin Robot") {
                matchesRobot = p.robot_needed === false;
            }
        }

        let matchesSearch = true;
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            matchesSearch = p.title.toLowerCase().includes(search) ||
                           p.category.toLowerCase().includes(search);
        }

        return matchesCategory && matchesEtapa && matchesArea && matchesRobot && matchesSearch;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Columna de Filtros */}
            <div className="lg:col-span-1 space-y-4">
                {/* Buscador */}
                <div className="p-4 bg-white rounded-xl shadow-lg">
                    <div className="relative flex items-center bg-gray-100 rounded-lg py-2 px-4">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar proyectos..."
                            className="ml-2 w-full bg-transparent focus:outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                aria-label="Limpiar búsqueda"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <FilterPanel filters={activeFilter} setFilters={setActiveFilter} />
            </div>

            {/* Columna de Contenido */}
            <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 font-display">Biblioteca de Proyectos ({filteredProjects.length})</h2>

                {/* Selector de Categorías */}
                <div className="flex flex-wrap gap-3 mb-8 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`flex items-center text-sm px-4 py-2 rounded-full font-medium transition
                            ${selectedCategory === 'all'
                                ? 'bg-gosteam-purple text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-gosteam-purple'
                            }`}
                    >
                        <Menu className={`w-4 h-4 mr-2 ${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`} />
                        Todas las Categorías
                    </button>
                    {libraryCategories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`flex items-center text-sm px-4 py-2 rounded-full font-medium transition
                                ${selectedCategory === cat.key
                                    ? 'bg-gosteam-purple text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-gosteam-purple'
                                }`}
                        >
                            <cat.icon className={`w-4 h-4 mr-2 ${selectedCategory === cat.key ? 'text-white' : cat.color}`} />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Lista de Proyectos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} published={!project.isDraft} />
                    ))}
                </div>
                {filteredProjects.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-10 border border-dashed rounded-lg">No hay proyectos que coincidan con los filtros aplicados.</p>
                )}
            </div>
        </div>
    );
};

// ✨ NUEVO: Quick Navigation Component (barra de navegación rápida)
const QuickNav = ({ activeTab, setActiveTab }) => {
    const sections = [
        { key: 'Mis clases', icon: Users, color: 'text-purple-600' },
        { key: 'Biblioteca', icon: BookOpen, color: 'text-teal-600' },
        { key: 'Recursos', icon: Globe, color: 'text-amber-600' },
        { key: 'En tu casa', icon: Home, color: 'text-pink-600' },
    ];

    if (activeTab === 'Dashboard') return null;

    return (
        <nav
            className="sticky top-16 bg-white border-b border-gray-100 px-4 sm:px-8 py-3 z-10 shadow-sm overflow-x-auto"
            aria-label="Navegación rápida entre secciones"
        >
            <div className="flex gap-2 sm:gap-4">
                {sections.map(section => {
                    const Icon = section.icon;
                    const isActive = activeTab === section.key;
                    return (
                        <button
                            key={section.key}
                            onClick={() => setActiveTab(section.key)}
                            className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition flex-shrink-0 ${
                                isActive
                                    ? `border-current ${section.color}`
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{section.key}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

// ✨ NUEVO: Mobile Bottom Navigation Component
const MobileBottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { key: 'Dashboard', icon: Home, label: 'Inicio' },
        { key: 'Mis clases', icon: Users, label: 'Clases' },
        { key: 'Biblioteca', icon: BookOpen, label: 'Proyectos' },
        { key: 'Recursos', icon: Globe, label: 'Más' },
    ];

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg"
            aria-label="Navegación principal móvil"
        >
            <div className="flex justify-around items-center">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors ${
                                isActive
                                    ? 'text-gosteam-purple'
                                    : 'text-gray-500'
                            }`}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

// ✨ MEJORADO: Dashboard con Activity Badges
const DashboardBlocksView = ({ setActiveTab }) => {
    const blocks = [
        {
            title: "Mis Clases",
            subtitle: "Crea o únete a clases para gestionar tus proyectos.",
            icon: Users,
            color: "bg-gradient-to-br from-purple-600 to-purple-700",
            target: "Mis clases",
            badge: { count: 3, label: "activas" }
        },
        {
            title: "Biblioteca",
            subtitle: "Explora proyectos listos para usar y personalizables.",
            icon: BookOpen,
            color: "bg-gradient-to-br from-teal-600 to-teal-700",
            target: "Biblioteca",
            badge: { count: 76, label: "proyectos" }
        },
        {
            title: "Recursos",
            subtitle: "Encuentra guías, tutoriales y herramientas de apoyo.",
            icon: Globe,
            color: "bg-gradient-to-br from-amber-600 to-amber-700",
            target: "Recursos"
        },
        {
            title: "En tu Casa",
            subtitle: "Actividades y propuestas para hacer fuera del aula.",
            icon: Home,
            color: "bg-gradient-to-br from-pink-600 to-pink-700",
            target: "En tu casa"
        },
    ];

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 font-display">
                    Bienvenido a GoSteam Evolution
                </h2>
                <p className="text-gray-600">
                    Elige una sección para comenzar a trabajar con tus proyectos STEAM
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {blocks.map(block => {
                    const Icon = block.icon;
                    return (
                        <div
                            key={block.title}
                            onClick={() => setActiveTab(block.target)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setActiveTab(block.target);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Navegar a ${block.title}`}
                            className={`relative p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer text-white flex flex-col justify-between h-48 ${block.color} focus:outline-none focus:ring-4 focus:ring-gosteam-purple focus:ring-opacity-50`}
                        >
                            {block.badge && (
                                <span className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-sm">
                                    {block.badge.count} {block.badge.label}
                                </span>
                            )}

                            <Icon className="w-8 h-8 mb-4 opacity-90" aria-hidden="true" />

                            <div>
                                <h3 className="text-xl font-bold mb-2 font-display">
                                    {block.title}
                                </h3>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {block.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

// --- Main App Component ---
export const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // ✨ CAMBIO: Logo a color para el header
  const goSteamLogoUrl = "/gosteam_color-logo.87f8073e.svg";
  const goSteamWhiteLogoUrl = "/gosteam_white-logo.svg";


  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardBlocksView setActiveTab={setActiveTab} />;
      case 'Mis clases':
        return <MisClasesView />;
      case 'Biblioteca':
        return <BibliotecaView />;
      case 'Recursos':
        return <div className="p-6 bg-white rounded-xl shadow-md"><h2 className="text-2xl font-bold font-display">Recursos</h2><p className="text-gray-500">Contenido de la sección Recursos.</p></div>;
      case 'En tu casa':
        return <div className="p-6 bg-white rounded-xl shadow-md"><h2 className="text-2xl font-bold font-display">En tu casa</h2><p className="text-gray-500">Contenido para el hogar.</p></div>;
      default:
        return <DashboardBlocksView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">

        {/* Botón flotante del asistente */}
        {!isAssistantOpen && (
            <button
                onClick={() => setIsAssistantOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gosteam-purple hover:bg-gosteam-purple-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-transform transform hover:scale-110 z-50"
                aria-label="Abrir Asistente GoSteam"
            >
                <Sparkles className="w-8 h-8" />
            </button>
        )}

        {/* Contenedor principal */}
        <div
            className={`flex flex-col min-h-screen transition-all duration-300 ${isAssistantOpen ? 'lg:mr-96' : ''}`}
        >

            {/* Header */}
            <header className="flex items-center justify-between p-4 px-8 bg-white shadow-sm sticky top-0 z-20">
                <div className="flex items-center">
                    {activeTab !== 'Dashboard' && (
                        <button
                            onClick={() => setActiveTab('Dashboard')}
                            className="mr-4 p-2 rounded-full text-gosteam-purple hover:bg-gray-100 transition"
                            aria-label="Volver al Dashboard"
                        >
                            <Home className="w-6 h-6" />
                        </button>
                    )}
                    {/* ✨ CAMBIO: Logo a color en el header */}
                    <img
                        src={goSteamLogoUrl}
                        alt="GoSteam Evolution Logo"
                        className="h-8 md:h-10"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x40/793D9B/ffffff?text=GoSteam"; }}
                    />

                    {activeTab !== 'Dashboard' && (
                        <h1 className="ml-6 text-xl font-semibold text-gray-700 hidden sm:block font-display">/ {activeTab}</h1>
                    )}
                </div>

                {/* Acciones & Usuario */}
                <div className="flex items-center space-x-4">
                    <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gosteam-purple" />
                    <UserCircle className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gosteam-purple" />
                    <img src="https://flagcdn.com/w20/es.png" alt="Español" className="w-5 h-4 rounded-sm border border-gray-300" />
                </div>
            </header>

            {/* Quick Navigation Bar */}
            <QuickNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Contenido Principal */}
            <main className="container mx-auto p-4 sm:p-8 max-w-7xl flex-grow mb-16 md:mb-0">
                <p className="text-gray-500 text-sm mb-6">Año Escolar: 2025/2026</p>
                {renderContent()}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* ✨ MEJORA: Footer con fondo negro y logo blanco */}
            <footer className="bg-black text-white relative overflow-hidden">
                {/* Patrón de rayas diagonal */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" strokeWidth="2"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#stripes)"/>
                    </svg>
                </div>

                <div className="relative p-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left max-w-7xl mx-auto">

                    {/* ✨ CAMBIO: Logo blanco en el footer */}
                    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <img
                            src={goSteamWhiteLogoUrl}
                            alt="GoSteam Evolution - by EDELVIVES"
                            className="h-8 mb-2"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x40/ffffff/793D9B?text=GoSteam"; }}
                        />
                        <p className="text-xs font-semibold text-gray-300">by EDELVIVES</p>
                    </div>

                    {/* Enlaces legales */}
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-sm">
                        <a href="#" className="hover:underline text-gray-300">AVISO LEGAL</a>
                        <a href="#" className="hover:underline text-gray-300">POLÍTICA DE PRIVACIDAD</a>
                        <a href="#" className="hover:underline text-gray-300">POLÍTICA DE COOKIES</a>
                    </div>
                </div>

                {/* ✨ MEJORA: Franja de acento inferior con todos los colores de marca */}
                <div className="h-2" style={{ background: 'linear-gradient(to right, #C83E7F 0%, #FBEB4E 33%, #8DB442 66%, #49A0DE 100%)' }}></div>

                <p className="text-xs text-gray-300 p-4 text-center">
                    &copy; 2025 GoSteam Evolution. Todos los derechos reservados.
                </p>
            </footer>
        </div>

      {/* Asistente Chatbot */}
      <AssistantChatbot isOpen={isAssistantOpen} setIsOpen={setIsAssistantOpen} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
