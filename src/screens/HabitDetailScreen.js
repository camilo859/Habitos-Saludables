import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import {
  evaluateHabit,
  getLevelColor,
  getLevelLabel,
  getProgressPercent,
} from "../utils/habitRules";

export default function HabitDetailScreen({ route, navigation }) {
  const { habit, userName } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const evaluation  = useMemo(() => evaluateHabit(habit.streak, habit.failures), [habit]);
  const progress    = useMemo(() => getProgressPercent(habit.streak), [habit.streak]);
  const levelColor  = useMemo(() => getLevelColor(evaluation.level), [evaluation.level]);
  const levelLabel  = useMemo(() => getLevelLabel(evaluation.level), [evaluation.level]);

  const daysLeft = Math.max(0, 21 - habit.streak);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: isTablet ? 60 : 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero card */}
      <View style={[styles.heroCard, { borderTopColor: habit.color }]}>
        <View style={[styles.iconCircle, { backgroundColor: habit.color + "20" }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <Text style={[styles.title, { fontSize: isTablet ? 26 : 22 }]}>
          {habit.name}
        </Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: habit.color + "22" }]}>
            <Text style={[styles.badgeText, { color: habit.color }]}>
              {habit.category}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: levelColor + "20" }]}>
            <Text style={[styles.badgeText, { color: levelColor }]}>
              {levelLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{habit.description}</Text>
      </View>

      {/* Grid de stats */}
      <View style={styles.statsGrid}>
        {[
          { emoji: "🔥", value: habit.streak, label: "días racha" },
          { emoji: "❌", value: habit.failures, label: "fallas" },
          { emoji: "🎯", value: `${habit.goal} ${habit.unit}`, label: "meta diaria" },
          { emoji: "📅", value: daysLeft, label: "días para meta" },
        ].map((s, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statBig}>{s.value}</Text>
            <Text style={styles.statSub}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            Progreso hacia hábito consolidado
          </Text>
          <Text style={[styles.progressPct, { color: habit.color }]}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: habit.color },
            ]}
          />
        </View>
        <Text style={styles.progressSub}>
          {progress >= 100
            ? "🏆 ¡Hábito consolidado (21 días)!"
            : `${daysLeft} días restantes para consolidar este hábito`}
        </Text>
      </View>

      {/* Mensaje de evaluación */}
      <View style={[styles.messageCard, { borderLeftColor: levelColor }]}>
        <Text style={[styles.messageText, { color: levelColor }]}>
          {evaluation.text}
        </Text>
      </View>

      {/* Botón hacia perfil */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: habit.color }]}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("Profile", {
            userName,
            lastHabit:    habit.name,
            lastStreak:   habit.streak,
            lastFailures: habit.failures,
            lastCategory: habit.category,
            lastIcon:     habit.icon,
            lastColor:    habit.color,
            lastLevel:    evaluation.level,
          })
        }
      >
        <Text style={styles.buttonText}>Ver en mi Perfil →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { paddingVertical: 20, paddingBottom: 40 },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: { fontSize: 42 },
  title: {
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontWeight: "700", fontSize: 12 },
  description: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statBig: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
  statSub: { fontSize: 11, color: "#94A3B8", marginTop: 3, textAlign: "center" },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: { fontSize: 13, color: "#475569", fontWeight: "600", flex: 1 },
  progressPct: { fontSize: 18, fontWeight: "800" },
  progressBg: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", borderRadius: 10 },
  progressSub: { fontSize: 12, color: "#94A3B8" },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    elevation: 2,
  },
  messageText: { fontSize: 14, fontWeight: "600", lineHeight: 21 },
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});