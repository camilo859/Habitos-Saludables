// src/navigation/StackNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddEditHabitScreen from '../screens/AddEditHabitScreen';
import { isIOS, platformColors } from '../utils/platformStyles';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const screenOptions = {
    headerStyle: { 
      backgroundColor: isIOS ? platformColors.ios.primary : platformColors.android.primary 
    },
    headerTintColor: '#fff',
    headerTitleStyle: { 
      fontWeight: isIOS ? '600' : '800', 
      fontSize: isIOS ? 16 : 17 
    },
    headerShadowVisible: isIOS ? false : true,
    contentStyle: { 
      backgroundColor: isIOS ? '#F2F2F7' : '#F1F5F9' 
    },
    animation: isIOS ? 'default' : 'slide_from_right',
    ...(isIOS && { headerBackTitleVisible: false }),
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        {/* Pantallas de Autenticación */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Pantallas principales de la App */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="HabitDetail" 
          component={HabitDetailScreen} 
          options={{ 
            title: isIOS ? 'Detalle del Hábito' : 'DETALLE DEL HÁBITO',
          }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: isIOS ? 'Mi Perfil' : 'MI PERFIL',
          }} 
        />
        
        {/* Pantalla para crear/editar hábitos */}
        <Stack.Screen 
          name="AddEditHabit" 
          component={AddEditHabitScreen} 
          options={({ route }) => ({ 
            title: route.params?.habit 
              ? (isIOS ? 'Editar Hábito' : 'EDITAR HÁBITO')
              : (isIOS ? 'Nuevo Hábito' : 'NUEVO HÁBITO'),
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}