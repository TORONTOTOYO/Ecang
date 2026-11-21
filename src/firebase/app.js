import { initializeApp } from "firebase/app";

// These values come from the .env file (see .env.example).
const env = import.meta.env;
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// If .env is not filled in, the site still works using the default content.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// The only email allowed to use the admin panel
export const adminEmail = env.VITE_ADMIN_EMAIL || "caguioaericamae30@gmail.com";
