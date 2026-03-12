import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * AppLogo — logo de la app Hábitos Saludables.
 * Usa solo React Native primitivos (sin dependencias extra).
 * Props:
 *   size  — "sm" | "md" | "lg"  (default "md")
 *   dark  — bool, fondo oscuro => texto claro (default false)
 */
const SIZES = {
  sm: { icon: 28, badge: 36, title: 13, tagline: 9 },
  md: { icon: 38, badge: 48, title: 17, tagline: 11 },
  lg: { icon: 52, badge: 66, title: 22, tagline: 13 },
};

export default function AppLogo({ size = "md", dark = false }) {
  const s = SIZES[size] || SIZES.md;

  return (
    <View style={styles.wrapper}>
      {/* Icono circular con hoja + corazón */}
      <View
        style={[
          styles.badge,
          {
            width: s.badge,
            height: s.badge,
            borderRadius: s.badge / 2,
            backgroundColor: dark ? "rgba(255,255,255,0.2)" : "#2563EB",
          },
        ]}
      >
        <Text style={{ fontSize: s.icon, lineHeight: s.badge }}>🌿</Text>
      </View>

      {/* Texto */}
      <View style={styles.textBlock}>
        <Text
          style={[
            styles.title,
            { fontSize: s.title, color: dark ? "#FFFFFF" : "#1E293B" },
          ]}
        >
          HábitosApp
        </Text>
        <Text
          style={[
            styles.tagline,
            { fontSize: s.tagline, color: dark ? "#BFDBFE" : "#64748B" },
          ]}
        >
          Vive mejor, cada día
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  textBlock: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  tagline: {
    marginTop: 1,
    fontWeight: "500",
  },
});