import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { habits, userProfile } from "../utils/dummyData";
import { getLevelColor, getLevelLabel } from "../utils/habitRules";
import AppLogo from "../components/AppLogo";
import { logoutUser } from "../services/authService";

/** Fila de estadística individual — memoizada para FlatList */
const StatRow = React.memo(({ label, value, color }) => (
  <View style={[styles.statRow, { borderLeftColor: color }]}>
    <Text style={styles.statRowLabel}>{label}</Text>
    <Text style={[styles.statRowValue, { color }]}>{value}</Text>
  </View>
));

export default function ProfileScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  // route.params puede ser undefined si se navega directo (seguridad)
  const userName     = route.params?.userName     ?? "Usuario";
  const lastHabit    = route.params?.lastHabit    ?? "—";
  const lastStreak   = route.params?.lastStreak   ?? 0;
  const lastFailures = route.params?.lastFailures ?? 0;
  const lastCategory = route.params?.lastCategory ?? "—";
  const lastIcon     = route.params?.lastIcon     ?? "🏅";
  const lastColor    = route.params?.lastColor    ?? "#2563EB";
  const lastLevel    = route.params?.lastLevel    ?? "start";

  // Estadísticas globales calculadas con useMemo
  const stats = useMemo(() => {
    const totalStreak  = habits.reduce((a, h) => a + h.streak, 0);
    const totalFails   = habits.reduce((a, h) => a + h.failures, 0);
    const perfectCount = habits.filter((h) => h.failures === 0).length;
    const avgStreak    = (totalStreak / habits.length).toFixed(1);
    const topHabit     = habits.reduce((top, h) => (h.streak > top.streak ? h : top), habits[0]);
    return { totalStreak, totalFails, perfectCount, avgStreak, topHabit };
  }, []);

  const statsList = useMemo(
    () => [
      { id: "1", label: "Racha total acumulada",   value: `🔥 ${stats.totalStreak} días`, color: "#F59E0B" },
      { id: "2", label: "Hábitos sin ninguna falla", value: `✅ ${stats.perfectCount}`,    color: "#10B981" },
      { id: "3", label: "Racha promedio",            value: `📈 ${stats.avgStreak} días`,  color: "#3B82F6" },
      { id: "4", label: "Fallas totales registradas",value: `❌ ${stats.totalFails}`,       color: "#EF4444" },
      {
        id: "5",
        label: "Hábito estrella",
        value: `${stats.topHabit.icon} ${stats.topHabit.name} (${stats.topHabit.streak}d)`,
        color: stats.topHabit.color,
      },
    ],
    [stats]
  );

  const levelColor = getLevelColor(lastLevel);
  const levelLabel = getLevelLabel(lastLevel);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              navigation.replace('Login');
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: isTablet ? 60 : 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera con logo */}
      <View style={styles.profileHeader}>
        <AppLogo size={isTablet ? "md" : "sm"} />
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑‍💪</Text>
          </View>
        </View>
        <Text style={[styles.name, { fontSize: isTablet ? 24 : 20 }]}>
          {userName}
        </Text>
        <Text style={styles.username}>{userProfile.username}</Text>
        <Text style={styles.joined}>Miembro desde {userProfile.joinedDate}</Text>

        {/* Meta personal */}
        <View style={styles.goalBadge}>
          <Text style={styles.goalText}>🎯 {userProfile.goal}</Text>
        </View>
      </View>

      {/* Último hábito consultado */}
      <Text style={styles.sectionTitle}>Último hábito consultado</Text>
      <View style={[styles.lastCard, { borderLeftColor: lastColor }]}>
        <Text style={styles.lastIcon}>{lastIcon}</Text>
        <View style={styles.lastInfo}>
          <Text style={styles.lastName}>{lastHabit}</Text>
          <Text style={styles.lastMeta}>
            {lastCategory} · 🔥 {lastStreak} días · ❌ {lastFailures} fallas
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + "18" }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>
              {levelLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas globales con FlatList */}
      <Text style={styles.sectionTitle}>Resumen general</Text>
      <FlatList
        data={statsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StatRow label={item.label} value={item.value} color={item.color} />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {/* Total hábitos */}
      <View style={styles.totalCard}>
        <Text style={styles.totalNumber}>{habits.length}</Text>
        <Text style={styles.totalLabel}>hábitos activos registrados</Text>
      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { paddingTop: 24, paddingBottom: 40 },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  avatarWrap: { marginTop: 16, marginBottom: 8 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontWeight: "800", color: "#1E293B", marginBottom: 3 },
  username: { fontSize: 14, color: "#64748B", marginBottom: 2 },
  joined: { fontSize: 12, color: "#94A3B8", marginBottom: 12 },
  goalBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  goalText: { fontSize: 12, color: "#2563EB", fontWeight: "600" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  lastCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
    borderLeftWidth: 5,
    elevation: 2,
  },
  lastIcon: { fontSize: 38 },
  lastInfo: { flex: 1 },
  lastName: { fontSize: 17, fontWeight: "700", color: "#1E293B", marginBottom: 3 },
  lastMeta: { fontSize: 13, color: "#64748B", marginBottom: 6 },
  levelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  levelText: { fontSize: 11, fontWeight: "700" },
  statRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statRowLabel: { fontSize: 13, color: "#475569", flex: 1 },
  statRowValue: { fontSize: 14, fontWeight: "700" },
  totalCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  totalNumber: { fontSize: 52, fontWeight: "900", color: "#FFFFFF" },
  totalLabel: { fontSize: 14, color: "#BFDBFE", marginTop: 4 },
  logoutContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});