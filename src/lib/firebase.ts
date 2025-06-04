
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCqm-E8AcfU2u7_E5Kr--ht-WXCOUFhDZ4",
  authDomain: "ultra-fast-browser.firebaseapp.com",
  databaseURL: "https://ultra-fast-browser.firebaseio.com",
  projectId: "ultra-fast-browser",
  storageBucket: "ultra-fast-browser.appspot.com",
  messagingSenderId: "882645414768",
  appId: "1:882645414768:web:c6c7185b56f468fca2d5b5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app); // Realtime Database
const dbFirestore = getFirestore(app); // Cloud Firestore

export { app, db, dbFirestore };
