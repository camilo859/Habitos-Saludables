// src/screens/HabitDetailScreen.js (CON ACCIONES)
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from "react-native";
import {
  evaluateHabit,
  getLevelColor,
  getLevelLabel,
  getProgressPercent,
} from "../utils/habitRules";
import { useHabits } from "../context/HabitsContext";
import { isIOS, isAndroid } from "../utils/platformStyles";

export default function HabitDetailScreen({ route, navigation }) {
  const { habit, userName } = route.params;
  const { completeHabit, failHabit, resetHabit, deleteHabit } = useHabits();
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const [currentHabit, setCurrentHabit] = useState(habit);

  // Actualizar cuando cambie el hábito
  React.useEffect(() => {
    setCurrentHabit(habit);
  }, [habit]);

  const evaluation = useMemo(() => evaluateHabit(currentHabit.streak, currentHabit.failures), [currentHabit]);
  const progress = useMemo(() => getProgressPercent(currentHabit.streak), [currentHabit.streak]);
  const levelColor = useMemo(() => getLevelColor(evaluation.level), [evaluation.level]);
  const levelLabel = useMemo(() => getLevelLabel(evaluation.level), [evaluation.level]);
  const daysLeft = Math.max(0, 21 - currentHabit.streak);

  const today = new Date().toISOString().split('T')[0];
  const alreadyCompletedToday = currentHabit.history?.includes(today);

  const handleComplete = () => {
    Alert.alert(
      'Completar hábito',
      `¿Completaste "${currentHabit.name}" hoy?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: '¡Sí!',
          onPress: () => {
            completeHabit(currentHabit.id);
            setCurrentHabit(prev => ({ ...prev, streak: prev.streak + 1, failures: 0 }));
            Alert.alert('🎉 ¡Excelente!', 'Sigue así, estás construyendo un gran hábito');
          }
        }
      ]
    );
  };

  const handleFail = () => {
    Alert.alert(
      'Falla registrada',
      `¿No pudiste completar "${currentHabit.name}" hoy?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Registrar falla',
          style: 'destructive',
          onPress: () => {
            failHabit(currentHabit.id);
            setCurrentHabit(prev => ({ ...prev, failures: prev.failures + 1, streak: 0 }));
            Alert.alert('💪 No te rindas', 'Mañana es un nuevo día para retomarlo');
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reiniciar hábito',
      `¿Reiniciar completamente "${currentHabit.name}"? Esto borrará toda la racha y el historial.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: () => {
            resetHabit(currentHabit.id);
            setCurrentHabit(prev => ({ ...prev, streak: 0, failures: 0, history: [] }));
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar hábito',
      `¿Eliminar permanentemente "${currentHabit.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteHabit(currentHabit.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddEditHabit', { habit: currentHabit });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingHorizontal: isTablet ? 60 : 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroCard, { borderTopColor: currentHabit.color }]}>
        <View style={[styles.iconCircle, { backgroundColor: currentHabit.color + "20" }]}>
          <Text style={styles.icon}>{currentHabit.icon}</Text>
        </View>
        <Text style={[styles.title, { fontSize: isTablet ? 26 : 22 }]}>
          {currentHabit.name}
        </Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: currentHabit.color + "22" }]}>
            <Text style={[styles.badgeText, { color: currentHabit.color }]}>
              {currentHabit.category}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: levelColor + "20" }]}>
            <Text style={[styles.badgeText, { color: levelColor }]}>
              {levelLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{currentHabit.description}</Text>
      </View>

      <View style={styles.statsGrid}>
        {[
          { emoji: "🔥", value: currentHabit.streak, label: "días racha" },
          { emoji: "❌", value: currentHabit.failures, label: "fallas" },
          { emoji: "🎯", value: `${currentHabit.goal} ${currentHabit.unit}`, label: "meta diaria" },
          { emoji: "📅", value: daysLeft, label: "días para meta" },
        ].map((s, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statBig}>{s.value}</Text>
            <Text style={styles.statSub}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progreso hacia hábito consolidado</Text>
          <Text style={[styles.progressPct, { color: currentHabit.color }]}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: currentHabit.color }]} />
        </View>
        <Text style={styles.progressSub}>
          {progress >= 100
            ? "🏆 ¡Hábito consolidado (21 días)! Sigue así"
            : `${daysLeft} días restantes para consolidar este hábito`}
        </Text>
      </View>

      <View style={[styles.messageCard, { borderLeftColor: levelColor }]}>
        <Text style={[styles.messageText, { color: levelColor }]}>
          {evaluation.text}
        </Text>
      </View>

      {/* Botones de acción diarios */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.completeButton, alreadyCompletedToday && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={alreadyCompletedToday}
          activeOpacity={isIOS ? 0.7 : 0.85}
        >
          <Text style={styles.completeButtonText}>
            {alreadyCompletedToday ? '✓ COMPLETADO HOY' : '✅ COMPLETAR HOY'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.failButton}
          onPress={handleFail}
          activeOpacity={isIOS ? 0.7 : 0.85}
        >
          <Text style={styles.failButtonText}>❌ NO PUDE</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de gestión */}
      <View style={styles.manageRow}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reiniciar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.profileButton, { backgroundColor: currentHabit.color }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Profile", {
          userName,
          lastHabit: currentHabit.name,
          lastStreak: currentHabit.streak,
          lastFailures: currentHabit.failures,
          lastCategory: currentHabit.category,
          lastIcon: currentHabit.icon,
          lastColor: currentHabit.color,
          lastLevel: evaluation.level,
        })}
      >
        <Text style={styles.profileButtonText}>Ver en mi Perfil →</Text>
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
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  icon: { fontSize: 42 },
  title: { fontWeight: "800", color: "#1E293B", textAlign: "center", marginBottom: 8 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontWeight: "700", fontSize: 12 },
  description: { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 21 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statBox: { flex: 1, minWidth: "45%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, alignItems: "center", elevation: 2 },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statBig: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
  statSub: { fontSize: 11, color: "#94A3B8", marginTop: 3, textAlign: "center" },
  progressCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginBottom: 16 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  progressTitle: { fontSize: 13, color: "#475569", fontWeight: "600", flex: 1 },
  progressPct: { fontSize: 18, fontWeight: "800" },
  progressBg: { height: 12, backgroundColor: "#E2E8F0", borderRadius: 10, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", borderRadius: 10 },
  progressSub: { fontSize: 12, color: "#94A3B8" },
  messageCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginBottom: 16, borderLeftWidth: 4 },
  messageText: { fontSize: 14, fontWeight: "600", lineHeight: 21 },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  completeButton: { flex: 2, backgroundColor: "#10B981", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  completeButtonDisabled: { backgroundColor: "#A7F3D0" },
  completeButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  failButton: { flex: 1, backgroundColor: "#EF4444", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  failButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  manageRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  editButton: { flex: 1, backgroundColor: "#3B82F6", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  editButtonText: { color: "#FFFFFF", fontWeight: "600" },
  resetButton: { flex: 1, backgroundColor: "#F59E0B", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  resetButtonText: { color: "#FFFFFF", fontWeight: "600" },
  deleteButton: { flex: 1, backgroundColor: "#EF4444", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  deleteButtonText: { color: "#FFFFFF", fontWeight: "600" },
  profileButton: { borderRadius: 16, padding: 18, alignItems: "center", elevation: 3 },
  profileButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});