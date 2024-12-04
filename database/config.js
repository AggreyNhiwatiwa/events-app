/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The Firebase configuration 
Note - iOS mentioned because I could not create a new project
on my plan so I repurposed an old one
*/
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCF6SR-QsD4Y6SIq2Zg4ZjxTJxh6fWk9d0",
  authDomain: "ios-demo-6adfc.firebaseapp.com",
  projectId: "ios-demo-6adfc",
  storageBucket: "ios-demo-6adfc.firebasestorage.app",
  messagingSenderId: "797908028281",
  appId: "1:797908028281:web:23f675aa6e87a5d4053da8",
  measurementId: "G-N2YCMP6PWM"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, storage, db }