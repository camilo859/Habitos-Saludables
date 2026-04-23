// src/context/HabitsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialHabits, categories as defaultCategories } from '../utils/dummyData';

const HabitsContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
};

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveHabits();
    }
  }, [habits]);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('@user_habits');
      if (stored) {
        setHabits(JSON.parse(stored));
      } else {
        setHabits(initialHabits);
      }
    } catch (error) {
      console.error('Error loading:', error);
      setHabits(initialHabits);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('@user_habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const addHabit = (habitData) => {
    const today = new Date().toISOString().split('T')[0];
    const newHabit = {
      id: generateId(),
      name: habitData.name,
      category: habitData.category,
      description: habitData.description || `Seguimiento de ${habitData.name}`,
      streak: 0,
      failures: 0,
      goal: habitData.goal || 1,
      unit: habitData.unit || 'vez',
      icon: habitData.icon || '📌',
      color: habitData.color || '#2563EB',
      createdAt: today,
      lastCompleted: null,
      history: [],
    };
    setHabits(prev => [newHabit, ...prev]);
    return newHabit;
  };

  const editHabit = (id, updatedData) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, ...updatedData, updatedAt: new Date().toISOString() }
        : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const completeHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const alreadyCompleted = habit.history?.includes(today);
      if (alreadyCompleted) return habit;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const completedYesterday = habit.history?.includes(yesterdayStr);
      
      const newStreak = completedYesterday ? habit.streak + 1 : 1;
      
      return {
        ...habit,
        streak: newStreak,
        failures: 0,
        lastCompleted: today,
        history: [...(habit.history || []), today],
      };
    }));
  };

  const failHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, failures: habit.failures + 1, streak: 0 }
        : habit
    ));
  };

  const resetHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, streak: 0, failures: 0, history: [] }
        : habit
    ));
  };

  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const getGlobalStats = () => {
    const totalHabits = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const totalFailures = habits.reduce((sum, h) => sum + h.failures, 0);
    const bestHabit = habits.reduce((best, h) => h.streak > best.streak ? h : best, habits[0] || { streak: 0 });
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.history?.includes(today)).length;
    
    return { totalHabits, totalStreak, totalFailures, bestHabit, completedToday };
  };

  return (
    <HabitsContext.Provider value={{
      habits,
      categories,
      loading,
      addHabit,
      editHabit,
      deleteHabit,
      completeHabit,
      failHabit,
      resetHabit,
      addCategory,
      getGlobalStats,
    }}>
      {children}
    </HabitsContext.Provider>
  );
};