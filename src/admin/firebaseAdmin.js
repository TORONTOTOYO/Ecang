import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/app.js";
import { compressImage } from "./helpers.js";

// Login and photo upload. Only the admin page loads this file,
// so regular visitors never download it.
const auth = app ? getAuth(app) : null;
const storage = app ? getStorage(app) : null;

export const watchUser = (callback) => onAuthStateChanged(auth, callback);
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

// Compresses a photo, uploads it to Firebase Storage, and returns its web address.
export async function uploadImage(file, folder) {
  const { blob, ext } = await compressImage(file);
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 40);
  const fileRef = ref(storage, `images/${folder}/${Date.now()}-${safeName}.${ext}`);
  await uploadBytes(fileRef, blob, { contentType: blob.type, cacheControl: "public,max-age=31536000" });
  return getDownloadURL(fileRef);
}
