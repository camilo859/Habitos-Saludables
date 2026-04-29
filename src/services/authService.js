// src/services/authService.js
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Registro de nuevo usuario
 */
export const registerUser = async (email, password, userName) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar perfil con nombre
    await updateProfile(user, { displayName: userName });
    
    // Datos iniciales del usuario
    const userData = {
      uid: user.uid,
      email: email,
      name: userName,
      createdAt: new Date().toISOString(),
      profile: {
        username: `@${userName.toLowerCase().replace(/\s/g, '')}`,
        joinedDate: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        goal: "Construir hábitos saludables este año",
        avatar: "🧑‍💪"
      },
      habits: [] // Inicialmente sin hábitos
    };
    
    // Guardar en Firestore
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error en registro:', error);
    let errorMessage = 'Error al registrar usuario';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo ya está registrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Inicio de sesión
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Obtener datos de Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() };
    } else {
      return { success: false, error: 'Usuario no encontrado en la base de datos' };
    }
  } catch (error) {
    console.error('Error en login:', error);
    let errorMessage = 'Error al iniciar sesión';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Restablecer contraseña
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Correo de restablecimiento enviado' };
  } catch (error) {
    console.error('Error al restablecer:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};