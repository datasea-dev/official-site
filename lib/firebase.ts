import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLyjsW1jdLzUcwTf2UvNPZNZ02JqcLVMI",
  authDomain: "datasea-web.firebaseapp.com",
  projectId: "datasea-web",
  storageBucket: "datasea-web.firebasestorage.app",
  messagingSenderId: "867345215728",
  appId: "1:867345215728:web:bac3dbabcacff4bd819235"
};


// Singleton pattern: Mencegah inisialisasi ganda di Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };