// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpQAha3-HcE_On6VTbFKKikPqdGQ0u76I",
  authDomain: "car-webside-a7d68.firebaseapp.com",
  projectId: "car-webside-a7d68",
  storageBucket: "car-webside-a7d68.firebasestorage.app",
  messagingSenderId: "857824967916",
  appId: "1:857824967916:web:3da7b1472b6de468b5b9c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;