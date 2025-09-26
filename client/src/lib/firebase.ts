import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Updated Firebase config with your project details
const firebaseConfig = {
  apiKey: "AIzaSyBBcICkB_zO0GKQbd2RF0uMp1tX2b0og2k",
  authDomain: "inner-spring.firebaseapp.com",
  projectId: "inner-spring",
  storageBucket: "inner-spring.appspot.com",
  messagingSenderId: "136212333806",
  appId: "1:136212333806:web:inner-spring-web-app", // Temporary until you register web app
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Test Firebase connection
console.log("🔥 Firebase initialized successfully!");
console.log("📧 Project ID:", firebaseConfig.projectId);
console.log("🌐 Auth Domain:", firebaseConfig.authDomain);

export default app;
