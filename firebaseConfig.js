// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC5MKyp60BTit8AOC-X80vaA5SPiW4FwQ4",
  authDomain: "church-administrator.firebaseapp.com",
  projectId: "church-administrator",
  storageBucket: "church-administrator.firebasestorage.app",
  messagingSenderId: "319571230379",
  appId: "1:319571230379:web:99809c22458053efd2c1ee",
  measurementId: "G-W04Q3CN2BY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;