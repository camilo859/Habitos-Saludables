import React, { useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import HabitCard from "../components/HabitCard";
import { habits } from "../utils/dummyData";

export default function HomeScreen({ navigation }) {
  const handlePress = useCallback(
    (habit) => {
      navigation.navigate("HabitDetail", { habit });
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Hábitos Saludables</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard habit={item} onPress={handlePress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    margin: 20,
    color: "#1E293B",
  },
});