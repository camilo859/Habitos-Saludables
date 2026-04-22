// src/screens/AddEditHabitScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useHabits } from '../context/HabitsContext';
import { presetColors, presetIcons } from '../services/habitService';
import { isIOS, isAndroid } from '../utils/platformStyles';

const { width, height } = Dimensions.get('window');

export default function AddEditHabitScreen({ route, navigation }) {
  const { habit: existingHabit } = route.params || {};
  const { addHabit, editHabit, categories, addCategory } = useHabits();
  const isEditing = !!existingHabit;

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    goal: '',
    unit: '',
    icon: '📌',
    color: '#3B82F6',
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (existingHabit) {
      setFormData({
        name: existingHabit.name,
        category: existingHabit.category,
        description: existingHabit.description,
        goal: existingHabit.goal.toString(),
        unit: existingHabit.unit,
        icon: existingHabit.icon,
        color: existingHabit.color,
      });
    }
  }, [existingHabit]);

  // Unidades comunes
  const quickUnits = ['veces', 'minutos', 'horas', 'vasos', 'pasos', 'km', 'días', 'porciones'];
  
  // Sugerencias de meta
  const getGoalSuggestions = () => {
    const unit = formData.unit;
    if (unit === 'vasos') return ['8', '6', '4'];
    if (unit === 'minutos') return ['30', '15', '10', '5'];
    if (unit === 'horas') return ['8', '7', '6'];
    if (unit === 'pasos') return ['10000', '7000', '5000'];
    if (unit === 'km') return ['5', '3', '1'];
    if (unit === 'porciones') return ['5', '3', '2'];
    return ['1', '2', '3'];
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('📝 ¡Atención!', '¿Qué hábito quieres crear? Dale un nombre.', [
        { text: 'Entendido', style: 'default' }
      ]);
      return;
    }
    if (!formData.category) {
      Alert.alert('📂 ¡Atención!', 'Selecciona una categoría para tu hábito.', [
        { text: 'Entendido', style: 'default' }
      ]);
      return;
    }
    if (!formData.goal || parseInt(formData.goal) <= 0) {
      Alert.alert('🎯 ¡Atención!', '¿Cuántas veces al día quieres hacerlo?', [
        { text: 'Entendido', style: 'default' }
      ]);
      return;
    }

    const habitData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim() || `✨ Mi objetivo es ${formData.name} ${formData.goal} ${formData.unit} al día. ¡Vamos por ello!`,
      goal: parseInt(formData.goal),
      unit: formData.unit.trim() || 'vez',
      icon: formData.icon,
      color: formData.color,
    };

    if (isEditing) {
      editHabit(existingHabit.id, habitData);
      Alert.alert('✅ ¡Actualizado!', 'Tu hábito se ha modificado correctamente', [
        { text: 'Genial', style: 'default' }
      ]);
    } else {
      addHabit(habitData);
      Alert.alert('🎉 ¡Hábito creado!', `"${formData.name}" ahora es parte de tu día a día. ¡A por ello!`, [
        { text: 'Comenzar', style: 'default' }
      ]);
    }
    navigation.goBack();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          {/* Vista previa del hábito */}
          <View style={styles.previewCard}>
            <View style={[styles.previewIconContainer, { backgroundColor: formData.color + '15' }]}>
              <View style={[styles.previewIconBg, { backgroundColor: formData.color + '30' }]}>
                <Text style={styles.previewIcon}>{formData.icon}</Text>
              </View>
            </View>
            <Text style={[styles.previewName, { color: formData.color }]}>
              {formData.name || "Nuevo hábito"}
            </Text>
            <View style={[styles.previewBadge, { backgroundColor: formData.color + '10' }]}>
              <Text style={[styles.previewBadgeText, { color: formData.color }]}>
                {formData.category || "Sin categoría"}
              </Text>
            </View>
            {formData.goal && formData.unit && (
              <View style={styles.previewMeta}>
                <Text style={styles.previewMetaText}>
                  🎯 Meta: {formData.goal} {formData.unit} por día
                </Text>
              </View>
            )}
          </View>

          {/* Sección: Información básica */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Información básica</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del hábito <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Hacer ejercicio, Meditar, Leer..."
                placeholderTextColor="#94A3B8"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                maxLength={40}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría <Text style={styles.required}>*</Text></Text>
              {!showNewCategoryInput ? (
                <>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryScrollContent}
                  >
                    {categories.filter(c => c !== "Todas").map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, formData.category === cat && styles.categoryChipActive]}
                        onPress={() => setFormData({ ...formData, category: cat })}
                      >
                        <Text style={[styles.categoryChipText, formData.category === cat && styles.categoryChipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                      style={styles.addCategoryChip} 
                      onPress={() => setShowNewCategoryInput(true)}
                    >
                      <Text style={styles.addCategoryText}>+ Nueva</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </>
              ) : (
                <View style={styles.newCategoryContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    placeholder="Nombre de la nueva categoría"
                    placeholderTextColor="#94A3B8"
                    value={newCategory}
                    onChangeText={setNewCategory}
                    autoFocus
                  />
                  <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory}>
                    <Text style={styles.addBtnText}>Agregar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowNewCategoryInput(false)}>
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="¿Por qué es importante este hábito para ti? ¿Qué quieres lograr?"
                placeholderTextColor="#94A3B8"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Sección: Meta diaria */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎯</Text>
              <Text style={styles.sectionTitle}>¿Cuánto quieres lograr?</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta diaria <Text style={styles.required}>*</Text></Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.goalInput]}
                  placeholder="Cantidad"
                  placeholderTextColor="#94A3B8"
                  value={formData.goal}
                  onChangeText={(text) => setFormData({ ...formData, goal: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.unitInput]}
                  placeholder="Unidad"
                  placeholderTextColor="#94A3B8"
                  value={formData.unit}
                  onChangeText={(text) => setFormData({ ...formData, unit: text })}
                />
              </View>
            </View>

            {formData.unit && (
              <View style={styles.suggestionsGroup}>
                <Text style={styles.suggestionsLabel}>⚡ Sugerencias rápidas:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
                  {getGoalSuggestions().map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => setFormData({ ...formData, goal: suggestion })}
                    >
                      <Text style={styles.suggestionText}>{suggestion} {formData.unit}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unidades comunes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitsScroll}>
                {quickUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitChip, formData.unit === unit && styles.unitChipActive]}
                    onPress={() => setFormData({ ...formData, unit })}
                  >
                    <Text style={[styles.unitChipText, formData.unit === unit && styles.unitChipTextActive]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Sección: Personalización */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎨</Text>
              <Text style={styles.sectionTitle}>Personaliza tu hábito</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ícono</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.iconScroll}
                contentContainerStyle={styles.iconScrollContent}
              >
                {presetIcons.slice(0, 20).map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, formData.icon === icon && styles.iconOptionActive]}
                    onPress={() => setFormData({ ...formData, icon })}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.colorScroll}
                contentContainerStyle={styles.colorScrollContent}
              >
                {presetColors.slice(0, 12).map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color === color && styles.colorOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, color })}
                  />
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.submitButton, isAndroid && styles.androidSubmitButton]}
              onPress={handleSubmit}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? '✨ ACTUALIZAR HÁBITO' : '🚀 CREAR HÁBITO'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={isIOS ? 0.7 : 0.85}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpace} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  contentContainer: { paddingBottom: 40 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  
  // Vista previa
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  previewIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewIcon: { fontSize: 48 },
  previewName: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  previewBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  previewBadgeText: { fontSize: 13, fontWeight: '600' },
  previewMeta: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  previewMetaText: { fontSize: 13, color: '#475569' },
  
  // Secciones
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  sectionIcon: { fontSize: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  required: { color: '#EF4444' },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  
  row: { flexDirection: 'row', gap: 12 },
  goalInput: { flex: 1 },
  unitInput: { flex: 1 },
  
  // Categorías
  categoryScroll: { marginTop: 4 },
  categoryScrollContent: { paddingRight: 20 },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  categoryChipText: { fontSize: 14, color: '#64748B' },
  categoryChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  addCategoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
  },
  addCategoryText: { fontSize: 14, color: '#2563EB', fontWeight: '500' },
  newCategoryContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  cancelBtn: { backgroundColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 },
  cancelBtnText: { color: '#64748B' },
  
  // Sugerencias
  suggestionsGroup: { marginBottom: 20 },
  suggestionsLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  suggestionsScroll: { flexDirection: 'row' },
  suggestionChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  suggestionText: { fontSize: 13, color: '#2563EB' },
  
  // Unidades
  unitsScroll: { flexDirection: 'row', marginTop: 4 },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unitChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  unitChipText: { fontSize: 13, color: '#64748B' },
  unitChipTextActive: { color: '#FFFFFF' },
  
  // Íconos y colores
  iconScroll: { marginTop: 4 },
  iconScrollContent: { paddingRight: 20 },
  iconOption: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  iconText: { fontSize: 28 },
  
  colorScroll: { marginTop: 4 },
  colorScrollContent: { paddingRight: 20 },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorOptionActive: { borderColor: '#1E293B', transform: [{ scale: 1.1 }] },
  
  // Botones
  actionButtons: { marginTop: 8, marginBottom: 20 },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  androidSubmitButton: { borderRadius: 30 },
  submitButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 17, letterSpacing: 0.5 },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: { color: '#64748B', fontWeight: '600', fontSize: 16 },
  bottomSpace: { height: 20 },
});