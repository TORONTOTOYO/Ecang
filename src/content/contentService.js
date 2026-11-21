import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../firebase/app.js";
import { defaultContent } from "./defaultContent.js";

// All site content is stored in ONE Firestore document: content/site
const CACHE_KEY = "portfolio-content-v1";
const contentRef = app ? doc(getFirestore(app), "content", "site") : null;

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

// Fills in anything missing with the default content, so the site never breaks.
export function normalize(saved) {
  const result = {};
  for (const key of Object.keys(defaultContent)) {
    const base = defaultContent[key];
    const value = saved?.[key];
    if (value === undefined) result[key] = base;
    else if (isObject(base) && isObject(value)) result[key] = { ...base, ...value };
    else result[key] = value;
  }
  return result;
}

// ---- Local copy, so returning visitors see the page instantly ----
export function readCache() {
  try {
    const text = localStorage.getItem(CACHE_KEY);
    return text ? normalize(JSON.parse(text)) : null;
  } catch {
    return null;
  }
}
export function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* storage full or blocked: ignore */
  }
}

// ---- Firebase ----
export async function fetchContent() {
  if (!contentRef) return defaultContent;
  const snapshot = await getDoc(contentRef);
  return snapshot.exists() ? normalize(snapshot.data()) : defaultContent;
}

export async function saveContent(content) {
  const clean = JSON.parse(JSON.stringify(content)); // Firestore does not accept "undefined"
  await setDoc(contentRef, { ...clean, updatedAt: serverTimestamp() });
  writeCache(clean);
}
