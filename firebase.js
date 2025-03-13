// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDz5TStcD68EJHqLweAOsCqIOy0ParoEkQ",
  authDomain: "it-ticketing-support-system.firebaseapp.com",
  projectId: "it-ticketing-support-system",
  storageBucket: "it-ticketing-support-system.firebasestorage.app",
  messagingSenderId: "261879692607",
  appId: "1:261879692607:web:23413717acb7a2bf20278a",
  measurementId: "G-KS4FTH80S5"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);