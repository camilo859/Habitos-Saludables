import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HabitCard = React.memo(({ habit, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(habit);
  }, [onPress, habit]);

  const isCompleted = habit.completed === true;

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.accentBar, isCompleted && styles.accentBarCompleted]} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {habit.name}
          </Text>
          {isCompleted && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={[styles.streakBadge, isCompleted && styles.streakBadgeCompleted]}>
            <Text style={[styles.streakText, isCompleted && styles.streakTextCompleted]}>
              🔥 {habit.streak} días
            </Text>
          </View>

          {habit.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{habit.category}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

HabitCard.displayName = "HabitCard";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardCompleted: {
    backgroundColor: "#F0FDF4",
    shadowOpacity: 0.04,
  },
  accentBar: {
    width: 4,
    backgroundColor: "#3B82F6",
  },
  accentBarCompleted: {
    backgroundColor: "#22C55E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  titleCompleted: {
    color: "#86EFAC",
    textDecorationLine: "line-through",
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streakBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakBadgeCompleted: {
    backgroundColor: "#DCFCE7",
  },
  streakText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  streakTextCompleted: {
    color: "#16A34A",
  },
  categoryBadge: {
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});

export default HabitCard;