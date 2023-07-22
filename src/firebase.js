// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB__-g8G9EBIvYfGcaHYuT3ztgf3DYb5TM",
  authDomain: "chatapp-dd303.firebaseapp.com",
  projectId: "chatapp-dd303",
  storageBucket: "chatapp-dd303.appspot.com",
  messagingSenderId: "77698396258",
  appId: "1:77698396258:web:5ade71c11b271bc62c213b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()