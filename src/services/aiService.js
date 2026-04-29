// src/services/aiService.js

/**
 * Asistente de IA para Hábitos Saludables
 * Simula comportamiento de IA analizando palabras clave
 */

// Palabras clave y respuestas asociadas
const respuestasIA = {
  motivacion: {
    palabras: ["motiv", "ánimo", "desanim", "triste", "cansad", "sin ganas", "no puedo", "difícil", "cuesta"],
    respuestas: [
      "💪 ¡Tú puedes! Recuerda que cada pequeño paso cuenta. ¿Qué tal si empiezas con algo pequeño hoy?",
      "🌟 La constancia es más importante que la intensidad. Un 1% mejor cada día es suficiente.",
      "🎯 No te compares con otros, compárate con tu yo de ayer. ¡Ya has avanzado mucho!",
      "🌱 Los hábitos se construyen día a día. No te rindas, mañana es una nueva oportunidad.",
    ]
  },
  agua: {
    palabras: ["agua", "hidrat", "beber", "sed", "vaso", "litro"],
    respuestas: [
      "💧 ¡Excelente! Beber agua es fundamental. Recuerda tomar al menos 8 vasos al día.",
      "🚰 ¿Sabías que la deshidratación afecta tu energía y concentración? ¡Toma agua ahora!",
      "🥤 Tips para beber más agua: lleva una botella siempre contigo, pon alarmas o usa una app.",
    ]
  },
  ejercicio: {
    palabras: ["ejercicio", "gimnasio", "entrenar", "caminar", "correr", "deporte", "cardio"],
    respuestas: [
      "🏃‍♂️ ¡Qué bien! El ejercicio regular mejora tu salud física y mental.",
      "💪 No necesitas horas en el gimnasio. 30 minutos diarios de caminata ya hacen diferencia.",
      "🎵 Prueba ejercicios que disfrutes: bailar, nadar, senderismo. ¡El movimiento debe ser divertido!",
    ]
  },
  comida: {
    palabras: ["comer", "aliment", "dieta", "comida", "nutrición", "fruta", "verdura", "saludable"],
    respuestas: [
      "🥗 ¡La alimentación es la base de la salud! Intenta incluir colores en tu plato.",
      "🍎 Pequeños cambios: reemplaza refrescos por agua, añade una fruta a tu desayuno.",
      "🥑 No se trata de dietas extremas, sino de hábitos sostenibles. ¡Come balanceado!",
    ]
  },
  sueño: {
    palabras: ["dormir", "sueño", "descansar", "cansancio", "insomnio", "trasnochar"],
    respuestas: [
      "😴 Dormir bien es tan importante como hacer ejercicio. ¡Apunta a 7-8 horas diarias!",
      "🌙 Tips para mejor sueño: sin pantallas 1 hora antes, habitación oscura y fresca.",
      "⏰ Intenta mantener un horario regular. Acostarte y levantarte a la misma hora ayuda mucho.",
    ]
  },
  estres: {
    palabras: ["estrés", "ansiedad", "nervios", "preocup", "tensión", "relajar", "calmar"],
    respuestas: [
      "🧘 Respira profundamente. Inhala 4 segundos, sostén 4, exhala 4. Repite 5 veces.",
      "🌿 El estrés es normal, pero no dejes que te controle. Tómate 5 minutos para ti.",
      "📵 Desconectarte del celular y redes sociales por un rato puede reducir tu ansiedad.",
    ]
  },
  meditacion: {
    palabras: ["meditar", "meditación", "mindfulness", "concentrar", "enfoque", "mente"],
    respuestas: [
      "🙏 La meditación transforma tu mente. Empieza con 5 minutos al día.",
      "🧠 La atención plena (mindfulness) reduce el estrés y mejora tu enfoque.",
      "🌅 Meditar por la mañana te prepara para un día más tranquilo y productivo.",
    ]
  },
  saludo: {
    palabras: ["hola", "buenos días", "buenas tardes", "hey", "saludos", "qué tal", "cómo estás"],
    respuestas: [
      "👋 ¡Hola! Soy tu asistente de Hábitos Saludables. ¿En qué puedo ayudarte?",
      "🌟 ¡Bienvenido/a! Cuéntame, ¿cómo va tu día con los hábitos saludables?",
      "💚 ¡Hola! Estoy aquí para motivarte y darte consejos.",
    ]
  },
  // Respuesta por defecto
  default: [
    "🤔 No estoy seguro de entender. Escribe: 'motivación', 'agua', 'ejercicio', 'alimentación', 'sueño' o 'estrés'",
    "💭 Escribe algo como: 'motivación', 'agua', 'ejercicio', 'alimentación', 'sueño' o 'estrés'",
    "📝 Puedo ayudarte con consejos sobre hábitos saludables. ¿Qué te gustaría saber?",
  ]
};

// Función principal de IA
export const getAIResponse = (userInput) => {
  if (!userInput || userInput.trim() === "") {
    return "📝 Escribe algo y te ayudaré con tus hábitos saludables.";
  }
  
  const texto = userInput.toLowerCase().trim();
  
  // Buscar coincidencias
  for (const categoria in respuestasIA) {
    if (categoria === "default") continue;
    
    const config = respuestasIA[categoria];
    const coincide = config.palabras.some(palabra => texto.includes(palabra));
    
    if (coincide) {
      const respuestas = config.respuestas;
      const indiceAleatorio = Math.floor(Math.random() * respuestas.length);
      return respuestas[indiceAleatorio];
    }
  }
  
  // Respuesta genérica
  const respuestasDefault = respuestasIA.default;
  const indiceAleatorio = Math.floor(Math.random() * respuestasDefault.length);
  return respuestasDefault[indiceAleatorio];
};

// Sugerencias rápidas para el usuario
export const getSuggestions = () => {
  return [
    { texto: "💪 Dame motivación", categoria: "motivacion" },
    { texto: "💧 Consejos sobre agua", categoria: "agua" },
    { texto: "🏃 Tips de ejercicio", categoria: "ejercicio" },
    { texto: "🥗 Alimentación saludable", categoria: "comida" },
    { texto: "😴 Mejorar mi sueño", categoria: "sueño" },
    { texto: "🧘 Reducir el estrés", categoria: "estres" },
    { texto: "🙏 Cómo meditar", categoria: "meditacion" },
  ];
};