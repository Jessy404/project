// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDyKIYW-HESeF8pBiJZPh8etQxDZskvTXo",
  authDomain: "medicine-reminder-8f4a5.firebaseapp.com",
  projectId: "medicine-reminder-8f4a5",
  storageBucket: "medicine-reminder-8f4a5.firebasestorage.app",
  messagingSenderId: "1042740888608",
  appId: "1:1042740888608:web:76a3ee7b9d6e66a7fc6845"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db};

