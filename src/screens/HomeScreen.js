import React, { useCallback, useMemo } from "react";
import {View,Text,FlatList,StyleSheet,StatusBar,} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HabitCard from "../components/HabitCard";
import { habits } from "../utils/dummyData";

export default function HomeScreen({ navigation }) {
  // useSafeAreaInsets: respeta la notch y la barra de navegación
  // sin usar el SafeAreaView deprecado
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (habit) => {
      navigation.navigate("HabitDetail", { habit });
    },
    [navigation]
  );

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits]
  );

  const totalStreak = useMemo(
    () => habits.reduce((acc, h) => acc + h.streak, 0),
    [habits]
  );

  const progressPercent = useMemo(
    () => Math.round((completedCount / habits.length) * 100),
    [completedCount]
  );

  const renderItem = useCallback(
    ({ item }) => <HabitCard habit={item} onPress={handlePress} />,
    [handlePress]
  );

  const ListHeader = (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
      {/* Título */}
      <Text style={styles.header}>Mis Hábitos</Text>
      <Text style={styles.subheader}>Saludables 💪</Text>

      {/* Tarjeta de progreso */}
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <Text style={styles.progressLabel}>Progreso de hoy</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        {/* Pills debajo de la barra */}
        <View style={styles.statsRow}>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>
              ✅ {completedCount} / {habits.length} completados
            </Text>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 {totalStreak} días</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>HÁBITOS</Text>
    </View>
  );

  return (
    <View style={[styles.safe, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  listContent: {
    paddingBottom: 32,
  },

  // ── Header ────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 34,
  },
  subheader: {
    fontSize: 30,
    fontWeight: "800",
    color: "#3B82F6",
    lineHeight: 36,
    marginBottom: 20,
  },

  // ── Tarjeta de progreso ───────────────────────────────────────
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#3B82F6",
  },
  progressBarBg: {
    height: 7,
    backgroundColor: "#EFF6FF",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },

  // ── Pills ─────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  progressPill: {
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  streakPill: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  streakText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D97706",
  },

  // ── Section label ─────────────────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginLeft: 2,
    marginBottom: 4,
  },
});