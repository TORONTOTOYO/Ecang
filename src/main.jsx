import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import { ContentProvider } from "./content/ContentContext.jsx";
import "./styles/index.css";

const root = document.getElementById("root");
const bootNode = document.getElementById("prerender-data");
let boot = null;

try {
  boot = bootNode ? JSON.parse(bootNode.textContent) : null;
} catch {
  boot = null;
}

function routeFromLocation() {
  if (window.location.hash === "#/admin") return "admin";
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/admin") return "admin";
  return "home";
}

const canHydrate = Boolean(boot && boot.page === routeFromLocation());
const app = (
  <React.StrictMode>
    <ContentProvider initialContent={canHydrate ? boot.content : undefined}>
      <App initialPage={canHydrate ? boot.page : undefined} initialMode={canHydrate ? boot.mode : undefined} />
    </ContentProvider>
  </React.StrictMode>
);

if (canHydrate) hydrateRoot(root, app);
else createRoot(root).render(app);
