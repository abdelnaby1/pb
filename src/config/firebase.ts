// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrNsSDB7wUlBUbHBfVkc2-YlkGeF0UAB8",
  authDomain: "page-builder1.firebaseapp.com",
  projectId: "page-builder1",
  storageBucket: "page-builder1.appspot.com",
  messagingSenderId: "9136430826",
  appId: "1:9136430826:web:7acaaa1f01eee933238193"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
export const storage = getStorage(app);
