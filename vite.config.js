import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { port: 5173, open: true },

  build: {
    sourcemap: false, // do not publish source maps (they would reveal the original files)
    minify: "esbuild", // shrink the code and rename variables, so it is hard to read
  },

  // In the published build only: remove console messages and code comments
  esbuild: mode === "production" ? { drop: ["console", "debugger"], legalComments: "none" } : {},
}));
