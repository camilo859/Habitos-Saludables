// src/components/EmptyState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isIOS, isAndroid } from '../utils/platformStyles';

export default function EmptyState({ onAddPress, message, icon }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon || '🌱'}</Text>
      <Text style={styles.title}>¡Comienza tu viaje!</Text>
      <Text style={styles.message}>
        {message || 'Aún no tienes hábitos. Crea tu primer hábito y comienza a construir una vida más saludable.'}
      </Text>
      <TouchableOpacity
        style={[styles.button, isAndroid && styles.androidButton]}
        onPress={onAddPress}
        activeOpacity={isIOS ? 0.7 : 0.85}
      >
        <Text style={styles.buttonText}>
          {isAndroid ? '+ CREAR HÁBITO' : '+ Crear hábito'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  icon: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  message: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  androidButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 30 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});