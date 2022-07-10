// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVoGzA8UYR3X1ipIW4wi1pTdkS8y6Rx8Y",
  authDomain: "real-esatate-marketplace-app.firebaseapp.com",
  projectId: "real-esatate-marketplace-app",
  storageBucket: "real-esatate-marketplace-app.appspot.com",
  messagingSenderId: "439737830758",
  appId: "1:439737830758:web:f19a8d8ee82679298c8ca7"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db=getFirestore()