// src/screens/HomeScreen.js
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
import { useHabits } from "../context/HabitsContext";
import { isIOS, isAndroid, platformName } from "../utils/platformStyles";

export default function HomeScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [showPlatform, setShowPlatform] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const userName = route.params?.userName ?? "Usuario";
  
  const { habits, categories, loading, deleteHabit, getGlobalStats } = useHabits();

  const habitsList = habits || [];
  const categoriesList = categories || ["Todas", "Salud", "Fitness", "Mente", "Nutrición"];

  // Configurar header con botones - VERSIÓN CORREGIDA
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <AppLogo size="sm" />,  // Logo en el centro
      headerLeft: () => (
        <View style={{ flexDirection: 'row', marginLeft: 16 }}>
          {/* Botón Asistente IA */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('AIAssistant')}
            style={{ padding: 8, marginRight: 4 }}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </TouchableOpacity>
          
          {/* Botón de Perfil */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile', { userName })}
            style={{ padding: 8 }}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >
            <Text style={{ fontSize: 24 }}>👤</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 16 }}>
          {/* Botón de Agregar Hábito */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddEditHabit')}
            style={{ padding: 8, marginRight: 8 }}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >
            <Text style={{ fontSize: 24 }}>➕</Text>
          </TouchableOpacity>
          {/* Campana de Notificaciones */}
          <NotificationBell />
        </View>
      ),
    });
  }, [navigation, userName]);

  // Filtrar hábitos
  const filteredHabits = useMemo(() => {
    if (selectedCategory === "Todas") return habitsList;
    return habitsList.filter((h) => h?.category === selectedCategory);
  }, [selectedCategory, habitsList]);

  const globalStats = useMemo(() => getGlobalStats(), [habitsList]);
  
  const summary = useMemo(() => ({
    total: habitsList.length,
    bestStreak: habitsList.length > 0 ? Math.max(...habitsList.map((h) => h?.streak || 0)) : 0,
    perfect: habitsList.filter((h) => (h?.failures || 0) === 0).length,
    completedToday: globalStats?.completedToday || 0,
  }), [habitsList, globalStats]);

  const handleHabitPress = useCallback(
    (habit) => navigation.navigate("HabitDetail", { habit, userName }),
    [navigation, userName]
  );

  const handleDeleteHabit = useCallback((habitId, habitName) => {
    Alert.alert('Eliminar hábito', `¿Eliminar "${habitName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteHabit(habitId) }
    ]);
  }, [deleteHabit]);

  const handleEditHabit = useCallback((habit) => {
    navigation.navigate('AddEditHabit', { habit });
  }, [navigation]);

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

  const renderHabit = useCallback(({ item }) => {
    if (!item) return null;
    return (
      <HabitCard 
        habit={item} 
        onPress={handleHabitPress}
        onDelete={handleDeleteHabit}
        onEdit={handleEditHabit}
      />
    );
  }, [handleHabitPress, handleDeleteHabit, handleEditHabit]);

  const ListHeader = useMemo(() => (
    <>
      <View style={[styles.hero, { paddingHorizontal: isTablet ? 40 : 20 }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />
        <Text style={styles.heroGreeting}>¡Hola, {userName}! 👋</Text>
        
        <TouchableOpacity onPress={() => setShowPlatform(!showPlatform)} style={styles.platformBadge}>
          <Text style={styles.platformText}>{isIOS ? "🍎 iOS" : "🤖 Android"}</Text>
        </TouchableOpacity>

        {showPlatform && (
          <View style={styles.platformInfo}>
            <Text style={styles.platformInfoText}>
              Ejecutándose en {platformName} • {isIOS ? "Diseño limpio" : "Botones optimizados"}
            </Text>
          </View>
        )}

        <Text style={styles.heroTitle}>Mis Hábitos Saludables</Text>

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
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>📅 {summary.completedToday}</Text>
            <Text style={styles.summaryLabel}>Hoy</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={categoriesList}
        horizontal
        keyExtractor={(item, index) => item + index}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        style={styles.chipsList}
      />

      <Text style={styles.sectionLabel}>
        {selectedCategory === "Todas"
          ? `Todos los hábitos (${filteredHabits.length})`
          : `${selectedCategory} (${filteredHabits.length})`}
      </Text>
    </>
  ), [isTablet, summary, renderCategory, selectedCategory, filteredHabits.length, userName, showPlatform, categoriesList]);

  const FloatingAddButton = () => (
    <TouchableOpacity
      style={[styles.fab, isAndroid && styles.fabAndroid, isIOS && styles.fabIOS]}
      onPress={() => navigation.navigate('AddEditHabit')}
      activeOpacity={isIOS ? 0.7 : 0.85}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );

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
        keyExtractor={(item) => item?.id || Math.random().toString()}
        renderItem={renderHabit}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState 
            onAddPress={() => navigation.navigate('AddEditHabit')}
            message="¡Comienza creando tu primer hábito!"
          />
        }
        contentContainerStyle={styles.listContent}
      />
      <FloatingAddButton />
      <WelcomeModal visible={showWelcome} onClose={() => setShowWelcome(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F1F5F9" },
  loadingText: { marginTop: 12, color: "#64748B", fontSize: 14 },
  hero: { backgroundColor: "#2563EB", paddingTop: 16, paddingBottom: 26 },
  heroGreeting: { color: "#BFDBFE", marginTop: 12, marginBottom: 2, fontWeight: "600", fontSize: 14, textAlign: "center" },
  heroTitle: { fontWeight: "800", color: "#FFFFFF", marginBottom: 16, fontSize: 22, textAlign: "center" },
  summaryRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16 },
  summaryCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  summaryValue: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  summaryLabel: { fontSize: 10, color: "#BFDBFE", marginTop: 2 },
  chipsList: { maxHeight: 54, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  chipsContainer: { paddingVertical: 11, gap: 8, paddingHorizontal: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0" },
  chipActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  chipText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", marginTop: 16, marginBottom: 4, paddingHorizontal: 16 },
  listContent: { paddingBottom: 80 },
  platformBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginVertical: 8, alignSelf: "center" },
  platformText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  platformInfo: { backgroundColor: "rgba(255,255,255,0.15)", padding: 10, borderRadius: 12, marginTop: 8, marginBottom: 8 },
  platformInfoText: { color: "#BFDBFE", fontSize: 11, textAlign: "center" },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabAndroid: { backgroundColor: '#2563EB', elevation: 8 },
  fabIOS: { backgroundColor: '#007AFF', shadowOpacity: 0.2 },
  fabText: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
});