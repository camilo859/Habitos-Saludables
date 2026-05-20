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
import PlatformInfo from "../components/PlatformInfo";

import {
  isIOS,
  isAndroid,
  platformColors,
  getShadowStyle,
} from "../utils/platformStyles";

import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from '../services/authService';

/** Fila estadística */
const StatRow = React.memo(({ label, value, color }) => (
  <View style={[styles.statRow, { borderLeftColor: color }]}>
    <Text style={styles.statRowLabel}>{label}</Text>

    <Text style={[styles.statRowValue, { color }]}>
      {value}
    </Text>
  </View>
));

export default function ProfileScreen({ route, navigation }) {

  const { width } = useWindowDimensions();

  const isTablet = width > 600;
  const isDesktop = width > 900;

  const userName = route.params?.userName ?? "Usuario";
  const lastHabit = route.params?.lastHabit ?? "—";
  const lastStreak = route.params?.lastStreak ?? 0;
  const lastFailures = route.params?.lastFailures ?? 0;
  const lastCategory = route.params?.lastCategory ?? "—";
  const lastIcon = route.params?.lastIcon ?? "🏅";
  const lastColor = route.params?.lastColor ?? "#2563EB";
  const lastLevel = route.params?.lastLevel ?? "start";

  const stats = useMemo(() => {

    const totalStreak = habits.reduce(
      (a, h) => a + h.streak,
      0
    );

    const totalFails = habits.reduce(
      (a, h) => a + h.failures,
      0
    );

    const perfectCount = habits.filter(
      (h) => h.failures === 0
    ).length;

    const avgStreak = (
      totalStreak / habits.length
    ).toFixed(1);

    const topHabit = habits.reduce(
      (top, h) =>
        h.streak > top.streak ? h : top,
      habits[0]
    );

    return {
      totalStreak,
      totalFails,
      perfectCount,
      avgStreak,
      topHabit,
    };

  }, []);

  const statsList = useMemo(
    () => [
      {
        id: "1",
        label: "Racha total acumulada",
        value: `🔥 ${stats.totalStreak} días`,
        color: "#F59E0B",
      },
      {
        id: "2",
        label: "Hábitos perfectos",
        value: `✅ ${stats.perfectCount}`,
        color: "#10B981",
      },
      {
        id: "3",
        label: "Racha promedio",
        value: `📈 ${stats.avgStreak} días`,
        color: "#3B82F6",
      },
      {
        id: "4",
        label: "Fallas registradas",
        value: `❌ ${stats.totalFails}`,
        color: "#EF4444",
      },
      {
        id: "5",
        label: "Hábito estrella",
        value: `${stats.topHabit.icon} ${stats.topHabit.name}`,
        color: stats.topHabit.color,
      },
    ],
    [stats]
  );

  const levelColor = getLevelColor(lastLevel);

  const levelLabel = getLevelLabel(lastLevel);

  const handleLogout = () => {

    Alert.alert(
      "Cerrar sesión",
      "¿Deseas salir de la aplicación?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            logoutUser();
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  return (

    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,

          {
            paddingHorizontal: isTablet ? 60 : 20,

            maxWidth: isDesktop ? 1000 : "100%",

            alignSelf: "center",

            width: "100%",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.profileHeader}>

          <AppLogo size={isTablet ? "md" : "sm"} />

          <PlatformInfo />

          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>
                🧑‍💪
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.name,
              {
                fontSize: isTablet ? 24 : 20,
              },
            ]}
          >
            {userName}
          </Text>

          <Text style={styles.username}>
            {userProfile.username}
          </Text>

          <Text style={styles.joined}>
            Miembro desde {userProfile.joinedDate}
          </Text>

          <View style={styles.goalBadge}>
            <Text style={styles.goalText}>
              🎯 {userProfile.goal}
            </Text>
          </View>

        </View>

        {/* CARD MULTIPLATAFORMA */}

        <View style={styles.platformCard}>

          <Text style={styles.platformTitle}>
            Adaptación Multiplataforma
          </Text>

          <Text style={styles.platformDescription}>
            Esta aplicación adapta automáticamente
            estilos, colores y experiencia de usuario
            para Android, iOS y Web.
          </Text>

        </View>

        {/* ÚLTIMO HÁBITO */}

        <Text style={styles.sectionTitle}>
          Último hábito consultado
        </Text>

        <View
          style={[
            styles.lastCard,
            {
              borderLeftColor: lastColor,
            },
          ]}
        >

          <Text style={styles.lastIcon}>
            {lastIcon}
          </Text>

          <View style={styles.lastInfo}>

            <Text style={styles.lastName}>
              {lastHabit}
            </Text>

            <Text style={styles.lastMeta}>
              {lastCategory} · 🔥 {lastStreak} días · ❌ {lastFailures} fallas
            </Text>

            <View
              style={[
                styles.levelBadge,
                {
                  backgroundColor:
                    levelColor + "18",
                },
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  {
                    color: levelColor,
                  },
                ]}
              >
                {levelLabel}
              </Text>
            </View>

          </View>

        </View>

        {/* ESTADÍSTICAS */}

        <Text style={styles.sectionTitle}>
          Resumen general
        </Text>

        <FlatList
          data={statsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StatRow
              label={item.label}
              value={item.value}
              color={item.color}
            />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 8 }} />
          )}
        />

        {/* TOTAL */}

        <View style={styles.totalCard}>

          <Text style={styles.totalNumber}>
            {habits.length}
          </Text>

          <Text style={styles.totalLabel}>
            hábitos activos registrados
          </Text>

        </View>

        {/* LOGOUT */}

        <View style={styles.logoutContainer}>

          <TouchableOpacity
            style={[
              styles.logoutButton,

              isAndroid &&
                styles.androidLogoutButton,
            ]}
            onPress={handleLogout}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >

            <Text style={styles.logoutText}>
              {isIOS
                ? "🚪 Cerrar sesión"
                : "🔴 CERRAR SESIÓN"}
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  scroll: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  container: {
    paddingBottom: 40,
  },

  profileHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,

    ...getShadowStyle("medium"),
  },

  avatarWrap: {
    marginTop: 16,
    marginBottom: 8,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarEmoji: {
    fontSize: 44,
  },

  name: {
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 3,
  },

  username: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },

  joined: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12,
  },

  goalBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  goalText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },

  platformCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,

    ...getShadowStyle("medium"),
  },

  platformTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0F172A",
  },

  platformDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
  },

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

    ...getShadowStyle("medium"),
  },

  lastIcon: {
    fontSize: 38,
  },

  lastInfo: {
    flex: 1,
  },

  lastName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 3,
  },

  lastMeta: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },

  levelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  levelText: {
    fontSize: 11,
    fontWeight: "700",
  },

  statRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,

    ...getShadowStyle("medium"),
  },

  statRowLabel: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
  },

  statRowValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  totalCard: {
    backgroundColor: isIOS
      ? platformColors.ios.primary
      : platformColors.android.primary,

    borderRadius: isIOS ? 20 : 18,

    padding: 22,

    alignItems: "center",

    marginTop: 20,

    ...getShadowStyle("medium"),
  },

  totalNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  totalLabel: {
    fontSize: 14,
    color: "#BFDBFE",
    marginTop: 4,
  },

  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 40,
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  androidLogoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 200,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

});