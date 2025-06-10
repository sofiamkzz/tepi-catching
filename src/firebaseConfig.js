// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Z_6bJN0KWwYMryMBW1lB14nLAr5u-7M",
  authDomain: "a-ddf56.firebaseapp.com",
  databaseURL: "https://a-ddf56-default-rtdb.firebaseio.com",
  projectId: "a-ddf56",
  storageBucket: "a-ddf56.firebasestorage.app",
  messagingSenderId: "782044194487",
  appId: "1:782044194487:web:6b02293c8c285893008f32",
  measurementId: "G-T8STP96H92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };