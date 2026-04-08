import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { loginUser, resetPassword } from '../services/authService';
import { isIOS, isAndroid, platformColors, getShadowStyle } from '../utils/platformStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      navigation.replace('Home', { userName: result.user.name });
    } else {
      Alert.alert('Error de inicio', result.error);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    const result = await resetPassword(resetEmail);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', result.message);
      setShowReset(false);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={[styles.logoText, isIOS && styles.iosLogoText]}>HábitosApp</Text>
        </View>
        
        <Text style={[styles.title, isIOS && styles.iosTitle]}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        {/* Mostrar plataforma (requisito a) */}
        <View style={styles.platformBadge}>
          <Text style={styles.platformText}>
            {isIOS ? '🍎 Ejecutándose en iOS' : '🤖 Ejecutándose en Android'}
          </Text>
        </View>

        {!showReset ? (
          <>
            <TextInput
              style={[styles.input, isIOS && styles.iosInput]}
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={[styles.input, isIOS && styles.iosInput]}
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.button, 
                loading && styles.buttonDisabled,
                isAndroid && styles.androidButton,
                getShadowStyle('light')
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.buttonText, isAndroid && styles.androidButtonText]}>
                  {isAndroid ? 'INICIAR SESIÓN' : 'Iniciar Sesión'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowReset(true)}
              style={styles.linkButton}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isAndroid && styles.androidSecondaryButton
              ]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={[styles.secondaryButtonText, isAndroid && styles.androidSecondaryButtonText]}>
                {isAndroid ? 'CREAR CUENTA NUEVA' : 'Crear cuenta nueva'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, isIOS && styles.iosInput]}
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[
                styles.button, 
                loading && styles.buttonDisabled,
                isAndroid && styles.androidButton
              ]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.buttonText, isAndroid && styles.androidButtonText]}>
                  {isAndroid ? 'ENVIAR ENLACE' : 'Enviar enlace de restablecimiento'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowReset(false)}
              style={styles.linkButton}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={styles.linkText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F1F5F9' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },
  iosLogoText: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  iosTitle: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 32,
  },
  // Badge de plataforma (requisito a)
  platformBadge: {
    backgroundColor: isIOS ? '#E8E8ED' : '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    alignSelf: 'center',
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
    color: isIOS ? '#3A3A3C' : '#475569',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    color: '#1E293B',
    marginBottom: 16,
  },
  iosInput: {
    borderRadius: 12,
    paddingVertical: 15,
  },
  button: {
    width: '100%',
    backgroundColor: isIOS ? platformColors.ios.primary : platformColors.android.primary,
    borderRadius: isIOS ? 14 : 16,
    paddingVertical: isIOS ? 16 : 17,
    alignItems: 'center',
    marginTop: 8,
  },
  androidButton: {
    borderRadius: 25,
    paddingVertical: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
  },
  androidButtonText: {
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isIOS ? platformColors.ios.primary : platformColors.android.primary,
  },
  androidSecondaryButton: {
    borderRadius: 25,
    paddingVertical: 16,
    borderWidth: 2.5,
  },
  secondaryButtonText: {
    color: isIOS ? platformColors.ios.primary : platformColors.android.primary,
    fontWeight: '800',
    fontSize: 17,
  },
  androidSecondaryButtonText: {
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: isIOS ? platformColors.ios.primary : platformColors.android.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 14,
  },
});