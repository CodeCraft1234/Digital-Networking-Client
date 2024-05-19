// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO3aOu6POJSZU_hcg1zM47wBUHcykzwWo",
  authDomain: "e-translator-7637d.firebaseapp.com",
  projectId: "e-translator-7637d",
  storageBucket: "e-translator-7637d.appspot.com",
  messagingSenderId: "776148704750",
  appId: "1:776148704750:web:7aa45be7f5c1acfc4682ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;