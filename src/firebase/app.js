import { initializeApp } from "firebase/app";

// These values come from the .env file (see .env.example).
const env = import.meta.env;
const config = {
  apiKey: "AIzaSyC1pA-JpVz9rbbIA2TViHSRulLmy_tbXgg",
  authDomain: "eca-portfolio.firebaseapp.com",
  projectId: "eca-portfolio",
  storageBucket: "eca-portfolio.firebasestorage.app",
  messagingSenderId: "1031023508144",
  appId: "1:1031023508144:web:45fc6dbd5f72690d005975",
  measurementId: "G-EKCXE781EV"
};

// If .env is not filled in, the site still works using the default content.
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);
export const app = isFirebaseConfigured ? initializeApp(config) : null;

// The only email allowed to use the admin panel
export const adminEmail = env.VITE_ADMIN_EMAIL || "ericamaecaguioa@gmail.com";
