// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQzFTbjpUZgLm8Ky2qaUa1UwqlnUG6W2o",
  authDomain: "householdtypescript-99808.firebaseapp.com",
  projectId: "householdtypescript-99808",
  storageBucket: "householdtypescript-99808.firebasestorage.app",
  messagingSenderId: "881139912455",
  appId: "1:881139912455:web:d6514a2075c6dbe0ce7fa2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
