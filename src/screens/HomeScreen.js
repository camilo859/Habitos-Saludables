import React, { useCallback, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar } from "react-native";
import HabitCard from "../components/HabitCard";
import { habits } from "../utils/dummyData";

export default function HomeScreen({ navigation }) {
  const handlePress = useCallback(
    (habit) => {
      navigation.navigate("HabitDetail", { habit });
    },
    [navigation]
  );

  const today = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits]
  );

  // useMemo: suma total de todas las rachas
  const totalStreak = useMemo(
    () => habits.reduce((acc, h) => acc + h.streak, 0),
    [habits]
  );

  const renderItem = useCallback(
    ({ item }) => <HabitCard habit={item} onPress={handlePress} />,
    [handlePress]
  );

  const ListHeader = (
    <View style={styles.headerContainer}>
      {/* Línea de acento superior */}
      <View style={styles.accentBar} />
      <Text style={styles.header}>Hola, Juan 👋</Text>
      <Text style={styles.subheader}>{today}</Text>

      <View style={styles.statsRow}>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            ✅ {completedCount} / {habits.length} completados hoy
          </Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>
            🔥 {totalStreak} días en total
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
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

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  accentBar: {
    width: 40,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 28,
  },
  subheader: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 16,
    textTransform: "capitalize",
  },

  statsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  progressPill: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  streakPill: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D97706",
  },
});