import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HabitCard = React.memo(({ habit, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(habit)}>
      <Text style={styles.title}>{habit.name}</Text>
      <Text style={styles.streak}>🔥 Racha: {habit.streak} días</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  streak: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default HabitCard;