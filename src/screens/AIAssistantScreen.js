// src/screens/AIAssistantScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { getAIResponse, getSuggestions } from '../services/aiService';
import { isIOS, isAndroid } from '../utils/platformStyles';

export default function AIAssistantScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '👋 ¡Hola! Soy tu asistente de Hábitos Saludables. Puedes preguntarme sobre motivación, ejercicio, alimentación, sueño, estrés y más. ¿En qué te ayudo hoy?',
      isUser: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const suggestions = getSuggestions();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responseText = getAIResponse(input);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 500);
  };

  const handleSuggestionPress = (suggestionText) => {
    setInput(suggestionText);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const MessageBubble = ({ message }) => (
    <View style={[
      styles.messageRow,
      message.isUser ? styles.userRow : styles.aiRow
    ]}>
      {!message.isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText
        ]}>
          {message.text}
        </Text>
      </View>
      {message.isUser && (
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>👤</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEmoji}>🧠</Text>
            <Text style={styles.headerTitle}>Asistente IA</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Mensajes */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>Asistente está pensando...</Text>
            </View>
          )}
        </ScrollView>

        {/* Sugerencias rápidas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}
        >
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress(suggestion.texto)}
            >
              <Text style={styles.suggestionText}>{suggestion.texto}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input y botón enviar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isAndroid && styles.androidInput]}
            placeholder="Escribe tu pregunta aquí..."
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={200}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
            activeOpacity={isIOS ? 0.7 : 0.85}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>

        {/* Mensaje de ayuda */}
        <Text style={styles.helpText}>
          💡 Escribe sobre: motivación, agua, ejercicio, alimentación, sueño, estrés o meditación
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { padding: 8 },
  backText: { fontSize: 28, color: '#FFFFFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerEmoji: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerRight: { width: 40 },
  
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 20 },
  
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { fontSize: 20 },
  
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userAvatarText: { fontSize: 20 },
  
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#1E293B' },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginLeft: 44,
    gap: 8,
  },
  loadingText: { fontSize: 13, color: '#94A3B8' },
  
  suggestionsContainer: { maxHeight: 50, marginBottom: 12 },
  suggestionsContent: { paddingHorizontal: 16, gap: 8 },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionText: { fontSize: 13, color: '#475569' },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxHeight: 100,
  },
  androidInput: { paddingVertical: 12 },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#93C5FD' },
  sendButtonText: { fontSize: 20, color: '#FFFFFF' },
  
  helpText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
});