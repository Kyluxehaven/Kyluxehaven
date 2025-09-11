import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "kyluxehaven",
  "appId": "1:727254553705:web:5a599e6c169bec42ab3ef8",
  "storageBucket": "kyluxehaven.appspot.com",
  "apiKey": "AIzaSyCxtQsBy_D2BqDLHv3YJnMDzrOCTyIjTK8",
  "authDomain": "kyluxehaven.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "727254553705"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
