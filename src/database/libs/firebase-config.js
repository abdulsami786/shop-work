// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkeQ53foqlPQO7naDxg6jSoG9glp1uKkM",
  authDomain: "shop-7540a.firebaseapp.com",
  databaseURL: "https://shop-7540a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shop-7540a",
  storageBucket: "shop-7540a.appspot.com",
  messagingSenderId: "688601858887",
  appId: "1:688601858887:web:bfeadc068adf643dc28262"
};

// Initialize Firebase
//export const firestore = initializeApp(firebaseConfig);
//firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
//export const firestore = firebase.firestore();