import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import {
  isIOS,
  isAndroid,
  isWeb,
  platformName,
  getPlatformColor,
} from '../utils/platformStyles';

export default function PlatformInfo() {
  const [showDetails, setShowDetails] = useState(false);

  const showPlatformAlert = () => {
    Alert.alert(
      'Información de Plataforma',
      `Sistema actual: ${Platform.OS}`
    );
  };

  const icon = isIOS ? '🍎' : isAndroid ? '🤖' : '💻';
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setShowDetails(!showDetails)}
      onLongPress={showPlatformAlert}
      activeOpacity={0.85}
    >
      <Text style={styles.platformIcon}>{icon}</Text>

      <View>
        <Text style={styles.platformText}>
          Plataforma: {platformName}
        </Text>

        <Text style={styles.versionText}>
          UX adaptada automáticamente
        </Text>
      </View>

      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {isIOS && 'Diseño minimalista estilo iPhone'}
            {isAndroid && 'Diseño optimizado para Android'}
            {isWeb && 'Interfaz responsive para navegador'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginTop: 10,
    gap: 10,
  },

  platformIcon: {
    fontSize: 22,
  },

  platformText: {
    fontSize: 14,
    fontWeight: '700',
    color: getPlatformColor('primary'),
  },

  versionText: {
    fontSize: 11,
    color: '#64748B',
  },

  details: {
    marginLeft: 10,
  },

  detailText: {
    fontSize: 11,
    color: '#475569',
  },
});