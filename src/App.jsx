import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Bell, UserCircle, BookOpen, Clock, Users, MoreVertical, Image, Menu, Sparkles, Palette, Cpu, Shield, Globe, Home, X, Send, AlertCircle, CheckCircle, Settings, List, Bookmark } from 'lucide-react';
import { initializeOpenAI, chatWithAssistant } from './utils/openai.js';
import ePub from 'epubjs';
import { LIBROS_DATA } from './libros-data.js';

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

// --- Mock Data para Habilidades Lectoras ---

const editoriales = ['Edelvives', 'Baula', 'Edelvives Comunidad Valenciana', 'Ibaizabal', 'Penguin Random House', 'Tambre'];
const idiomas = ['Castellano', 'Catalán', 'Valenciano', 'Gallego', 'Euskera', 'Inglés'];
const edadesRecomendadas = ['+4', '+6', '+8', '+10', '+12', '+14'];
const tematicas = ['Aventura', 'Ciencia y Tecnología', 'Fantasía', 'Humor', 'Medioambiente', 'Miedo/Terror', 'Intriga', 'Sentimientos'];
const generos = ['Narrativa', 'No ficción', 'Novela gráfica', 'Teatro', 'Relato corto'];
const valores = ['Amistad', 'Respeto', 'Empatía', 'Valentía', 'Honestidad', 'Solidaridad', 'Perseverancia', 'Creatividad', 'Tolerancia', 'Responsabilidad'];

const titulosBase = [
    'El secreto del árbol', 'Los linces abandonados', 'Animaleza', 'La escuela de gladiadores',
    'Carmen Conde', 'Gwyneth', 'Verano en el asteroide', 'Diez perritos',
    'Porcus', 'Aurora siempre', 'Las margaritas', 'Benita Malva', 'La tercera super',
    'La casa del árbol', 'Las leyendas de Roca Grossa', 'Los maestros salvajes',
    'El hilo de Clara', 'El misterio de la biblioteca', 'Viaje al centro', 'La puerta mágica',
    'Los guardianes del bosque', 'El dragón dormido', 'Aventuras en el espacio', 'La isla perdida',
    'El tesoro escondido', 'Las crónicas del tiempo', 'El laboratorio secreto', 'La ciudad submarina',
    'Los cazadores de sombras', 'El último unicornio', 'La montaña infinita', 'Los piratas del Caribe',
    'El reino de hielo', 'La princesa valiente', 'El robot amigo', 'La máquina del tiempo',
    'Los superhéroes de barrio', 'El circo mágico', 'La escuela misteriosa', 'El fantasma bueno',
    'Los detectives junior', 'El gato con botas', 'La leyenda del dragón', 'El país de las maravillas',
    'Los exploradores intrépidos', 'El caballero sin espada', 'La bruja buena', 'El gigante pequeño',
    'Los músicos de Bremen', 'La cenicienta moderna', 'El príncipe sapo', 'La bella dormilona',
];

const autoresBase = [
    'María García', 'Juan Martínez', 'Carmen López', 'Pedro Sánchez', 'Ana Fernández',
    'Luis González', 'Isabel Rodríguez', 'Miguel Pérez', 'Laura Gómez', 'Carlos Ruiz',
    'Elena Díaz', 'José Moreno', 'Marta Jiménez', 'Antonio Álvarez', 'Rosa Romero',
    'Francisco Navarro', 'Lucía Torres', 'Manuel Domínguez', 'Patricia Gil', 'Javier Vázquez',
];

const descripcionesBase = [
    'Una aventura emocionante que te llevará a lugares increíbles.',
    'Descubre los secretos mejor guardados en esta historia fascinante.',
    'Un viaje lleno de sorpresas y aprendizajes que no olvidarás.',
    'Sumérgete en un mundo de fantasía y magia sin límites.',
    'Una historia conmovedora sobre la amistad y el valor.',
    'Acompaña a los protagonistas en su increíble misión.',
    'Un relato que te hará reír, llorar y soñar.',
    'Explora mundos desconocidos llenos de misterio.',
    'Una narración que inspira y motiva a ser mejor cada día.',
    'Vive experiencias únicas a través de estas páginas.',
];

const generateLibros = (count) => {
    const libros = [];
    const epubFiles = [
        '200994_ePub_YATA_ElSecretoDelArbol_ADN.epub',
        '200995_ePub_TOPEZ_LosLincesAbandonados_ADN.epub',
        '200996_ePub_Animaleza_ADR.epub',
        '200997 ADV_Escuela_gladiadores.epub',
        '208493_LLEGENDES_Roca_Grossa_Val.epub',
        '208494_ADN_Talpis_linxs_abandonats_Val.epub',
        '208495_ADR_Mestratge_salvatge_Val.epub',
        '208829_ePub_Carmen_Conde.epub',
        '208830_Gwyneth_ePub.epub',
        '208831_Verano_asteroide_ePub.epub',
        '209021_ePub_DiezPerritos_ADN.epub',
        '209450_AL_Porcus_Epub.epub',
        '209451_Aurora_siempre_ePub.epub',
        '209452_Margaritas_ePub.epub',
        '209509 ADA_BenitaMalvaCrimen_EPUB.epub',
        '209510 ADA_Veran_Flamia.epub',
        '209855  ADR_La terceraSuper_Minis_3_EPUB.epub',
        '217491_AL_Casa_arbol_Premio2024.epub',
        '218162_EPUB_ADR_Nova_adivinas_Gal.epub',
        '218163_EPUB_ADN_Lua_Escusas_Gal.epub',
    ];

    for (let i = 0; i < count; i++) {
        const titulo = i < titulosBase.length
            ? titulosBase[i]
            : `${titulosBase[i % titulosBase.length]} ${Math.floor(i / titulosBase.length) + 1}`;

        const autor = autoresBase[i % autoresBase.length];
        const editorial = editoriales[i % editoriales.length];
        const idioma = idiomas[i % idiomas.length];
        const edadIdx = Math.floor(i / 167); // Distribuir uniformemente
        const edad = edadesRecomendadas[edadIdx % edadesRecomendadas.length];
        const tematica = tematicas[i % tematicas.length];
        const genero = generos[i % generos.length];
        const valoresLibro = [
            valores[i % valores.length],
            valores[(i + 3) % valores.length]
        ];
        const paginas = 80 + Math.floor((i * 13) % 200);
        const descripcion = descripcionesBase[i % descripcionesBase.length];

        // Asignar un epub file real o genérico
        const epubFile = i < epubFiles.length ? epubFiles[i] : epubFiles[i % epubFiles.length];

        libros.push({
            id: `libro-${i + 1}`,
            titulo,
            autor,
            editorial,
            idioma,
            edadRecomendada: edad,
            tematica,
            genero,
            valores: valoresLibro,
            paginas,
            descripcion,
            portada: `https://placehold.co/300x450/${['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'][i % 6]}/ffffff?text=${encodeURIComponent(titulo.substring(0, 15))}`,
            epubFile: `/epubs/${epubFile}`,
            añoPublicacion: 2020 + (i % 5),
            isbn: `978-84-${10000 + i}-${String(i % 10)}`,
            disponible: true
        });
    }

    return libros;
};

// LIBROS_DATA ahora se importa desde libros-data.js

// --- Mock Data para Clases y Estudiantes ---

const nombres = ["Alba", "Alejandro", "Ana", "Antonio", "Carmen", "Carlos", "Cristina", "Daniel", "Elena", "Fernando", "Isabel", "Javier", "Laura", "Luis", "María", "Mario", "Marta", "Miguel", "Natalia", "Pablo", "Paula", "Pedro", "Rosa", "Sergio", "Sofía"];
const apellidos = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez"];

const generateStudents = (count, classId) => {
    const students = [];
    for (let i = 0; i < count; i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
        const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
        students.push({
            id: `${classId}-student-${i + 1}`,
            nombre: `${nombre} ${apellido1} ${apellido2}`,
            email: `${nombre.toLowerCase()}.${apellido1.toLowerCase()}@estudiante.com`,
            joined_at: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toLocaleDateString('es-ES')
        });
    }
    return students;
};

const coloresClase = [
    { name: "Rosa", hex: "#C83E7F" },
    { name: "Azul", hex: "#49A0DE" },
    { name: "Verde", hex: "#8DB442" },
    { name: "Amarillo", hex: "#FBEB4E" },
    { name: "Morado", hex: "#9B59B6" },
    { name: "Naranja", hex: "#E67E22" },
    { name: "Turquesa", hex: "#1ABC9C" },
    { name: "Rojo", hex: "#E74C3C" },
    { name: "Índigo", hex: "#5D3FD3" },
    { name: "Lima", hex: "#AED581" }
];

const mockClasses = [
    {
        id: 1,
        nombre: "3º Primaria A - Ciencias",
        nivel: "Primaria",
        curso: "3º",
        color: coloresClase[0].hex,
        codigo: "ABC12XYZ",
        año_escolar: "2025/2026",
        profesor: "María González López",
        estudiantes: generateStudents(22, 1),
        proyectos: {
            trimestre1: [
                { ...mockProjects.find(p => p.id === 1), fecha_inicio: "15/09/2025", fecha_fin: "20/12/2025" },
                { ...mockProjects.find(p => p.id === 21), fecha_inicio: "01/10/2025", fecha_fin: "15/12/2025" }
            ],
            trimestre2: [
                { ...mockProjects.find(p => p.id === 25), fecha_inicio: "08/01/2026", fecha_fin: "25/03/2026" }
            ],
            trimestre3: [
                { ...mockProjects.find(p => p.id === 31), fecha_inicio: "01/04/2026", fecha_fin: "20/06/2026" }
            ]
        }
    },
    {
        id: 2,
        nombre: "1º Bachillerato - Tecnología",
        nivel: "Bachillerato",
        curso: "1º",
        color: coloresClase[1].hex,
        codigo: "TECH2026",
        año_escolar: "2025/2026",
        profesor: "Carlos Martínez Ruiz",
        estudiantes: generateStudents(18, 2),
        proyectos: {
            trimestre1: [
                { ...mockProjects.find(p => p.id === 22), fecha_inicio: "15/09/2025", fecha_fin: "20/12/2025" },
                { ...mockProjects.find(p => p.id === 40), fecha_inicio: "20/09/2025", fecha_fin: "18/12/2025" }
            ],
            trimestre2: [
                { ...mockProjects.find(p => p.id === 13), fecha_inicio: "08/01/2026", fecha_fin: "25/03/2026" },
                { ...mockProjects.find(p => p.id === 43), fecha_inicio: "15/01/2026", fecha_fin: "20/03/2026" }
            ],
            trimestre3: [
                { ...mockProjects.find(p => p.id === 23), fecha_inicio: "01/04/2026", fecha_fin: "15/06/2026" }
            ]
        }
    },
    {
        id: 3,
        nombre: "2º Secundaria B - Multidisciplinar",
        nivel: "Secundaria",
        curso: "2º",
        color: coloresClase[2].hex,
        codigo: "SEC2B026",
        año_escolar: "2025/2026",
        profesor: "Laura Fernández García",
        estudiantes: generateStudents(25, 3),
        proyectos: {
            trimestre1: [
                { ...mockProjects.find(p => p.id === 11), fecha_inicio: "15/09/2025", fecha_fin: "20/12/2025" }
            ],
            trimestre2: [
                { ...mockProjects.find(p => p.id === 27), fecha_inicio: "08/01/2026", fecha_fin: "25/03/2026" },
                { ...mockProjects.find(p => p.id === 34), fecha_inicio: "10/01/2026", fecha_fin: "20/03/2026" }
            ],
            trimestre3: [
                { ...mockProjects.find(p => p.id === 41), fecha_inicio: "01/04/2026", fecha_fin: "20/06/2026" },
                { ...mockProjects.find(p => p.id === 46), fecha_inicio: "05/04/2026", fecha_fin: "18/06/2026" }
            ]
        }
    },
    {
        id: 4,
        nombre: "Infantil 5 años - Exploradores",
        nivel: "Educación Infantil",
        curso: "5 años",
        color: coloresClase[3].hex,
        codigo: "INF5EXPL",
        año_escolar: "2025/2026",
        profesor: "Ana Sánchez Pérez",
        estudiantes: generateStudents(15, 4),
        proyectos: {
            trimestre1: [
                { ...mockProjects.find(p => p.id === 29), fecha_inicio: "15/09/2025", fecha_fin: "20/12/2025" },
                { ...mockProjects.find(p => p.id === 32), fecha_inicio: "01/10/2025", fecha_fin: "18/12/2025" }
            ],
            trimestre2: [
                { ...mockProjects.find(p => p.id === 66), fecha_inicio: "08/01/2026", fecha_fin: "25/03/2026" }
            ],
            trimestre3: []
        }
    },
    {
        id: 5,
        nombre: "4º Secundaria - Ciencias Avanzadas",
        nivel: "Secundaria",
        curso: "4º",
        color: coloresClase[4].hex,
        codigo: "4SECCIA",
        año_escolar: "2025/2026",
        profesor: "Javier López Martín",
        estudiantes: generateStudents(20, 5),
        proyectos: {
            trimestre1: [
                { ...mockProjects.find(p => p.id === 24), fecha_inicio: "15/09/2025", fecha_fin: "20/12/2025" },
                { ...mockProjects.find(p => p.id === 43), fecha_inicio: "20/09/2025", fecha_fin: "18/12/2025" }
            ],
            trimestre2: [
                { ...mockProjects.find(p => p.id === 49), fecha_inicio: "08/01/2026", fecha_fin: "25/03/2026" },
                { ...mockProjects.find(p => p.id === 53), fecha_inicio: "15/01/2026", fecha_fin: "20/03/2026" }
            ],
            trimestre3: [
                { ...mockProjects.find(p => p.id === 63), fecha_inicio: "01/04/2026", fecha_fin: "15/06/2026" },
                { ...mockProjects.find(p => p.id === 67), fecha_inicio: "05/04/2026", fecha_fin: "20/06/2026" }
            ]
        }
    }
];

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
const AssistantChatbot = ({ isOpen, setIsOpen, setActiveTab, booksData }) => {
    const [query, setQuery] = useState('');
    const [conversationHistory, setConversationHistory] = useState([
        { type: 'bot', text: '¡Hola! Soy tu Asistente GoSteam. Puedo ayudarte a encontrar recursos, planificar clases, recomendar libros de lectura o responder dudas sobre la plataforma. ¿Qué necesitas hoy?' }
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
            console.log('Calling OpenAI with message:', userText);
            const response = await chatWithAssistant(userText, conversationHistory, booksData);
            console.log('OpenAI response:', response);

            if (response && response.success) {
                const botMessage = { type: 'bot', text: response.message };
                setConversationHistory(prev => [...prev, botMessage]);
            } else if (response && response.error) {
                const errorMessage = {
                    type: 'bot',
                    text: `❌ ${response.error}`,
                    isError: true
                };
                setConversationHistory(prev => [...prev, errorMessage]);
            } else {
                // Fallback error
                const errorMessage = {
                    type: 'bot',
                    text: '❌ Hubo un error inesperado. Por favor, intenta de nuevo.',
                    isError: true
                };
                setConversationHistory(prev => [...prev, errorMessage]);
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Error in handleSend:', error);
            const errorMessage = {
                type: 'bot',
                text: `❌ Error de conexión: ${error.message}. Por favor, verifica tu clave de API y tu conexión a internet.`,
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
            'biblioteca': 'Proyectos TALENT',
            'mis-clases': 'Mis clases',
            'dashboard': 'Dashboard',
            'recursos': 'Recursos',
            'en-tu-casa': 'En tu casa',
            'habilidades-lectoras': 'Habilidades Lectoras'
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

    const handleClearChat = () => {
        setConversationHistory([
            { type: 'bot', text: '¡Hola! Soy tu Asistente GoSteam. Puedo ayudarte a encontrar recursos, planificar clases o responder dudas sobre la plataforma. ¿Qué necesitas hoy?' }
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
                    {conversationHistory.length > 1 && (
                        <button
                            onClick={handleClearChat}
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                            aria-label="Limpiar chat"
                            title="Limpiar conversación"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
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

// Componente para tarjeta de clase
const ClassCard = ({ clase, onClick }) => {
    const totalEstudiantes = clase.estudiantes.length;
    const totalProyectos = Object.values(clase.proyectos).flat().length;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4"
            style={{ borderLeftColor: clase.color }}
        >
            <div className="p-6">
                {/* Header con color */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: clase.color }}
                            ></div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {clase.nivel} • {clase.curso}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 font-display mb-1">
                            {clase.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">{clase.profesor}</p>
                    </div>
                </div>

                {/* Código de clase */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Código de clase</p>
                            <p className="text-lg font-mono font-bold text-gosteam-purple">
                                {clase.codigo}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(clase.codigo);
                            }}
                            className="p-2 hover:bg-gray-200 rounded-lg transition"
                            title="Copiar código"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{totalEstudiantes}</p>
                            <p className="text-xs text-gray-500">Estudiantes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{totalProyectos}</p>
                            <p className="text-xs text-gray-500">Proyectos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para vista detalle de clase
const ClassDetailView = ({ clase, onBack }) => {
    const [activeTab, setActiveTab] = useState('proyectos');
    const [openTrimestre, setOpenTrimestre] = useState('trimestre1');

    const trimestres = [
        { key: 'trimestre1', nombre: 'Trimestre 1', proyectos: clase.proyectos.trimestre1 },
        { key: 'trimestre2', nombre: 'Trimestre 2', proyectos: clase.proyectos.trimestre2 },
        { key: 'trimestre3', nombre: 'Trimestre 3', proyectos: clase.proyectos.trimestre3 }
    ];

    return (
        <div>
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4" style={{ borderLeftColor: clase.color }}>
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gosteam-purple mb-4 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a Mis Clases
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: clase.color }}></div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                {clase.nivel} • {clase.curso}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 font-display mb-2">{clase.nombre}</h1>
                        <p className="text-gray-600">Profesor: {clase.profesor}</p>
                        <p className="text-sm text-gray-500 mt-1">Año escolar: {clase.año_escolar}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Código de clase</p>
                        <p className="text-2xl font-mono font-bold text-gosteam-purple">{clase.codigo}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-6">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('proyectos')}
                            className={`px-6 py-4 font-semibold transition border-b-2 ${
                                activeTab === 'proyectos'
                                    ? 'border-gosteam-purple text-gosteam-purple'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Proyectos
                        </button>
                        <button
                            onClick={() => setActiveTab('estudiantes')}
                            className={`px-6 py-4 font-semibold transition border-b-2 ${
                                activeTab === 'estudiantes'
                                    ? 'border-gosteam-purple text-gosteam-purple'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Estudiantes ({clase.estudiantes.length})
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'proyectos' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 font-display">Proyectos Asignados</h2>
                                <button className="flex items-center py-2 px-4 rounded-lg text-white font-semibold transition bg-gosteam-purple hover:bg-gosteam-purple-dark text-sm">
                                    <Plus className="w-4 h-4 mr-2" /> Asignar Proyecto
                                </button>
                            </div>

                            {/* Accordion de trimestres */}
                            {trimestres.map((trimestre) => (
                                <div key={trimestre.key} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenTrimestre(openTrimestre === trimestre.key ? null : trimestre.key)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-gosteam-purple">{trimestre.nombre}</span>
                                            <span className="text-sm text-gray-500">
                                                {trimestre.proyectos.length} {trimestre.proyectos.length === 1 ? 'proyecto' : 'proyectos'}
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 text-gray-500 transition-transform ${openTrimestre === trimestre.key ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {openTrimestre === trimestre.key && (
                                        <div className="p-4 bg-white space-y-4">
                                            {trimestre.proyectos.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">No hay proyectos asignados en este trimestre</p>
                                            ) : (
                                                trimestre.proyectos.map((proyecto) => (
                                                    <div key={proyecto.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gosteam-purple transition">
                                                        <img
                                                            src={proyecto.image}
                                                            alt={proyecto.title}
                                                            className="w-24 h-16 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 mb-1">{proyecto.title}</h4>
                                                            <p className="text-sm text-gray-600 mb-2">{proyecto.category}</p>
                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {proyecto.sessions} sesiones
                                                                </span>
                                                                <span>📅 {proyecto.fecha_inicio} - {proyecto.fecha_fin}</span>
                                                            </div>
                                                        </div>
                                                        <button className="text-gosteam-purple hover:text-gosteam-purple-dark font-semibold text-sm">
                                                            Ver detalles
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'estudiantes' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 font-display mb-4">
                                Lista de Estudiantes ({clase.estudiantes.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha de unión</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clase.estudiantes.map((estudiante, index) => (
                                            <tr key={estudiante.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                                                <td className="py-3 px-4 font-medium text-gray-800">{estudiante.nombre}</td>
                                                <td className="py-3 px-4 text-gray-600">{estudiante.email}</td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">{estudiante.joined_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente para la Vista "Mis Clases"
const MisClasesView = ({ selectedClass, setSelectedClass }) => {
    if (selectedClass) {
        return <ClassDetailView clase={selectedClass} onBack={() => setSelectedClass(null)} />;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-display">Mis Clases</h2>
                <div className="flex gap-3">
                    <button className="flex items-center py-2 px-4 rounded-lg text-white font-semibold transition bg-gosteam-purple hover:bg-gosteam-purple-dark text-sm">
                        <Plus className="w-4 h-4 mr-2" /> Crear Clase
                    </button>
                    <button className="flex items-center py-2 px-4 rounded-lg text-gosteam-purple border border-gosteam-purple font-semibold hover:bg-purple-50 transition text-sm">
                        <Users className="w-4 h-4 mr-2" /> Unirse a Clase
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockClasses.map((clase) => (
                    <ClassCard key={clase.id} clase={clase} onClick={() => setSelectedClass(clase)} />
                ))}
            </div>
        </div>
    );
};

// Componente para Habilidades Lectoras
const HabilidadesLectorasView = () => {
    const [activeSection, setActiveSection] = useState('biblioteca');

    return (
        <div>
            {/* Tabs de sección */}
            <div className="bg-white rounded-xl shadow-md mb-6">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveSection('biblioteca')}
                            className={`px-6 py-4 font-semibold transition border-b-2 ${
                                activeSection === 'biblioteca'
                                    ? 'border-teal-600 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            📚 Biblioteca
                        </button>
                        <button
                            onClick={() => setActiveSection('gimnasio')}
                            className={`px-6 py-4 font-semibold transition border-b-2 ${
                                activeSection === 'gimnasio'
                                    ? 'border-teal-600 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            🏋️ Gimnasio Lector
                        </button>
                        <button
                            onClick={() => setActiveSection('propuestas')}
                            className={`px-6 py-4 font-semibold transition border-b-2 ${
                                activeSection === 'propuestas'
                                    ? 'border-teal-600 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            📝 Propuestas Didácticas
                        </button>
                    </div>
                </div>
            </div>

            {activeSection === 'biblioteca' && <BibliotecaLibrosView />}
            {activeSection === 'gimnasio' && (
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 font-display">🏋️ Gimnasio Lector</h2>
                    <p className="text-gray-500">Próximamente: Ejercicios de velocidad lectora, comprensión y rutinas de entrenamiento.</p>
                </div>
            )}
            {activeSection === 'propuestas' && (
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 font-display">📝 Propuestas Didácticas</h2>
                    <p className="text-gray-500">Ejercicios de antes, durante y después de la lectura.</p>
                </div>
            )}
        </div>
    );
};

// Componente para la Biblioteca de Libros
const BibliotecaLibrosView = () => {
    const [filters, setFilters] = useState({
        editorial: null,
        idioma: null,
        edad: null,
        tematica: null,
        genero: null,
        valor: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLibro, setSelectedLibro] = useState(null);

    // Detectar si se abre en nueva pestaña con un libro guardado
    useEffect(() => {
        const openBook = localStorage.getItem('openBook');
        const openBookTime = localStorage.getItem('openBookTime');

        if (openBook && openBookTime) {
            const timeElapsed = Date.now() - parseInt(openBookTime);
            // Solo abrir si fue hace menos de 3 segundos (evitar abrir libros antiguos)
            if (timeElapsed < 3000) {
                const libro = JSON.parse(openBook);
                setSelectedLibro(libro);
                // Limpiar localStorage después de usar
                localStorage.removeItem('openBook');
                localStorage.removeItem('openBookTime');
            }
        }
    }, []);

    const filteredLibros = LIBROS_DATA.filter(libro => {
        if (filters.editorial && libro.editorial !== filters.editorial) return false;
        if (filters.idioma && libro.idioma !== filters.idioma) return false;
        if (filters.edad && libro.edadRecomendada !== filters.edad) return false;
        if (filters.tematica && libro.tematica !== filters.tematica) return false;
        if (filters.genero && libro.genero !== filters.genero) return false;
        if (filters.valor && !libro.valores.includes(filters.valor)) return false;

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            return libro.titulo.toLowerCase().includes(search) ||
                   libro.autor.toLowerCase().includes(search);
        }

        return true;
    });

    if (selectedLibro) {
        return <LibroDetailView libro={selectedLibro} onBack={() => setSelectedLibro(null)} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Panel de Filtros */}
            <div className="lg:col-span-1 space-y-4">
                {/* Buscador */}
                <div className="p-4 bg-white rounded-xl shadow-lg">
                    <div className="relative flex items-center bg-gray-100 rounded-lg py-2 px-4">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar libros..."
                            className="ml-2 w-full bg-transparent focus:outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtros */}
                <div className="p-4 bg-white rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center font-display">
                        <Filter className="w-5 h-5 mr-2 text-teal-600" />
                        Filtros
                    </h3>

                    {/* Editorial */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Editorial</h5>
                        <div className="flex flex-wrap gap-2">
                            {editoriales.map(ed => (
                                <button
                                    key={ed}
                                    onClick={() => setFilters({...filters, editorial: filters.editorial === ed ? null : ed})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.editorial === ed
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {ed}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Idioma */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Idioma</h5>
                        <div className="flex flex-wrap gap-2">
                            {idiomas.map(idioma => (
                                <button
                                    key={idioma}
                                    onClick={() => setFilters({...filters, idioma: filters.idioma === idioma ? null : idioma})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.idioma === idioma
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {idioma}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Edad */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Edad Recomendada</h5>
                        <div className="flex flex-wrap gap-2">
                            {edadesRecomendadas.map(edad => (
                                <button
                                    key={edad}
                                    onClick={() => setFilters({...filters, edad: filters.edad === edad ? null : edad})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.edad === edad
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {edad}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Temática */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Temática</h5>
                        <div className="flex flex-wrap gap-2">
                            {tematicas.map(tem => (
                                <button
                                    key={tem}
                                    onClick={() => setFilters({...filters, tematica: filters.tematica === tem ? null : tem})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.tematica === tem
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {tem}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Género */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Género</h5>
                        <div className="flex flex-wrap gap-2">
                            {generos.map(gen => (
                                <button
                                    key={gen}
                                    onClick={() => setFilters({...filters, genero: filters.genero === gen ? null : gen})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.genero === gen
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {gen}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Valores */}
                    <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2 text-sm">Valores</h5>
                        <div className="flex flex-wrap gap-2">
                            {valores.map(val => (
                                <button
                                    key={val}
                                    onClick={() => setFilters({...filters, valor: filters.valor === val ? null : val})}
                                    className={`text-xs px-3 py-1 rounded-full transition ${
                                        filters.valor === val
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setFilters({editorial: null, idioma: null, edad: null, tematica: null, genero: null, valor: null})}
                        className="w-full mt-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-semibold"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Grid de Libros */}
            <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 font-display">
                    Biblioteca de Libros ({filteredLibros.length})
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredLibros.map(libro => (
                        <div
                            key={libro.id}
                            onClick={() => {
                                // Guardar en localStorage y abrir nueva pestaña
                                localStorage.setItem('openBook', JSON.stringify(libro));
                                localStorage.setItem('openBookTime', Date.now().toString());
                                window.open(window.location.origin, '_blank');
                            }}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <EPUBCover
                                epubFile={libro.epubFile}
                                fallbackImage={libro.portada}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                                <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 font-display">
                                    {libro.titulo}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2">{libro.autor}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{libro.edadRecomendada}</span>
                                    <span>{libro.paginas}p</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLibros.length === 0 && (
                    <p className="text-center text-gray-500 py-10 border border-dashed rounded-lg">
                        No hay libros que coincidan con los filtros aplicados.
                    </p>
                )}
            </div>
        </div>
    );
};

// Componente para mostrar cubierta de EPUB
const EPUBCover = ({ epubFile, fallbackImage, className = "w-full rounded-lg shadow-lg" }) => {
    const [coverUrl, setCoverUrl] = useState(fallbackImage);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const extractCover = async () => {
            try {
                const book = ePub(epubFile);
                await book.ready;

                // Intentar obtener la portada
                const cover = await book.coverUrl();

                if (cover && isMounted) {
                    setCoverUrl(cover);
                }
            } catch (error) {
                console.log('No se pudo extraer portada de', epubFile, error);
                // Mantener el fallback
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        extractCover();

        return () => {
            isMounted = false;
        };
    }, [epubFile, fallbackImage]);

    return (
        <img
            src={coverUrl}
            alt="Portada del libro"
            className={`${className} ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity`}
            onError={(e) => {
                // Si falla la carga de la imagen extraída, usar fallback
                if (e.target.src !== fallbackImage) {
                    e.target.src = fallbackImage;
                }
            }}
        />
    );
};

// Componente para detalle del libro
const LibroDetailView = ({ libro, onBack }) => {
    const [showReader, setShowReader] = useState(false);

    if (showReader) {
        return <EPUBReaderView libro={libro} onClose={() => setShowReader(false)} />;
    }

    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a la biblioteca
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Portada */}
                    <div>
                        <EPUBCover epubFile={libro.epubFile} fallbackImage={libro.portada} />
                        <button
                            onClick={() => setShowReader(true)}
                            className="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
                        >
                            📖 Leer ahora
                        </button>
                        <button className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-sm">
                            ➕ Asignar a clase
                        </button>
                    </div>

                    {/* Información */}
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-display">{libro.titulo}</h1>
                        <p className="text-xl text-gray-600 mb-4">{libro.autor}</p>

                        <p className="text-gray-700 mb-6">{libro.descripcion}</p>

                        {/* Metadatos */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Editorial</p>
                                <p className="font-semibold text-gray-800">{libro.editorial}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Idioma</p>
                                <p className="font-semibold text-gray-800">{libro.idioma}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Edad Recomendada</p>
                                <p className="font-semibold text-gray-800">{libro.edadRecomendada}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Páginas</p>
                                <p className="font-semibold text-gray-800">{libro.paginas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Género</p>
                                <p className="font-semibold text-gray-800">{libro.genero}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Temática</p>
                                <p className="font-semibold text-gray-800">{libro.tematica}</p>
                            </div>
                        </div>

                        {/* Valores */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">Valores</p>
                            <div className="flex flex-wrap gap-2">
                                {libro.valores.map(valor => (
                                    <span key={valor} className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                                        {valor}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-500">ISBN: {libro.isbn}</p>
                            <p className="text-sm text-gray-500">Año de publicación: {libro.añoPublicacion}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente del Lector EPUB
const EPUBReaderView = ({ libro, onClose }) => {
    const viewerRef = useRef(null);
    const renditionRef = useRef(null);
    const [book, setBook] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showControls, setShowControls] = useState(true); // Controles visibles por defecto
    const [selectedText, setSelectedText] = useState('');
    const [showDictionary, setShowDictionary] = useState(false);
    const [dictionaryWord, setDictionaryWord] = useState('');
    const [dictionaryResult, setDictionaryResult] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [notes, setNotes] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [cfiRange, setCfiRange] = useState(null);
    const [showTOC, setShowTOC] = useState(false);
    const [toc, setToc] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    // Configuración del lector
    const [settings, setSettings] = useState({
        fontSize: 18,
        fontFamily: '"Merriweather", serif',
        theme: 'white',
        lineHeight: 1.6
    });

    const themes = {
        white: { background: '#ffffff', color: '#000000', label: 'Blanco' },
        sepia: { background: '#f4ecd8', color: '#5c4b37', label: 'Sepia' },
        night: { background: '#1a1a1a', color: '#ffffff', label: 'Nocturno' },
        blue: { background: '#e3f2fd', color: '#1a237e', label: 'Azul' }
    };

    const fonts = [
        { value: '"Open Sans", sans-serif', label: 'Open Sans' },
        { value: '"Merriweather", serif', label: 'Merriweather' },
        { value: '"Lora", serif', label: 'Lora' },
        { value: '"Comic Neue", cursive', label: 'Escolar' },
        { value: '"Caveat", cursive', label: 'Escritura Manual' },
        { value: '"Titillium Web", sans-serif', label: 'Titillium Web' }
    ];

    useEffect(() => {
        if (viewerRef.current) {
            // Inicializar el libro EPUB
            const newBook = ePub(libro.epubFile);
            setBook(newBook);

            const rendition = newBook.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none'
            });

            renditionRef.current = rendition;

            // Event listener para cuando el contenido está renderizado
            rendition.on('rendered', () => {
                // Aplicar estilos después de que se renderize cada página
                applySettings(rendition, settings);
            });

            rendition.display().then(() => {
                // Aplicar estilos iniciales después de que se muestre la primera página
                applySettings(rendition, settings);
            });

            // Extraer tabla de contenidos
            newBook.loaded.navigation.then((navigation) => {
                setToc(navigation.toc);
            });

            // Event listener para selección de texto (mejorado)
            rendition.on('selected', (selectedCfiRange, contents) => {
                try {
                    // Obtener el texto seleccionado desde el contenido del iframe
                    const selection = contents.window.getSelection();
                    const text = selection.toString().trim();

                    if (text && text.length > 0) {
                        setSelectedText(text);
                        setCfiRange(selectedCfiRange);
                        const word = text.split(/\s+/)[0].replace(/[.,;:!?¿¡]/g, ''); // Primera palabra sin puntuación
                        setDictionaryWord(word);
                        lookupWord(word);
                        setShowDictionary(true);
                    }
                } catch (error) {
                    console.log('Error al procesar selección:', error);
                }
            });

            // Event listener para cambios de página
            rendition.on('relocated', (location) => {
                setCurrentLocation(location);
            });

            return () => {
                rendition.destroy();
            };
        }
    }, [libro]);

    useEffect(() => {
        if (renditionRef.current) {
            applySettings(renditionRef.current, settings);
        }
    }, [settings]);

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const applySettings = (rendition, settings) => {
        const theme = themes[settings.theme];

        // Usar el método default de themes con selectores más específicos
        rendition.themes.default({
            'body': {
                'font-family': `${settings.fontFamily} !important`,
                'font-size': `${settings.fontSize}px !important`,
                'line-height': `${settings.lineHeight} !important`,
                'background': `${theme.background} !important`,
                'background-color': `${theme.background} !important`,
                'color': `${theme.color} !important`,
                'padding': '20px'
            },
            '::selection': {
                'background': 'rgba(180, 213, 255, 0.5)'
            }
        });

        // Forzar colores en todos los elementos de texto
        const textElements = ['*', 'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'li', 'td', 'th', 'blockquote', 'pre', 'code'];
        textElements.forEach(selector => {
            rendition.themes.override(selector, `color: ${theme.color} !important; font-family: ${settings.fontFamily} !important`);
        });

        // Forzar tamaño y line-height en elementos de párrafo
        rendition.themes.override('p', `font-size: ${settings.fontSize}px !important; line-height: ${settings.lineHeight} !important`);
    };

    const nextPage = () => {
        if (renditionRef.current) {
            renditionRef.current.next();
        }
    };

    const prevPage = () => {
        if (renditionRef.current) {
            renditionRef.current.prev();
        }
    };

    // Función para buscar palabra en diccionario escolar
    const lookupWord = async (word) => {
        // Diccionario escolar ampliado con palabras comunes en literatura infantil y juvenil
        const diccionarioEscolar = {
            // Naturaleza
            'libro': { definicion: 'Conjunto de hojas de papel u otro material similar que, encuadernadas, forman un volumen.', ejemplo: 'Me gusta leer libros de aventuras.' },
            'casa': { definicion: 'Edificio o parte de él donde vive una persona o familia.', ejemplo: 'Vivo en una casa grande.' },
            'árbol': { definicion: 'Planta perenne, de tronco leñoso y elevado, que se ramifica a cierta altura del suelo.', ejemplo: 'El árbol da sombra en verano.' },
            'sol': { definicion: 'Estrella luminosa, centro de nuestro sistema planetario.', ejemplo: 'El sol brilla en el cielo.' },
            'agua': { definicion: 'Líquido transparente, incoloro, inodoro e insípido en estado puro.', ejemplo: 'Necesito beber agua.' },
            'luna': { definicion: 'Satélite natural de la Tierra.', ejemplo: 'La luna llena ilumina la noche.' },
            'estrella': { definicion: 'Cuerpo celeste que brilla con luz propia.', ejemplo: 'Las estrellas brillan en el cielo nocturno.' },
            'río': { definicion: 'Corriente de agua continua que desemboca en el mar, en un lago o en otro río.', ejemplo: 'El río fluye hacia el mar.' },
            'mar': { definicion: 'Masa de agua salada que cubre gran parte de la superficie terrestre.', ejemplo: 'Me encanta nadar en el mar.' },
            'montaña': { definicion: 'Elevación natural del terreno de gran altura.', ejemplo: 'La montaña está cubierta de nieve.' },
            'bosque': { definicion: 'Terreno poblado de árboles y plantas.', ejemplo: 'Caminamos por el bosque.' },
            'flor': { definicion: 'Parte de la planta que contiene los órganos de reproducción.', ejemplo: 'Esta flor huele muy bien.' },
            'jardín': { definicion: 'Terreno donde se cultivan plantas con fines ornamentales.', ejemplo: 'Mi abuela cuida su jardín.' },

            // Animales
            'perro': { definicion: 'Animal mamífero doméstico de la familia de los cánidos.', ejemplo: 'Mi perro se llama Rex.' },
            'gato': { definicion: 'Animal mamífero doméstico de la familia de los felinos.', ejemplo: 'El gato maúlla en la ventana.' },
            'pájaro': { definicion: 'Animal vertebrado ovíparo, con pico, alas y plumas.', ejemplo: 'El pájaro canta en la rama.' },
            'caballo': { definicion: 'Mamífero doméstico de gran tamaño usado para montar y trabajar.', ejemplo: 'El caballo galopa por el campo.' },
            'león': { definicion: 'Mamífero carnívoro felino de gran tamaño y melena.', ejemplo: 'El león es el rey de la selva.' },
            'oso': { definicion: 'Mamífero carnívoro de gran tamaño y pelaje espeso.', ejemplo: 'El oso hiberna en invierno.' },
            'lobo': { definicion: 'Mamífero carnívoro salvaje parecido al perro.', ejemplo: 'El lobo aúlla en la noche.' },
            'conejo': { definicion: 'Mamífero roedor de orejas largas y cola corta.', ejemplo: 'El conejo salta por el prado.' },

            // Personas y familia
            'niño': { definicion: 'Persona que está en la niñez.', ejemplo: 'El niño juega en el parque.' },
            'niña': { definicion: 'Persona de sexo femenino que está en la niñez.', ejemplo: 'La niña dibuja en su cuaderno.' },
            'madre': { definicion: 'Mujer que ha tenido uno o más hijos.', ejemplo: 'Mi madre cocina muy bien.' },
            'padre': { definicion: 'Hombre que ha tenido uno o más hijos.', ejemplo: 'Mi padre trabaja en una oficina.' },
            'hermano': { definicion: 'Persona que tiene los mismos padres que otra.', ejemplo: 'Mi hermano mayor me ayuda con los deberes.' },
            'hermana': { definicion: 'Persona de sexo femenino que tiene los mismos padres que otra.', ejemplo: 'Mi hermana pequeña tiene cinco años.' },
            'abuelo': { definicion: 'Padre del padre o de la madre.', ejemplo: 'Mi abuelo cuenta historias fantásticas.' },
            'abuela': { definicion: 'Madre del padre o de la madre.', ejemplo: 'Mi abuela hace galletas deliciosas.' },
            'amigo': { definicion: 'Persona que tiene amistad con otra.', ejemplo: 'Mi mejor amigo se llama Juan.' },
            'familia': { definicion: 'Grupo de personas emparentadas entre sí.', ejemplo: 'Mi familia es muy unida.' },
            'maestro': { definicion: 'Persona que enseña una ciencia, arte u oficio.', ejemplo: 'El maestro explica la lección.' },
            'profesor': { definicion: 'Persona que se dedica a la enseñanza.', ejemplo: 'La profesora de matemáticas es muy amable.' },

            // Lugares
            'escuela': { definicion: 'Establecimiento público donde se da cualquier género de instrucción.', ejemplo: 'Voy a la escuela todos los días.' },
            'pueblo': { definicion: 'Población de menor tamaño que una ciudad.', ejemplo: 'Mis abuelos viven en un pueblo.' },
            'ciudad': { definicion: 'Conjunto de edificios y calles con gran número de habitantes.', ejemplo: 'La ciudad está llena de gente.' },
            'parque': { definicion: 'Terreno destinado en el interior de una población a prados y jardines.', ejemplo: 'Jugamos en el parque todas las tardes.' },
            'calle': { definicion: 'Vía pública en una población, por lo general con edificios a ambos lados.', ejemplo: 'La calle está muy transitada.' },
            'tienda': { definicion: 'Establecimiento donde se venden productos.', ejemplo: 'Compré pan en la tienda.' },
            'hospital': { definicion: 'Establecimiento donde se atiende a los enfermos.', ejemplo: 'Mi tía trabaja en el hospital.' },
            'biblioteca': { definicion: 'Lugar donde se guardan y prestan libros.', ejemplo: 'Saco libros de la biblioteca cada semana.' },

            // Acciones comunes
            'caminar': { definicion: 'Ir andando de un lugar a otro.', ejemplo: 'Me gusta caminar por el parque.' },
            'correr': { definicion: 'Ir deprisa, moverse con rapidez.', ejemplo: 'Los niños corren en el recreo.' },
            'saltar': { definicion: 'Levantarse del suelo con impulso para caer en el mismo lugar o en otro.', ejemplo: 'Salto a la comba con mis amigos.' },
            'jugar': { definicion: 'Hacer algo por diversión o entretenimiento.', ejemplo: 'Me encanta jugar al fútbol.' },
            'leer': { definicion: 'Pasar la vista por un texto comprendiendo su significado.', ejemplo: 'Leo un libro cada semana.' },
            'escribir': { definicion: 'Representar palabras o ideas con letras u otros signos.', ejemplo: 'Escribo en mi diario todos los días.' },
            'pensar': { definicion: 'Formar y relacionar ideas en la mente.', ejemplo: 'Pienso en las vacaciones de verano.' },
            'hablar': { definicion: 'Comunicarse mediante palabras.', ejemplo: 'Hablo con mis amigos en el recreo.' },
            'comer': { definicion: 'Masticar y tragar alimentos.', ejemplo: 'Como frutas y verduras.' },
            'dormir': { definicion: 'Estar en estado de reposo con suspensión de los sentidos.', ejemplo: 'Duermo ocho horas cada noche.' },
            'soñar': { definicion: 'Representarse en la fantasía sucesos mientras se duerme.', ejemplo: 'Anoche soñé que volaba.' },
            'mirar': { definicion: 'Dirigir la vista hacia algo.', ejemplo: 'Miro las nubes en el cielo.' },
            'escuchar': { definicion: 'Prestar atención a lo que se oye.', ejemplo: 'Escucho música cuando estudio.' },
            'reír': { definicion: 'Manifestar alegría con gestos y sonidos.', ejemplo: 'Río mucho cuando veo esa película.' },
            'llorar': { definicion: 'Derramar lágrimas, generalmente por tristeza.', ejemplo: 'Lloré cuando se perdió mi mascota.' },

            // Emociones y sentimientos
            'feliz': { definicion: 'Que siente o expresa felicidad.', ejemplo: 'Estoy muy feliz hoy.' },
            'triste': { definicion: 'Que siente o expresa tristeza.', ejemplo: 'Me siento triste sin mis amigos.' },
            'alegre': { definicion: 'Que siente o causa alegría.', ejemplo: 'Es una persona muy alegre.' },
            'miedo': { definicion: 'Sensación de angustia provocada por un peligro real o imaginario.', ejemplo: 'Tengo miedo de la oscuridad.' },
            'amor': { definicion: 'Sentimiento de afecto, inclinación y entrega hacia alguien o algo.', ejemplo: 'Siento mucho amor por mi familia.' },
            'amistad': { definicion: 'Afecto personal, puro y desinteresado.', ejemplo: 'Nuestra amistad es muy importante.' },

            // Cualidades
            'grande': { definicion: 'Que supera en tamaño a otros de su especie.', ejemplo: 'Un elefante es muy grande.' },
            'pequeño': { definicion: 'De poco tamaño.', ejemplo: 'El ratón es muy pequeño.' },
            'alto': { definicion: 'De gran estatura o altura.', ejemplo: 'Mi hermano es muy alto.' },
            'bajo': { definicion: 'De poca altura o estatura.', ejemplo: 'La mesa es muy baja.' },
            'rápido': { definicion: 'Que se mueve o actúa con velocidad.', ejemplo: 'El guepardo es muy rápido.' },
            'lento': { definicion: 'Que se mueve o actúa con poca velocidad.', ejemplo: 'La tortuga es muy lenta.' },
            'fuerte': { definicion: 'Que tiene fuerza o vigor.', ejemplo: 'El león es muy fuerte.' },
            'débil': { definicion: 'Que tiene poca fuerza.', ejemplo: 'Me siento débil cuando estoy enfermo.' },
            'bonito': { definicion: 'Que tiene belleza o resulta agradable.', ejemplo: 'Ese cuadro es muy bonito.' },
            'feo': { definicion: 'Que carece de belleza.', ejemplo: 'Ese edificio es muy feo.' },

            // Colores
            'rojo': { definicion: 'Color del espectro visible, como el de la sangre.', ejemplo: 'Mi camiseta favorita es roja.' },
            'azul': { definicion: 'Color del espectro visible, como el del cielo despejado.', ejemplo: 'El mar es azul.' },
            'verde': { definicion: 'Color del espectro visible, como el de la hierba.', ejemplo: 'Las hojas son verdes en primavera.' },
            'amarillo': { definicion: 'Color del espectro visible, como el del sol.', ejemplo: 'El sol es amarillo.' },
            'blanco': { definicion: 'Color de la nieve o de la leche.', ejemplo: 'Las nubes son blancas.' },
            'negro': { definicion: 'Color más oscuro, opuesto al blanco.', ejemplo: 'La noche es negra.' },

            // Tiempo
            'día': { definicion: 'Tiempo que tarda la Tierra en dar una vuelta sobre sí misma.', ejemplo: 'Hoy es un día soleado.' },
            'noche': { definicion: 'Tiempo en que está oscuro desde que se pone el sol hasta que sale.', ejemplo: 'En la noche salen las estrellas.' },
            'mañana': { definicion: 'Tiempo desde que amanece hasta el mediodía.', ejemplo: 'Voy a la escuela por la mañana.' },
            'tarde': { definicion: 'Tiempo desde el mediodía hasta el anochecer.', ejemplo: 'Juego en el parque por la tarde.' },
            'hora': { definicion: 'Unidad de tiempo que equivale a 60 minutos.', ejemplo: 'Una hora tiene sesenta minutos.' },
            'año': { definicion: 'Tiempo que tarda la Tierra en dar una vuelta alrededor del Sol.', ejemplo: 'Tengo diez años.' },
            'semana': { definicion: 'Período de siete días consecutivos.', ejemplo: 'La semana tiene siete días.' },
            'mes': { definicion: 'Cada una de las doce partes en que se divide el año.', ejemplo: 'Mi cumpleaños es en el mes de julio.' },

            // Objetos cotidianos
            'mesa': { definicion: 'Mueble con tablero horizontal sostenido por una o varias patas.', ejemplo: 'Comemos en la mesa.' },
            'silla': { definicion: 'Asiento con respaldo para una persona.', ejemplo: 'Me siento en la silla para estudiar.' },
            'puerta': { definicion: 'Abertura en una pared que permite entrar y salir.', ejemplo: 'Cierra la puerta, por favor.' },
            'ventana': { definicion: 'Abertura en una pared para dar luz y ventilación.', ejemplo: 'Miro por la ventana.' },
            'cama': { definicion: 'Mueble destinado para dormir.', ejemplo: 'Mi cama es muy cómoda.' },
            'pelota': { definicion: 'Bola de material elástico para jugar.', ejemplo: 'Juego con la pelota en el patio.' },
            'juguete': { definicion: 'Objeto para que jueguen los niños.', ejemplo: 'Me regalaron un juguete nuevo.' },
            'lápiz': { definicion: 'Instrumento para escribir o dibujar.', ejemplo: 'Escribo con lápiz en mi cuaderno.' },
            'papel': { definicion: 'Material en forma de hoja delgada para escribir o dibujar.', ejemplo: 'Dibujo en papel blanco.' },
            'cuaderno': { definicion: 'Conjunto de hojas de papel cosidas o encuadernadas.', ejemplo: 'Apunto en mi cuaderno.' },

            // Comida
            'pan': { definicion: 'Alimento hecho con harina, agua, sal y levadura.', ejemplo: 'Desayuno pan con mantequilla.' },
            'fruta': { definicion: 'Producto comestible de ciertas plantas.', ejemplo: 'Como fruta todos los días.' },
            'verdura': { definicion: 'Planta comestible que se cultiva en las huertas.', ejemplo: 'Las verduras son muy saludables.' },
            'leche': { definicion: 'Líquido blanco que producen las hembras de los mamíferos.', ejemplo: 'Bebo leche en el desayuno.' },
            'carne': { definicion: 'Parte muscular del cuerpo de los animales.', ejemplo: 'Como carne una vez por semana.' },
            'pescado': { definicion: 'Pez comestible sacado del agua.', ejemplo: 'El pescado es nutritivo.' },
            'huevo': { definicion: 'Cuerpo redondeado que ponen las aves.', ejemplo: 'Desayuno huevos los domingos.' },
            'arroz': { definicion: 'Planta gramínea y su semilla comestible.', ejemplo: 'Me gusta el arroz con pollo.' }
        };

        const wordLower = word.toLowerCase();

        console.log('📖 Buscando palabra en diccionario:', wordLower);

        // Limpiar resultado anterior
        setDictionaryResult(null);

        // Primero intentar buscar en la API de RAE
        try {
            console.log('🌐 Consultando API de RAE...');
            const response = await fetch(`https://rae-api.com/api/words/${encodeURIComponent(wordLower)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('📡 Respuesta HTTP status:', response.status);

            if (!response.ok) {
                console.warn('❌ API de RAE respondió con error:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Respuesta de RAE:', data);

            if (data.ok && data.data && data.data.meanings && data.data.meanings.length > 0) {
                // Extraer la primera definición
                const firstMeaning = data.data.meanings[0];
                const firstSense = firstMeaning.senses && firstMeaning.senses[0];

                let definition = firstSense?.description || 'Definición no disponible.';
                let example = firstSense?.examples?.[0] || null;

                // Si no hay ejemplo en la API, usar del diccionario local si existe
                if (!example && diccionarioEscolar[wordLower]) {
                    example = diccionarioEscolar[wordLower].ejemplo;
                }

                console.log('✅ Definición encontrada en RAE');
                setDictionaryResult({
                    word: word,
                    definition: definition,
                    example: example,
                    etymology: firstMeaning.etymology || null,
                    category: firstSense?.category || null
                });
                return;
            } else {
                console.log('⚠️ Palabra no encontrada en RAE, usando diccionario local');
            }
        } catch (error) {
            console.error('❌ Error al consultar API de RAE:', error);
            console.error('❌ Tipo de error:', error.name);
            console.error('❌ Mensaje:', error.message);
        }

        // Fallback: usar diccionario local
        console.log('📚 Buscando en diccionario local...');
        if (diccionarioEscolar[wordLower]) {
            console.log('✅ Palabra encontrada en diccionario local');
            setDictionaryResult({
                word: word,
                definition: diccionarioEscolar[wordLower].definicion,
                example: diccionarioEscolar[wordLower].ejemplo
            });
        } else {
            console.log('⚠️ Palabra no encontrada en ningún diccionario');
            setDictionaryResult({
                word: word,
                definition: 'Definición no disponible.',
                example: null
            });
        }
    };

    const addHighlight = (color) => {
        if (selectedText && cfiRange && renditionRef.current) {
            renditionRef.current.annotations.highlight(cfiRange, {}, (e) => {
                console.log('Highlight clicked', e);
            }, undefined, { fill: color });

            setHighlights([...highlights, { cfiRange, color, text: selectedText }]);
            setShowDictionary(false);
            setSelectedText('');
            setDictionaryWord('');
            setDictionaryResult(null);
        }
    };

    const addNote = () => {
        if (currentNote && selectedText && cfiRange) {
            setNotes([...notes, { cfiRange, text: selectedText, note: currentNote, date: new Date() }]);
            setCurrentNote('');
            setShowNoteModal(false);
            setShowDictionary(false);
            setSelectedText('');
            setDictionaryWord('');
            setDictionaryResult(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            {/* Header del lector - Mostrar/ocultar al hacer click */}
            {showControls && (
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="font-bold text-gray-800 font-display">{libro.titulo}</h2>
                        <p className="text-sm text-gray-600">{libro.autor}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón índice/TOC */}
                    <button
                        onClick={() => setShowTOC(!showTOC)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Índice"
                    >
                        <List className="w-5 h-5" />
                    </button>

                    {/* Botón marcapáginas */}
                    <button
                        onClick={() => {
                            const currentCfi = renditionRef.current?.currentLocation()?.start?.cfi;
                            if (currentCfi) {
                                const newBookmark = {
                                    cfi: currentCfi,
                                    label: `Página ${currentLocation?.start?.displayed?.page || 'actual'}`,
                                    created: new Date().toISOString()
                                };
                                setBookmarks([...bookmarks, newBookmark]);
                            }
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Añadir marcapáginas"
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>

                    {/* Botón de configuración */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Configuración"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Área del lector */}
                <div
                    className="flex-1 relative flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: themes[settings.theme].background }}
                    onClick={() => setShowControls(!showControls)}
                >
                    {/* Botones de navegación - Mostrar solo si showControls */}
                    {showControls && (
                        <>
                            {/* Botón página anterior */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevPage(); }}
                                className="absolute left-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition z-10"
                            >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                            {/* Botón página siguiente */}
                            <button
                                onClick={(e) => { e.stopPropagation(); nextPage(); }}
                                className="absolute right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Visor EPUB */}
                    <div
                        ref={viewerRef}
                        className="w-full h-full max-w-4xl mx-auto pointer-events-auto"
                        style={{ maxHeight: 'calc(100vh - 120px)' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Panel de Índice/TOC */}
                {showTOC && (
                    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold font-display">📑 Índice</h3>
                            <button onClick={() => setShowTOC(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {toc.length > 0 ? (
                            <div className="space-y-2">
                                {toc.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (renditionRef.current && item.href) {
                                                renditionRef.current.display(item.href);
                                                setShowTOC(false);
                                            }
                                        }}
                                        className="w-full text-left p-3 hover:bg-teal-50 border border-gray-200 rounded-lg transition text-sm"
                                    >
                                        <div className="font-semibold text-gray-800">{item.label}</div>
                                        {item.subitems && item.subitems.length > 0 && (
                                            <div className="ml-4 mt-2 space-y-1">
                                                {item.subitems.map((subitem, subIndex) => (
                                                    <button
                                                        key={subIndex}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (renditionRef.current && subitem.href) {
                                                                renditionRef.current.display(subitem.href);
                                                                setShowTOC(false);
                                                            }
                                                        }}
                                                        className="block w-full text-left px-2 py-1 hover:bg-teal-100 rounded text-xs text-gray-600"
                                                    >
                                                        {subitem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay índice disponible para este libro.</p>
                        )}

                        {/* Sección de Marcapáginas */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-bold font-display mb-3">🔖 Marcapáginas ({bookmarks.length})</h4>
                            {bookmarks.length > 0 ? (
                                <div className="space-y-2">
                                    {bookmarks.map((bookmark, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    if (renditionRef.current && bookmark.cfi) {
                                                        renditionRef.current.display(bookmark.cfi);
                                                        setShowTOC(false);
                                                    }
                                                }}
                                                className="flex-1 text-left p-2 hover:bg-teal-50 border border-gray-200 rounded text-xs"
                                            >
                                                {bookmark.label}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setBookmarks(bookmarks.filter((_, i) => i !== index));
                                                }}
                                                className="p-1 hover:bg-red-50 text-red-500 rounded"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-xs">No hay marcapáginas guardados.</p>
                            )}
                        </div>

                        {/* Sección de Destacados y Notas */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-bold font-display mb-3">✨ Destacados ({highlights.length})</h4>
                            {highlights.length > 0 ? (
                                <div className="space-y-2">
                                    {highlights.map((highlight, index) => (
                                        <div key={index} className="p-2 border border-gray-200 rounded text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: highlight.color }}></div>
                                                <button
                                                    onClick={() => {
                                                        if (renditionRef.current && highlight.cfiRange) {
                                                            renditionRef.current.display(highlight.cfiRange);
                                                            setShowTOC(false);
                                                        }
                                                    }}
                                                    className="flex-1 text-left text-gray-700 hover:text-teal-600"
                                                >
                                                    "{highlight.text}"
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-xs">No hay textos destacados.</p>
                            )}

                            <h4 className="text-sm font-bold font-display mb-3 mt-6">📝 Notas ({notes.length})</h4>
                            {notes.length > 0 ? (
                                <div className="space-y-2">
                                    {notes.map((note, index) => (
                                        <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                            <button
                                                onClick={() => {
                                                    if (renditionRef.current && note.cfiRange) {
                                                        renditionRef.current.display(note.cfiRange);
                                                        setShowTOC(false);
                                                    }
                                                }}
                                                className="w-full text-left"
                                            >
                                                <p className="font-semibold text-gray-800 mb-1 hover:text-teal-600">"{note.text}"</p>
                                                <p className="text-gray-600">{note.note}</p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-xs">No hay notas guardadas.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Panel de configuración */}
                {showSettings && (
                    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4 font-display">⚙️ Configuración</h3>

                        {/* Tamaño de fuente */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tamaño de fuente: {settings.fontSize}px
                            </label>
                            <input
                                type="range"
                                min="14"
                                max="28"
                                value={settings.fontSize}
                                onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                                className="w-full"
                            />
                        </div>

                        {/* Tipografía */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tipografía
                            </label>
                            <select
                                value={settings.fontFamily}
                                onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                            >
                                {fonts.map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Interlineado */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Interlineado: {settings.lineHeight}
                            </label>
                            <input
                                type="range"
                                min="1.2"
                                max="2.5"
                                step="0.1"
                                value={settings.lineHeight}
                                onChange={(e) => setSettings({...settings, lineHeight: parseFloat(e.target.value)})}
                                className="w-full"
                            />
                        </div>

                        {/* Tema de color */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tema
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(themes).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSettings({...settings, theme: key})}
                                        className={`p-3 rounded-lg border-2 transition ${
                                            settings.theme === key ? 'border-teal-600' : 'border-gray-300'
                                        }`}
                                        style={{ backgroundColor: theme.background, color: theme.color }}
                                    >
                                        <div className="text-xs font-semibold">{theme.label}</div>
                                        <div className="text-xs">Aa</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notas guardadas */}
                        {notes.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 Notas ({notes.length})</h4>
                                <div className="space-y-2">
                                    {notes.map((note, index) => (
                                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                                            <p className="font-semibold text-gray-800 mb-1">"{note.text}"</p>
                                            <p className="text-gray-600">{note.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Diccionario flotante */}
            {showDictionary && selectedText && (
                <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800">Texto seleccionado</h3>
                        <button
                            onClick={() => {
                                setShowDictionary(false);
                                setSelectedText('');
                                setDictionaryWord('');
                                setDictionaryResult(null);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 italic">"{selectedText}"</p>

                    {/* Opciones de destacado */}
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Destacar:</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => addHighlight('#ffeb3b')}
                                className="w-8 h-8 rounded-full bg-yellow-400 hover:ring-2 ring-yellow-500"
                                title="Amarillo"
                            />
                            <button
                                onClick={() => addHighlight('#4caf50')}
                                className="w-8 h-8 rounded-full bg-green-400 hover:ring-2 ring-green-500"
                                title="Verde"
                            />
                            <button
                                onClick={() => addHighlight('#2196f3')}
                                className="w-8 h-8 rounded-full bg-blue-400 hover:ring-2 ring-blue-500"
                                title="Azul"
                            />
                            <button
                                onClick={() => addHighlight('#f44336')}
                                className="w-8 h-8 rounded-full bg-red-400 hover:ring-2 ring-red-500"
                                title="Rojo"
                            />
                        </div>
                    </div>

                    {/* Botón de nota */}
                    <button
                        onClick={() => {
                            setShowNoteModal(true);
                            setShowDictionary(false);
                        }}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm mb-3"
                    >
                        📝 Añadir nota
                    </button>

                    {/* Diccionario Escolar */}
                    {dictionaryResult && (
                        <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-teal-700 mb-1">📖 Diccionario (RAE):</p>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-bold text-gray-800 capitalize">{dictionaryResult.word}</p>
                                {dictionaryResult.category && (
                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                                        {dictionaryResult.category}
                                    </span>
                                )}
                            </div>
                            {dictionaryResult.etymology && (
                                <p className="text-xs text-gray-500 italic mb-1">
                                    Etimología: {dictionaryResult.etymology}
                                </p>
                            )}
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{dictionaryResult.definition}</p>
                            {dictionaryResult.example && (
                                <p className="text-xs text-teal-600 mt-2 italic">💬 {dictionaryResult.example}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de nota */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 font-display">📝 Añadir nota</h3>
                        <p className="text-sm text-gray-600 mb-2 italic">"{selectedText}"</p>
                        <textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Escribe tu nota aquí..."
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                        />
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={addNote}
                                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {
                                    setShowNoteModal(false);
                                    setCurrentNote('');
                                }}
                                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para la Vista "Biblioteca" (Proyectos TALENT)
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
        { key: 'Proyectos TALENT', icon: Sparkles, color: 'text-[#C83E7F]' },
        { key: 'Habilidades Lectoras', icon: BookOpen, color: 'text-teal-600' },
        { key: 'Recursos', icon: Globe, color: 'text-amber-600' },
        { key: 'En tu casa', icon: Home, color: 'text-pink-600' },
    ];

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
        { key: 'Mis clases', icon: Users, label: 'Clases' },
        { key: 'Proyectos TALENT', icon: Sparkles, label: 'TALENT' },
        { key: 'Habilidades Lectoras', icon: BookOpen, label: 'Lectura' },
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
  const [activeTab, setActiveTab] = useState('Mis clases');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // ✨ CAMBIO: Logo a color para el header
  const goSteamLogoUrl = "/gosteam_color-logo.87f8073e.svg";
  const goSteamWhiteLogoUrl = "/gosteam_white-logo.svg";

  // Detectar si hay un libro pendiente de abrir en nueva pestaña
  useEffect(() => {
    const openBook = localStorage.getItem('openBook');
    const openBookTime = localStorage.getItem('openBookTime');

    if (openBook && openBookTime) {
      const timeElapsed = Date.now() - parseInt(openBookTime);
      // Solo procesar si fue hace menos de 3 segundos
      if (timeElapsed < 3000) {
        // Cambiar automáticamente a la vista de Habilidades Lectoras
        setActiveTab('Habilidades Lectoras');
      }
    }
  }, []);

  // Resetear clase seleccionada cuando se cambia de tab
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'Mis clases') {
      setSelectedClass(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Mis clases':
        return <MisClasesView selectedClass={selectedClass} setSelectedClass={setSelectedClass} />;
      case 'Proyectos TALENT':
        return <BibliotecaView />;
      case 'Habilidades Lectoras':
        return <HabilidadesLectorasView />;
      case 'Recursos':
        return <div className="p-6 bg-white rounded-xl shadow-md"><h2 className="text-2xl font-bold font-display">Recursos</h2><p className="text-gray-500">Contenido de la sección Recursos.</p></div>;
      case 'En tu casa':
        return <div className="p-6 bg-white rounded-xl shadow-md"><h2 className="text-2xl font-bold font-display">En tu casa</h2><p className="text-gray-500">Contenido para el hogar.</p></div>;
      default:
        return <MisClasesView selectedClass={selectedClass} setSelectedClass={setSelectedClass} />;
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
                    {activeTab !== 'Mis clases' && (
                        <button
                            onClick={() => handleTabChange('Mis clases')}
                            className="mr-4 p-2 rounded-full text-gosteam-purple hover:bg-gray-100 transition"
                            aria-label="Volver a Mis clases"
                        >
                            <Home className="w-6 h-6" />
                        </button>
                    )}
                    {/* Logo TALENT */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-display">TALENT</h1>

                    <h1 className="ml-6 text-xl font-semibold text-gray-700 hidden sm:block font-display">/ {activeTab}</h1>
                </div>

                {/* Acciones & Usuario */}
                <div className="flex items-center space-x-4">
                    <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gosteam-purple" />
                    <UserCircle className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gosteam-purple" />
                    <img src="https://flagcdn.com/w20/es.png" alt="Español" className="w-5 h-4 rounded-sm border border-gray-300" />
                </div>
            </header>

            {/* Quick Navigation Bar */}
            <QuickNav activeTab={activeTab} setActiveTab={handleTabChange} />

            {/* Contenido Principal */}
            <main className="container mx-auto p-4 sm:p-8 max-w-7xl flex-grow mb-16 md:mb-0">
                <p className="text-gray-500 text-sm mb-6">Año Escolar: 2025/2026</p>
                {renderContent()}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

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

                    {/* Logo TALENT en footer */}
                    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold text-white font-display mb-2">TALENT</h2>
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
      <AssistantChatbot isOpen={isAssistantOpen} setIsOpen={setIsAssistantOpen} setActiveTab={handleTabChange} booksData={LIBROS_DATA} />
    </div>
  );
};

export default App;
