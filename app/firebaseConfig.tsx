// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD7TUUa3qDdOB7Ya6MmnwF43D71H_mVin8",
  authDomain: "instantapp-c3eeb.firebaseapp.com",
  projectId: "instantapp-c3eeb",
  storageBucket: "instantapp-c3eeb.firebasestorage.app",
  messagingSenderId: "305767894053",
  appId: "1:305767894053:web:9ad0ba58f159120c2603cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
