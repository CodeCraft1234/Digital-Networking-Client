// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEIlRD1Ci_U87aHJh9tCmsCLscqf19ISs",
  authDomain: "sports-events-c37b9.firebaseapp.com",
  projectId: "sports-events-c37b9",
  storageBucket: "sports-events-c37b9.firebasestorage.app",
  messagingSenderId: "30047919735",
  appId: "1:30047919735:web:a63247c0c1ce4451e87072"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;