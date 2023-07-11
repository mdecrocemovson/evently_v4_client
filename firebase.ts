// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  initializeAuth,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "evently-331120.firebaseapp.com",
  projectId: "evently-331120",
  storageBucket: "evently-331120.appspot.com",
  messagingSenderId: "603746874152",
  appId: "1:603746874152:web:3637b6d2c282a4a091d61d",
  measurementId: "G-YG0J1D7RG8",
};

// Initialize Firebase
let app;
if (firebase.getApps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.getApp();
}
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const auth = getAuth(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  storage,
};
