import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBC41eYYdueDl3ukZTtv7n-Ds9tJckxh98",
    authDomain: "student-leave-portal.firebaseapp.com",
    projectId: "student-leave-portal",
    storageBucket: "student-leave-portal.firebasestorage.app",
    messagingSenderId: "889694989220",
    appId: "1:889694989220:web:c5f07905add798224bef31",
    measurementId: "G-SCDZRZDJHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
