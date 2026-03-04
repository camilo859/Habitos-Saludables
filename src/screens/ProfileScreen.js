import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function ProfileScreen({ route }) {
  const { width } = useWindowDimensions();
  const { lastHabit } = route.params;

  return (
    <View style={[styles.container, { paddingHorizontal: width > 400 ? 60 : 20 }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil del Usuario</Text>
        <Text style={styles.text}>Último hábito visto:</Text>
        <Text style={styles.highlight}>{lastHabit}</Text>
        <Text style={styles.text}>Construyendo disciplina diaria 💪</Text>
      </View>
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
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1E293B",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  highlight: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 10,
  },
});