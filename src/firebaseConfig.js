import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4sYUm6D1GNblVAdnQjPrEOVtX0uufKas",
  authDomain: "starlit-eac09.firebaseapp.com",
  projectId: "starlit-eac09",
  storageBucket: "starlit-eac09.appspot.com",  // ✅ Fixed storageBucket URL
  messagingSenderId: "14976273379",
  appId: "1:14976273379:web:477b405d3efe07d06aeed6",
  measurementId: "G-5BRHGJZJ9M"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);     // Firestore Database
const storage = getStorage(app);  // Firebase Storage

export { db, storage };
