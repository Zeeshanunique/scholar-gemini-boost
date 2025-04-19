// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh3rPK4QWauyKGzqktkDuDULAx5FxHuuE",
  authDomain: "slowlearner-a98e4.firebaseapp.com",
  projectId: "slowlearner-a98e4",
  storageBucket: "slowlearner-a98e4.firebasestorage.app",
  messagingSenderId: "1048775600195",
  appId: "1:1048775600195:web:251ee271bb7b64a133ccf6",
  measurementId: "G-4TXG1L9NEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
