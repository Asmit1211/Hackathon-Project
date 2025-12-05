import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMOCQGIBUzX8HWOiJVYzj7EVe99eNQ-f8",
  authDomain: "cursedrelics-90de1.firebaseapp.com",
  projectId: "cursedrelics-90de1",
  storageBucket: "cursedrelics-90de1.firebasestorage.app",
  messagingSenderId: "154041564808",
  appId: "1:154041564808:web:9be52a80ad2837f14f293d",
  measurementId: "G-1EQ672HHNY",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
