// src/services/habitService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HABITS: '@habitossaludables_habits',
  CATEGORIES: '@habitossaludables_categories',
  SETTINGS: '@habitossaludables_settings',
};

// Colores predefinidos para íconos
export const presetColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#D946EF', '#0EA5E9', '#22C55E', '#EAB308',
];

// Íconos predefinidos
export const presetIcons = [
  '💧', '🏋️', '📚', '🧘', '😴', '🍎', '🚶', '🚫',
  '🏃', '🥗', '📖', '🎯', '✍️', '🎨', '🎵', '🧹',
  '💪', '🧠', '❤️', '🌿', '⭐', '🔥', '✅', '🎉',
];

// Guardar hábitos
export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error('Error saving habits:', error);
    return false;
  }
};

// Cargar hábitos
export const loadHabits = async () => {
  try {
    const habits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return habits ? JSON.parse(habits) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

// Guardar categorías
export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving categories:', error);
    return false;
  }
};

// Cargar categorías
export const loadCategories = async () => {
  try {
    const categories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : ['Salud', 'Fitness', 'Mente', 'Nutrición'];
  } catch (error) {
    console.error('Error loading categories:', error);
    return ['Salud', 'Fitness', 'Mente', 'Nutrición'];
  }
};

// Exportar datos (backup)
export const exportData = async () => {
  try {
    const habits = await loadHabits();
    const categories = await loadCategories();
    return { habits, categories, exportDate: new Date().toISOString() };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Importar datos (restore)
export const importData = async (data) => {
  try {
    if (data.habits) await saveHabits(data.habits);
    if (data.categories) await saveCategories(data.categories);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};