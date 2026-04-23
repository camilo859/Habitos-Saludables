// src/components/PlatformInfo.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { isIOS, isAndroid, platformName, getPlatformColor } from '../utils/platformStyles';

export default function PlatformInfo() {
  const [showDetails, setShowDetails] = useState(false);

  const showPlatformAlert = () => {
    if (isIOS) {
      Alert.alert(
        '📱 Información de Plataforma',
        'Estás usando la versión iOS de HábitosApp.\n\nCaracterísticas:\n• Diseño minimalista\n• Animaciones fluidas\n• Feedback háptico',
        [{ text: 'Entendido' }]
      );
    } else {
      Alert.alert(
        '📱 Información de Plataforma',
        'Estás usando la versión Android de HábitosApp.\n\nCaracterísticas:\n• Botones optimizados\n• Vibración al tocar\n• Diseño llamativo',
        [{ text: '¡Genial!' }]
      );
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => setShowDetails(!showDetails)}
      onLongPress={showPlatformAlert}
      activeOpacity={isIOS ? 0.7 : 0.85}
    >
      <Text style={styles.platformIcon}>
        {isIOS ? '🍎' : '🤖'}
      </Text>
      <Text style={styles.platformText}>
        {platformName}
      </Text>
      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {isIOS 
              ? '✨ Experiencia optimizada para iOS' 
              : '⚡ Rendimiento mejorado para Android'}
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  platformIcon: {
    fontSize: 14,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  details: {
    marginLeft: 8,
  },
  detailText: {
    fontSize: 10,
    color: '#94A3B8',
  },
});