import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* 🔥 ADD THIS */
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa0-mwRt6SfXL8C5jujNx6eRzgS0GqUvs",
  authDomain: "gamemind-85f11.firebaseapp.com",
  projectId: "gamemind-85f11",
  storageBucket: "gamemind-85f11.firebasestorage.app",
  messagingSenderId: "14542802505",
  appId: "1:14542802505:web:0a79166c00fd3be64af998"
};

const app = initializeApp(firebaseConfig);

/* 🔐 AUTH */
export const auth = getAuth(app);

/* 📦 STORAGE (IMAGE UPLOAD KE LIYE) */
export const storage = getStorage(app);