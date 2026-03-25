// src/screens/WelcomeScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AppLogo from "../components/AppLogo";
 
export default function WelcomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const [name, setName] = useState("");
  const [error, setError] = useState("");
 
  const handleContinue = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Por favor ingresa tu nombre (mínimo 2 caracteres).");
      return;
    }
    setError("");
    navigation.replace("Login", { userName: trimmed });
  }, [name, navigation]);
 
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: isTablet ? 80 : 28 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ilustración / logo grande */}
        <View style={styles.logoWrap}>
          <View style={styles.logoBg}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
        </View>
 
        <Text style={[styles.title, { fontSize: isTablet ? 30 : 26 }]}>
          ¡Bienvenido a{"\n"}HábitosApp!
        </Text>
        <Text style={styles.subtitle}>
          Construye disciplina diaria, un hábito a la vez.
        </Text>
 
        {/* Input nombre */}
        <Text style={styles.label}>¿Cómo te llamas?</Text>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null,
            { fontSize: isTablet ? 17 : 15 },
          ]}
          placeholder="Escribe tu nombre aquí..."
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (error) setError("");
          }}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          maxLength={30}
          autoCapitalize="words"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Comenzar →</Text>
        </TouchableOpacity>
 
        <AppLogo size="sm" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#F1F5F9" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    gap: 14,
  },
  logoWrap: { marginBottom: 8 },
  logoBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  logoEmoji: { fontSize: 58 },
  title: {
    fontWeight: "900",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 8,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    color: "#1E293B",
    elevation: 1,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#EF4444",
    marginTop: -6,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 17,
  },
});