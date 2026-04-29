import React from 'react';
import { HabitsProvider } from './src/context/HabitsContext';
import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <HabitsProvider>
      <StackNavigator />
    </HabitsProvider>
  );
}