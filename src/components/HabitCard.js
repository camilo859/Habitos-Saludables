// src/components/HabitCard.js (CON BOTONES DE ACCIÓN)
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Vibration,
} from "react-native";
import { evaluateHabit, getLevelColor, getLevelLabel } from "../utils/habitRules";
import { isIOS, isAndroid, getShadowStyle } from "../utils/platformStyles";

const HabitCard = React.memo(({ habit, onPress, onDelete, onEdit }) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const evaluation = React.useMemo(
    () => evaluateHabit(habit.streak, habit.failures),
    [habit.streak, habit.failures]
  );
  const levelColor = getLevelColor(evaluation.level);
  const levelLabel = getLevelLabel(evaluation.level);

  const handlePressWithFeedback = () => {
    if (isAndroid) {
      Vibration.vibrate(50);
    }
    onPress(habit);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(habit);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(habit.id, habit.name);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { marginHorizontal: isTablet ? 40 : 16 },
        getShadowStyle('light'),
      ]}
      onPress={handlePressWithFeedback}
      activeOpacity={isIOS ? 0.7 : 0.85}
    >
      <View style={[styles.accentBar, { backgroundColor: habit.color }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.iconWrap, { backgroundColor: habit.color + "18" }]}>
            <Text style={[styles.icon, { fontSize: isTablet ? 28 : 24 }]}>
              {habit.icon}
            </Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={[styles.title, { fontSize: isTablet ? 18 : 16 }]} numberOfLines={1}>
              {habit.name}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: habit.color + "22" }]}>
                <Text style={[styles.badgeText, { color: habit.color }]}>
                  {habit.category}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: levelColor + "18" }]}>
                <Text style={[styles.badgeText, { color: levelColor }]}>
                  {levelLabel}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>🔥 {habit.streak}</Text>
            <Text style={styles.statLbl}>días racha</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.stat}>
            <Text style={styles.statVal}>❌ {habit.failures}</Text>
            <Text style={styles.statLbl}>fallas</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.stat}>
            <Text style={styles.statVal}>🎯 {habit.goal}</Text>
            <Text style={styles.statLbl}>{habit.unit}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: isIOS ? 18 : 16,
    marginVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    ...(isAndroid && { borderWidth: 0.5, borderColor: "#E2E8F0" }),
  },
  accentBar: { width: 5, alignSelf: "stretch" },
  content: { flex: 1, padding: 14 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 10 },
  icon: { lineHeight: 46 },
  nameBlock: { flex: 1 },
  title: { fontWeight: "700", color: "#1E293B", marginBottom: 5 },
  badgeRow: { flexDirection: "row", gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  actionButtons: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 6 },
  actionBtnText: { fontSize: 18 },
  statsRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 12, padding: 10 },
  stat: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  statLbl: { fontSize: 10, color: "#94A3B8", marginTop: 2 },
  sep: { width: 1, height: 26, backgroundColor: "#E2E8F0" },
  arrow: { fontSize: 26, color: "#CBD5E1", paddingRight: 12 },
});

export default HabitCard;