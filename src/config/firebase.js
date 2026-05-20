import { initializeApp } from 'firebase/app';

import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';

import {
  getFirestore,
} from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';


const firebaseConfig = {
  apiKey: "AIzaSyBBahbKsLWnh_T7NDjWhUYek3NIgEgPf9M",
  authDomain: "habitsapp-569c1.firebaseapp.com",
  projectId: "habitsapp-569c1",
  storageBucket: "habitsapp-569c1.firebasestorage.app",
  messagingSenderId: "846662635029",
  appId: "1:846662635029:web:692858320ab178d590081c"
};

const app = initializeApp(firebaseConfig);

let auth;

// WEB
if (Platform.OS === 'web') {

  auth = getAuth(app);

} else {

  // ANDROID / IOS
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(
      AsyncStorage
    ),
  });

}

const db = getFirestore(app);

export { auth, db };

export default app;