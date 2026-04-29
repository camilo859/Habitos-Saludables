/**
 * notifications.js
 * Genera notificaciones in-app basadas en el estado de los hábitos.
 * No requiere librerías externas — notificaciones locales en memoria.
 */

/**
 * Genera un arreglo de notificaciones a partir de la lista de hábitos.
 * @param {Array} habits
 * @returns {Array<{ id, type, title, body, icon, color, time }>}
 */
export function generateNotifications(habits) {
  const now = new Date();
  const notifs = [];

  habits.forEach((habit) => {
    // 🔥 Racha en peligro (tiene fallas recientes)
    if (habit.failures >= 2 && habit.failures < 4) {
      notifs.push({
        id: `warn-${habit.id}`,
        type: "warning",
        title: `⚠️ "${habit.name}" en riesgo`,
        body: `Llevas ${habit.failures} fallas. ¡Retoma hoy para no perder el progreso!`,
        icon: habit.icon,
        color: "#F59E0B",
        time: _minutesAgo(now, 5),
      });
    }

    // 🏆 Racha excelente
    if (habit.streak >= 7 && habit.failures === 0) {
      notifs.push({
        id: `great-${habit.id}`,
        type: "success",
        title: `🔥 ¡Racha de ${habit.streak} días en "${habit.name}"!`,
        body: "¡Increíble constancia! Sigue así y consolida el hábito.",
        icon: habit.icon,
        color: "#10B981",
        time: _minutesAgo(now, 15),
      });
    }

    // 🚨 Hábito muy deteriorado
    if (habit.failures >= 4) {
      notifs.push({
        id: `danger-${habit.id}`,
        type: "danger",
        title: `🚨 "${habit.name}" necesita atención`,
        body: "Considera ajustar tu meta. Cada pequeño paso cuenta.",
        icon: habit.icon,
        color: "#EF4444",
        time: _minutesAgo(now, 30),
      });
    }

    // ✅ Hábito perfecto (sin fallas, racha > 0)
    if (habit.failures === 0 && habit.streak >= 3 && habit.streak < 7) {
      notifs.push({
        id: `good-${habit.id}`,
        type: "info",
        title: `✅ "${habit.name}" va muy bien`,
        body: `${habit.streak} días seguidos sin fallas. ¡Sigue construyendo!`,
        icon: habit.icon,
        color: "#3B82F6",
        time: _minutesAgo(now, 45),
      });
    }
  });

  // Notificación general de bienvenida al día
  notifs.unshift({
    id: "daily",
    type: "info",
    title: "🌅 ¡Buenos días!",
    body: "Revisa tus hábitos de hoy y mantén la racha.",
    icon: "🌿",
    color: "#2563EB",
    time: _minutesAgo(now, 2),
  });

  // Ordenar por más reciente
  return notifs.sort((a, b) => b.time - a.time);
}

/** Helper: resta N minutos a una fecha */
function _minutesAgo(date, mins) {
  return new Date(date.getTime() - mins * 60 * 1000);
}

/** Formatea la hora relativa de una notificación */
export function formatRelativeTime(date) {
  const diffMs   = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1)   return "ahora";
  if (diffMins < 60)  return `hace ${diffMins} min`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24)     return `hace ${diffH}h`;
  return `hace ${Math.floor(diffH / 24)}d`;
}