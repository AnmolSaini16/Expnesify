// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAYFU3SGPPndeIcgR0EpCEXPTlQ7g2eV-Q",
  authDomain: "expenseify-173ba.firebaseapp.com",
  projectId: "expenseify-173ba",
  storageBucket: "expenseify-173ba.appspot.com",
  messagingSenderId: "981263813080",
  appId: "1:981263813080:web:ea7eea68cfa3047478caad",
  measurementId: "G-T2MMVQWE0M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
