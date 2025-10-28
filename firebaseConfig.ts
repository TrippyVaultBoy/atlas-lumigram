// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5ZwVIpVGrNokTH3D3rfdG6sPCL1q91CQ",
  authDomain: "lumigram-6eead.firebaseapp.com",
  projectId: "lumigram-6eead",
  storageBucket: "lumigram-6eead.firebasestorage.app",
  messagingSenderId: "52980278767",
  appId: "1:52980278767:web:c536208755b49d9c88821a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});