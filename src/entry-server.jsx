import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { ContentProvider } from "./content/ContentContext.jsx";
import { getThemeMode } from "./theme.js";

export function renderPage(content, page) {
  const mode = getThemeMode(content.theme);
  const html = renderToString(
    <React.StrictMode>
      <ContentProvider initialContent={content}>
        <App initialPage={page} initialMode={mode} />
      </ContentProvider>
    </React.StrictMode>
  );
  return { html, mode };
}