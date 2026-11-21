import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/app.js";
import { defaultContent } from "./defaultContent.js";
import { normalize } from "./contentUtils.js";

// The website only READS content, from one Firestore document: content/site
// (Saving is done by the admin panel, see src/admin/firebaseAdmin.js)
const contentRef = app ? doc(getFirestore(app), "content", "site") : null;

export async function fetchContent() {
  if (!contentRef) return defaultContent;
  const snapshot = await getDoc(contentRef);
  return snapshot.exists() ? normalize(snapshot.data()) : defaultContent;
}
