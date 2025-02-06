import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyATSX-N6DU_27X1ML5VhLpJl6tDKecjq2w",
    authDomain: "zoom-auto-4.firebaseapp.com",
    projectId: "zoom-auto-4",
    storageBucket: "zoom-auto-4.firebasestorage.app",
    messagingSenderId: "288288180510",
    appId: "1:288288180510:web:b0683d0aa9df72ea5c610f",
    measurementId: "G-QNKZ7RL63Y"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);