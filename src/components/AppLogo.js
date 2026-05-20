import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { isIOS, isAndroid, isWeb, platformColors, getAnimationConfig } from '../utils/platformStyles';

/**
 * AppLogo — logo de la app Hábitos Saludables.
 * Adaptado para iOS y Android con estilos diferenciados
 */
const SIZES = {
  sm: { icon: 28, badge: 36, title: 13, tagline: 9 },
  md: { icon: 38, badge: 48, title: 17, tagline: 11 },
  lg: { icon: 52, badge: 66, title: 22, tagline: 13 },
};

export default function AppLogo({ size = "md", dark = false, onPress = null }) {
  const s = SIZES[size] || SIZES.md;

  // Colores según plataforma y modo oscuro
  const getBgColor = () => {
    if (dark) return 'rgba(255,255,255,0.20)';

    if (isIOS) return platformColors.ios.primary;

    if (isAndroid) return platformColors.android.primary;

    return platformColors.web.primary;
  };

  const getTitleColor = () => {
    if (dark) return "#FFFFFF";
    return isIOS ? platformColors.ios.text : platformColors.android.text;
  };

  const getTaglineColor = () => {
    if (dark) return isIOS ? "#C7C7CC" : "#BFDBFE";
    return isIOS ? platformColors.ios.textSecondary : platformColors.android.textSecondary;
  };

  const animationConfig = getAnimationConfig();

  const LogoContent = () => (
    <View style={styles.wrapper}>
      {/* Icono circular con hoja + corazón */}
      <View
        style={[
          styles.badge,
          {
            width: s.badge,
            height: s.badge,
            borderRadius: s.badge / 2,
            paddingVertical: 10,
            backgroundColor: getBgColor(),
            ...(isIOS ? styles.iosBadge : styles.androidBadge),
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
            { fontSize: s.title, color: getTitleColor() },
            isIOS && styles.iosTitle,
          ]}
        >
          HábitosApp
        </Text>
        <Text
          style={[
            styles.tagline,
            { fontSize: s.tagline, color: getTaglineColor() },
          ]}
        >
          Vive mejor, cada día
        </Text>
      </View>
    </View>
  );

  // Si hay onPress, hacerlo tappable (iOS más sensible)
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={isIOS ? 0.7 : 0.85}
      >
        <LogoContent />
      </TouchableOpacity>
    );
  }

  return <LogoContent />;
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
  },
  iosBadge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  androidBadge: {
    elevation: 3,
  },
  textBlock: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  iosTitle: {
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  tagline: {
    marginTop: 1,
    fontWeight: "500",
  },
});