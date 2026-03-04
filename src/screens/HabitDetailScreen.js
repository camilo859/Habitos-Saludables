import React, { useMemo } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { evaluateHabit } from "../utils/habitRules";

export default function HabitDetailScreen({ route, navigation }) {
  const { habit } = route.params;

  const message = useMemo(() => {
    return evaluateHabit(habit.streak, habit.failures);
  }, [habit]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{habit.name}</Text>
        <Text style={styles.info}>🔥 Racha: {habit.streak} días</Text>
        <Text style={styles.info}>❌ Fallas: {habit.failures}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <Button
        title="Ir al Perfil"
        onPress={() =>
          navigation.navigate("Profile", {
            lastHabit: habit.name,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "85%",
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1E293B",
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  message: {
    marginTop: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
});