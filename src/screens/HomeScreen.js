import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import HabitCard from "../components/HabitCard";
import AppLogo from "../components/AppLogo";
import NotificationBell from "../components/NotificationBell";
import EmptyState from "../components/EmptyState";
import WelcomeModal from "../components/WelcomeModal";
import { habits, categories } from "../utils/dummyData";
import { isIOS, isAndroid, platformName } from "../utils/platformStyles";

export default function HomeScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(false);
  const [showPlatform, setShowPlatform] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const userName = route.params?.userName ?? "Usuario";

  // Configurar header con botones (diferente en cada plataforma)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <NotificationBell />,
      headerLeft: () => (
        <View style={{ flexDirection: 'row', marginLeft: 16 }}>
          {/* Botón de Perfil */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile', { userName: userName })}
            style={{ 
              padding: isIOS ? 8 : 10,
              marginRight: isIOS ? 0 : 8,
            }}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >
            <Text style={{ fontSize: isIOS ? 24 : 22 }}>👤</Text>
          </TouchableOpacity>
          
          {/* Botón de Agregar Hábito en header */}
          {(isTablet || isIOS) && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddEditHabit')}
              style={{ 
                padding: isIOS ? 8 : 10,
                backgroundColor: isAndroid ? '#2563EB' : 'transparent',
                borderRadius: isAndroid ? 20 : 0,
                paddingHorizontal: isAndroid ? 12 : 8,
              }}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={{ 
                fontSize: isIOS ? 24 : 18,
                color: isAndroid ? '#FFFFFF' : '#000000',
              }}>
                {isAndroid ? '+' : '➕'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, userName, isTablet]);

  // Filtrar hábitos
  const filteredHabits = useMemo(() => {
    if (selectedCategory === "Todas") return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [selectedCategory]);

  const summary = useMemo(() => ({
    total: habits.length,
    bestStreak: habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0,
    perfect: habits.filter((h) => h.failures === 0).length,
  }), []);

  const handleHabitPress = useCallback(
    (habit) => navigation.navigate("HabitDetail", { habit, userName }),
    [navigation, userName]
  );

  const handleCategoryPress = useCallback((cat) => setSelectedCategory(cat), []);

  const renderCategory = useCallback(({ item }) => {
    const isActive = item === selectedCategory;
    return (
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.75}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress]);

  const renderHabit = useCallback(
    ({ item }) => <HabitCard habit={item} onPress={handleHabitPress} />,
    [handleHabitPress]
  );

  const ListHeader = useMemo(
    () => (
      <>
        <View style={[styles.hero, { paddingHorizontal: isTablet ? 40 : 20 }]}>
          <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />
          <AppLogo size={isTablet ? "md" : "sm"} dark />
          <Text style={[styles.heroGreeting, { fontSize: isTablet ? 16 : 14 }]}>
            ¡Hola, {userName}! 👋
          </Text>
          
          <TouchableOpacity 
            onPress={() => setShowPlatform(!showPlatform)}
            style={styles.platformBadge}
          >
            <Text style={styles.platformText}>
              {isIOS ? "🍎 iOS" : "🤖 Android"}
            </Text>
          </TouchableOpacity>

          {showPlatform && (
            <View style={styles.platformInfo}>
              <Text style={styles.platformInfoText}>
                Ejecutándose en {platformName} • 
                {isIOS ? " Diseño limpio y fluido" : " Botones optimizados"}
              </Text>
            </View>
          )}

          <Text style={[styles.heroTitle, { fontSize: isTablet ? 26 : 22 }]}>
            Mis Hábitos Saludables
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.total}</Text>
              <Text style={styles.summaryLabel}>Hábitos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>🔥 {summary.bestStreak}</Text>
              <Text style={styles.summaryLabel}>Mejor racha</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>✅ {summary.perfect}</Text>
              <Text style={styles.summaryLabel}>Sin fallas</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chipsContainer,
            { paddingHorizontal: isTablet ? 40 : 14 },
          ]}
          style={styles.chipsList}
        />

        <Text style={[styles.sectionLabel, { paddingHorizontal: isTablet ? 40 : 16 }]}>
          {selectedCategory === "Todas"
            ? `Todos los hábitos (${filteredHabits.length})`
            : `${selectedCategory} (${filteredHabits.length})`}
        </Text>
      </>
    ),
    [isTablet, summary, renderCategory, selectedCategory, filteredHabits.length, userName, showPlatform]
  );

  // Botón flotante (FAB) para agregar hábito
  const FloatingAddButton = () => {
    if (isIOS && isTablet) return null;
    
    return (
      <TouchableOpacity
        style={[
          styles.fab,
          isAndroid && styles.fabAndroid,
          isIOS && styles.fabIOS,
        ]}
        onPress={() => navigation.navigate('AddEditHabit')}
        activeOpacity={isIOS ? 0.7 : 0.85}
      >
        <Text style={[
          styles.fabText,
          isAndroid && styles.fabTextAndroid,
        ]}>
          +
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando tus hábitos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          isAndroid && { paddingBottom: 80 }
        ]}
        ListEmptyComponent={
          <EmptyState 
            onAddPress={() => navigation.navigate('AddEditHabit')}
            message="Comienza creando tu primer hábito. ¡Pequeños cambios, grandes resultados!"
          />
        }
      />
      <FloatingAddButton />
      
      {/* Modal de bienvenida bonito */}
      <WelcomeModal 
        visible={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F1F5F9" },
  loadingText: { marginTop: 12, color: "#64748B", fontSize: 14 },
  hero: {
    backgroundColor: "#2563EB",
    paddingTop: 16,
    paddingBottom: 26,
  },
  heroGreeting: {
    color: "#BFDBFE",
    marginTop: 12,
    marginBottom: 2,
    fontWeight: "600",
  },
  heroTitle: {
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  summaryValue: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  summaryLabel: { fontSize: 11, color: "#BFDBFE", marginTop: 3 },
  chipsList: {
    maxHeight: 54,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  chipsContainer: { paddingVertical: 11, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  chipText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 4,
  },
  listContent: { 
    paddingBottom: 20 
  },
  platformBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginVertical: 8,
    alignSelf: "center",
  },
  platformText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  platformInfo: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  platformInfoText: {
    color: "#BFDBFE",
    fontSize: 11,
    textAlign: "center",
  },
  // Botón flotante (FAB) - Estilos por plataforma
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabAndroid: {
    backgroundColor: '#2563EB',
    elevation: 8,
  },
  fabIOS: {
    backgroundColor: '#007AFF',
    shadowOpacity: 0.2,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fabTextAndroid: {
    fontSize: 32,
    fontWeight: '900',
  },
});