// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_YHVYPlJ4I7pB2xlDbLHV-7d6KLmKcww",
    authDomain: "byond-7a6d7.firebaseapp.com",
    projectId: "byond-7a6d7",
    storageBucket: "byond-7a6d7.firebasestorage.app",
    messagingSenderId: "887883808399",
    appId: "1:887883808399:web:f23268f11ef8d85acfbafa",
    measurementId: "G-EGYJY23FST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);