// src/components/WelcomeModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { isIOS, isAndroid } from '../utils/platformStyles';

export default function WelcomeModal({ visible, onClose }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icono principal */}
          <View style={styles.iconContainer}>
            <Text style={styles.mainIcon}>🌿</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>¡Bienvenido!</Text>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Contenido según plataforma */}
          {isIOS ? (
            <>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeIOS}>🍎 iOS</Text>
              </View>
              <View style={styles.featuresList}>
                <Text style={styles.featureText}>✨ Experiencia fluida y elegante</Text>
                <Text style={styles.featureText}>📱 Diseño minimalista</Text>
                <Text style={styles.featureText}>💫 Animaciones suaves</Text>
                <Text style={styles.featureText}>🎯 Enfoque en productividad</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeAndroid}>🤖 Android</Text>
              </View>
              <View style={styles.featuresList}>
                <Text style={styles.featureText}>⚡ Rendimiento optimizado</Text>
                <Text style={styles.featureText}>📊 Control total de hábitos</Text>
                <Text style={styles.featureText}>🔧 Altamente personalizable</Text>
                <Text style={styles.featureText}>💪 Resultados garantizados</Text>
              </View>
            </>
          )}

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Frase motivacional */}
          <Text style={styles.motivationText}>
            "Pequeños hábitos, grandes cambios"
          </Text>

          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Comenzar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainIcon: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badgeIOS: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeAndroid: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuresList: {
    width: '100%',
    gap: 10,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    paddingVertical: 4,
  },
  motivationText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 8,
  },
  closeButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});