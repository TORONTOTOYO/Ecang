import { createContext, useContext, useEffect, useState } from "react";
import { isFirebaseConfigured } from "../firebase/app.js";
import { defaultContent } from "./defaultContent.js";
import { fetchContent } from "./contentService.js";
import { readCache, writeCache, normalize } from "./contentUtils.js";

// Loads the site content once and shares it with every component.
//   const { profile, projects } = useContent();
const ContentContext = createContext({ content: defaultContent, ready: true });

export function ContentProvider({ children, initialContent }) {
  const [state, setState] = useState(() => {
    const snapshot = initialContent ? normalize(initialContent) : null;
    const cached = snapshot ? null : readCache();
    return {
      content: snapshot || (cached ? normalize(cached) : defaultContent),
      ready: Boolean(snapshot) || !isFirebaseConfigured || Boolean(cached), // returning visitors see the page right away
    };
  });

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;

    fetchContent()
      .then((content) => {
        if (cancelled) return;
        writeCache(content);
        setState({ content, ready: true });
      })
      .catch((error) => {
        console.error("Could not load content from Firebase. Showing saved or default content.", error);
        if (!cancelled) setState((current) => ({ ...current, ready: true }));
      });

    return () => { cancelled = true; };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext).content;
export const useContentReady = () => useContext(ContentContext).ready;
