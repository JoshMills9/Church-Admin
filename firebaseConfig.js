import { initializeApp } from "firebase/app";
import { FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAJKOzaNv70Ena4rO3Y4xHw82z7HLqkNnM",
  authDomain: "church-admin-73126.firebaseapp.com",
  projectId: "church-admin-73126",
  storageBucket: "church-admin-73126.appspot.com",
  messagingSenderId: "103944520069",
  appId: "1:103944520069:web:a1873d7831c14696fbc4ec",
  measurementId: "G-RW6YJPK341"
  };
  
  // Initialize Firebase
  export const FireBaseApp = initializeApp(firebaseConfig);