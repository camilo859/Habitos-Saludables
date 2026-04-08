// src/screens/AddEditHabitScreen.js
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useHabits } from '../context/HabitsContext';
import { presetColors, presetIcons } from '../services/habitService';
import { isIOS, isAndroid, platformColors } from '../utils/platformStyles';

export default function AddEditHabitScreen({ route, navigation }) {
  const { habit: existingHabit } = route.params || {};
  const { addHabit, editHabit, categories, addCategory } = useHabits();
  const isEditing = !!existingHabit;

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

  const handleSubmit = () => {
    // Validaciones
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del hábito');
      return;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Por favor selecciona una categoría');
      return;
    }
    if (!formData.goal || parseInt(formData.goal) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una meta válida');
      return;
    }

    const habitData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim() || `Seguimiento de ${formData.name}`,
      goal: parseInt(formData.goal),
      unit: formData.unit.trim() || 'veces',
      icon: formData.icon,
      color: formData.color,
    };

    if (isEditing) {
      editHabit(existingHabit.id, habitData);
      Alert.alert('Éxito', 'Hábito actualizado correctamente');
    } else {
      addHabit(habitData);
      Alert.alert('Éxito', '¡Hábito creado correctamente!');
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>{formData.icon}</Text>
        </View>

        <Text style={styles.label}>Nombre del hábito *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Beber agua, Hacer ejercicio..."
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          maxLength={50}
        />

        <Text style={styles.label}>Categoría *</Text>
        {!showNewCategoryInput ? (
          <View style={styles.categoryRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    formData.category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat })}
                >
                  <Text style={[
                    styles.categoryChipText,
                    formData.category === cat && styles.categoryChipTextActive,
                  ]}>
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
          </View>
        ) : (
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Nueva categoría"
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory}>
              <Text style={styles.addBtnText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowNewCategoryInput(false)}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu hábito..."
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Meta diaria *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 8, 30, 1"
              value={formData.goal}
              onChangeText={(text) => setFormData({ ...formData, goal: text })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Unidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: vasos, minutos, veces"
              value={formData.unit}
              onChangeText={(text) => setFormData({ ...formData, unit: text })}
            />
          </View>
        </View>

        <Text style={styles.label}>Ícono</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
          {presetIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconOption,
                formData.icon === icon && styles.iconOptionActive,
              ]}
              onPress={() => setFormData({ ...formData, icon })}
            >
              <Text style={styles.iconText}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
          {presetColors.map((color) => (
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

        <TouchableOpacity
          style={[styles.submitButton, isAndroid && styles.androidSubmitButton]}
          onPress={handleSubmit}
          activeOpacity={isIOS ? 0.7 : 0.85}
        >
          <Text style={styles.submitButtonText}>
            {isEditing ? 'ACTUALIZAR HÁBITO' : 'CREAR HÁBITO'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { flex: 1, padding: 20 },
  headerIcon: { alignItems: 'center', marginBottom: 20 },
  headerEmoji: { fontSize: 60 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  categoryScroll: { flexGrow: 0 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  categoryChipText: { fontSize: 14, color: '#64748B' },
  categoryChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  addCategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
  },
  addCategoryText: { fontSize: 14, color: '#2563EB', fontWeight: '500' },
  newCategoryContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  cancelBtn: { backgroundColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  cancelBtnText: { color: '#64748B' },
  iconRow: { flexDirection: 'row', marginTop: 8, flexGrow: 0 },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  iconText: { fontSize: 28 },
  colorRow: { flexDirection: 'row', marginTop: 8, flexGrow: 0 },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionActive: { borderColor: '#1E293B', transform: [{ scale: 1.1 }] },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  androidSubmitButton: { borderRadius: 25, paddingVertical: 14 },
  submitButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  cancelButton: { backgroundColor: '#E2E8F0', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#64748B', fontWeight: '600' },
});