// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfSQ-ug14PSVujpM8x8W4D2bE9PJ2qU2U",
  authDomain: "wen-lambo-99662.firebaseapp.com",
  projectId: "wen-lambo-99662",
  storageBucket: "wen-lambo-99662.appspot.com",
  messagingSenderId: "1045334011691",
  appId: "1:1045334011691:web:252eae038a8824c6f25f6e",
};

const createFirebaseApp = (config) => {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = "state_changed";

// Get username based off username: string
export const getUserWithUsername = async (username) => {
  const q = query(
    collection(getFirestore(), "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
};

// convert doc to JSON
export const postToJSON = (doc) => {
  const data = doc.data();
  return {
    ...data,
    //Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
};
