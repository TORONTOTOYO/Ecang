import { defaultContent } from "./defaultContent.js";

// Helpers shared by the website and the admin panel (no Firebase code here).
const CACHE_KEY = "portfolio-content-v1";

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
  if (isObject(result.contact)) {
    result.contact = { ...result.contact };
    delete result.contact.email;
    delete result.contact.phone;
    delete result.contact.location;
  }
  return result;
}

// A local copy, so returning visitors see the page instantly
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
