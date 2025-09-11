import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "kyluxehaven",
  "appId": "1:727254553705:web:5a599e6c169bec42ab3ef8",
  "storageBucket": "kyluxehaven.firebasestorage.app",
  "apiKey": "AIzaSyCxtQsBy_D2BqDLHv3YJnMDzrOCTyIjTK8",
  "authDomain": "kyluxehaven.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "727254553705"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
