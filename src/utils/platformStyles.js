// src/utils/platformStyles.js
import { Platform } from 'react-native';

/**
 * Utilidades para adaptación multiplataforma
 */

// Detectar plataforma actual
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const platformName = isIOS ? 'iOS' : 'Android';

// Colores por plataforma
export const platformColors = {
  ios: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
  },
  android: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    background: '#F1F5F9',
    card: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  }
};

// Obtener color según plataforma
export const getPlatformColor = (colorKey) => {
  const colors = isIOS ? platformColors.ios : platformColors.android;
  return colors[colorKey] || colors.primary;
};

// Estilos comunes con diferencias por plataforma
export const platformShadows = {
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  }
};

// Función para obtener sombras según plataforma
export const getShadowStyle = (intensity = 'medium') => {
  const shadows = {
    light: isIOS 
      ? { shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }
      : { elevation: 2 },
    medium: isIOS
      ? { shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }
      : { elevation: 4 },
    heavy: isIOS
      ? { shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 }
      : { elevation: 8 },
  };
  return {
    ...platformShadows,
    ...shadows[intensity],
  };
};

// Animaciones según plataforma
export const getAnimationConfig = () => ({
  spring: isIOS ? {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  } : {
    type: 'timing',
    duration: 200,
  },
  pressOpacity: isIOS ? 0.7 : 0.85,
});