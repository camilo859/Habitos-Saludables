/**
 * habitRules.js
 * Lógica de evaluación y métricas de hábitos.
 */

/** Evalúa el estado de un hábito según racha y fallas. */
export function evaluateHabit(streak, failures) {
  if (failures >= 4) {
    return {
      text: "⚠️ Considera reducir la meta temporalmente y retomar con pasos más pequeños.",
      level: "danger",
    };
  }
  if (failures >= 2) {
    return {
      text: "🔄 Estás teniendo dificultades. ¡No te rindas, cada día es una nueva oportunidad!",
      level: "warning",
    };
  }
  if (streak >= 21) {
    return {
      text: "🏆 ¡Este hábito ya es parte de ti! Llevas más de 3 semanas seguidas. ¡Increíble!",
      level: "champion",
    };
  }
  if (streak >= 7) {
    return {
      text: "🔥 ¡Racha excelente! Puedes aumentar el desafío o la intensidad.",
      level: "great",
    };
  }
  if (streak >= 3) {
    return {
      text: "💪 ¡Buen ritmo! Sigue construyendo consistencia día a día.",
      level: "good",
    };
  }
  return {
    text: "✅ Estás comenzando. Los primeros días son los más importantes.",
    level: "start",
  };
}

/** Devuelve el color asociado al nivel de evaluación. */
export function getLevelColor(level) {
  const colors = {
    danger:   "#EF4444",
    warning:  "#F59E0B",
    champion: "#7C3AED",
    great:    "#10B981",
    good:     "#3B82F6",
    start:    "#64748B",
  };
  return colors[level] || "#64748B";
}

/** Porcentaje de progreso hacia el hábito consolidado (21 días). */
export function getProgressPercent(streak) {
  return Math.min((streak / 21) * 100, 100);
}

/** Devuelve una etiqueta corta según el nivel. */
export function getLevelLabel(level) {
  const labels = {
    danger:   "En riesgo",
    warning:  "Recuperándose",
    champion: "¡Campeón!",
    great:    "Excelente",
    good:     "En progreso",
    start:    "Iniciando",
  };
  return labels[level] || "—";
}