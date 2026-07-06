// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnC_-UQy1qiRPaUGblKoClod2QhTh8Xw0",
  authDomain: "civic-ai-97ef1.firebaseapp.com",
  projectId: "civic-ai-97ef1",
  storageBucket: "civic-ai-97ef1.firebasestorage.app",
  messagingSenderId: "932000780065",
  appId: "1:932000780065:web:d7066ea4b83fe2ea273860",
  measurementId: "G-8DZFC7KXG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;