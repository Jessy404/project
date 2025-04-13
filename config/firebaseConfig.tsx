// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import {intializeAuth , getReactNativePersistence} from "firebase/auth";
// import {getAnalytics} from 'firebase/analytics'
// import {ReactNativeAsyncStorage} from "@react-native-async-storage/async-storage"
import {getFirestore} from "firebase/firestore"
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyKIYW-HESeF8pBiJZPh8etQxDZskvTXo",
  authDomain: "medicine-reminder-8f4a5.firebaseapp.com",
  projectId: "medicine-reminder-8f4a5",
  storageBucket: "medicine-reminder-8f4a5.firebasestorage.app",
  messagingSenderId: "1042740888608",
  appId: "1:1042740888608:web:76a3ee7b9d6e66a7fc6845"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth=intializeAuth(app,{
//      persistence:getReactNativePersistence(ReactNativeAsyncStorage)

// })
export const auth = getAuth(app);

export const db= getFirestore(app);
// const analytics = getAnalytics(app);