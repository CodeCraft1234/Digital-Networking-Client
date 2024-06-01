// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiFsDaPMDxsShFobypo0kzXQEOI6zBH8E",
  authDomain: "dimple-firebase-e6967.firebaseapp.com",
  projectId: "dimple-firebase-e6967",
  storageBucket: "dimple-firebase-e6967.appspot.com",
  messagingSenderId: "500986617128",
  appId: "1:500986617128:web:5c6489b21a10699186841d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;