import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "../firebase/app.js";
import { defaultContent } from "../content/defaultContent.js";
import { normalize, writeCache } from "../content/contentUtils.js";

// Login and saving. Only the admin page loads this file,
// so regular visitors never download it.
//
// The admin has its own Firebase connection. Auth is started FIRST, then Firestore,
// so every save carries the admin's login.
const adminApp = isFirebaseConfigured ? getApps().find((a) => a.name === "admin") ?? initializeApp(firebaseConfig, "admin") : null;
const auth = adminApp ? getAuth(adminApp) : null;
const db = adminApp ? getFirestore(adminApp) : null;
const contentRef = db ? doc(db, "content", "site") : null;

// ---- Login ----
export const watchUser = (callback) => onAuthStateChanged(auth, callback);
export const logout = () => signOut(auth);

// Opens the Google account chooser (a small pop-up window).
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

// ---- Content ----
export async function fetchAdminContent() {
  const snapshot = await getDoc(contentRef);
  return snapshot.exists() ? normalize(snapshot.data()) : defaultContent;
}

export async function saveAdminContent(content) {
  const clean = JSON.parse(JSON.stringify(content)); // Firestore does not accept "undefined"
  await setDoc(contentRef, { ...clean, updatedAt: serverTimestamp() });
  writeCache(clean);
}

