// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBahbKsLWnh_T7NDjWhUYek3NIgEgPf9M",
  authDomain: "habitsapp-569c1.firebaseapp.com",
  projectId: "habitsapp-569c1",
  storageBucket: "habitsapp-569c1.firebasestorage.app",
  messagingSenderId: "846662635029",
  appId: "1:846662635029:web:692858320ab178d590081c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializar Firestore
const db = getFirestore(app);

export { auth, db };