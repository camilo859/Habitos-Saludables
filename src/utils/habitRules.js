export function evaluateHabit(streak, failures) {
  if (failures >= 3) {
    return "⚠ Se recomienda reducir la meta temporalmente.";
  }

  if (streak >= 7) {
    return "🔥 Excelente constancia. Puedes aumentar el desafío.";
  }

  return "✅ Sigue construyendo el hábito.";
}