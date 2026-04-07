import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  apiKey: "AIzaSyBMMccETHJ_hPltb_ZoXlAWKhO07qeOjk8",
  authDomain: "profilemapper-50c8c.firebaseapp.com",
  projectId: "profilemapper-50c8c",
  storageBucket: "profilemapper-50c8c.firebasestorage.app",
  messagingSenderId: "776898760703",
  appId: "1:776898760703:web:8c9dc4010f639ef3e121ca"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
