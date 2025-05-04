// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import Firebase services
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLLwi1vutf_r45kMu1tVttmfE6moc_kZ0",
  authDomain: "tapronics-b7786.firebaseapp.com",
  projectId: "tapronics-b7786",
  storageBucket: "tapronics-b7786.firebasestorage.app",
  messagingSenderId: "1074987442309",
  appId: "1:1074987442309:web:f75adc3807ec4b2ac109ec",
  measurementId: "G-ZHTN8V862E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new  GoogleAuthProvider();
// Optionally initialize analytics if you plan to use it
const analytics = getAnalytics(app);

// Export the services to use in your components
export { auth, provider, db, analytics};
export const storage = getStorage(app); 
