// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIpOkRdEz2dt112W_O0iEi9ObnrpBp6qk",
  authDomain: "creative4-97f97.firebaseapp.com",
  projectId: "creative4-97f97",
  storageBucket: "creative4-97f97.appspot.com",
  messagingSenderId: "541532666993",
  appId: "1:541532666993:web:0d0cb4a79ce73f67f4efd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();