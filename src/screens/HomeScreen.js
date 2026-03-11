import React, { useCallback } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, } from "react-native";
import HabitCard from "../components/HabitCard";
import { habits } from "../utils/dummyData";

export default function HomeScreen({ navigation }) {
  const handlePress = useCallback(
    (habit) => {
      navigation.navigate("HabitDetail", { habit });
    },
    [navigation]
  );

  // Cuenta cuántos hábitos están completados
  const completedCount = habits.filter((h) => h.completed).length;

  const renderItem = useCallback(
    ({ item }) => <HabitCard habit={item} onPress={handlePress} />,
    [handlePress]
  );

  const ListHeader = (
    <View style={styles.headerContainer}>
      {/* Línea de acento superior */}
      <View style={styles.accentBar} />

      <Text style={styles.header}>Mis Hábitos</Text>
      <Text style={styles.subheader}>Saludables 💪</Text>

      {/* Contador de progreso del día */}
      <View style={styles.progressPill}>
        <Text style={styles.progressText}>
          {completedCount} / {habits.length} completados hoy
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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

  // ── Header ──────────────────────────────────────────────────
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 32,
  },
  subheader: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3B82F6",
    lineHeight: 34,
    marginBottom: 16,
  },

  // ── Píldora de progreso ──────────────────────────────────────
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
});