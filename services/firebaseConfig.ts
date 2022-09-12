// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBAXxtTV0034pR-thSDjK8vBavMdcgom0",
  authDomain: "dalealasprotes.firebaseapp.com",
  projectId: "dalealasprotes",
  storageBucket: "dalealasprotes.appspot.com",
  messagingSenderId: "1000819537986",
  appId: "1:1000819537986:web:20f7243ff3975eb55e55db",
  measurementId: "G-2FG4TEG9TP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, db, provider };