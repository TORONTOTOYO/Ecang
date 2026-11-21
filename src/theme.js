// APPEARANCE: color palettes, fonts, and light/dark mode.
// The admin picks a palette and fonts; this file turns them into CSS variables.

// Each palette has a light and a dark ("cinema") version.
//   bg = page background       alt = tinted sections     text / soft = main and softer text
//   line = borders             accent = buttons, logo    accent2 = highlight color
//   surface = card background  panel = dark contact card
export const PALETTES = {
  dusk: {
    name: "Dusk gold",
    light: { bg: "#fff8ea", alt: "#f6e7c8", text: "#231c33", soft: "#6b6280", line: "#ecdfc3", accent: "#e9a53b", accent2: "#4a3d78", surface: "#fffdf7", panel: "#231c33" },
    dark: { bg: "#14111f", alt: "#1b1730", text: "#f5ecd9", soft: "#a9a0c0", line: "#2e2748", accent: "#e9a53b", accent2: "#b9a8f2", surface: "#1f1a35", panel: "#2a2346" },
  },
  rose: {
    name: "Rose",
    light: { bg: "#fff5f3", alt: "#fbe3de", text: "#2b1a1f", soft: "#7a5f66", line: "#f1d3cd", accent: "#d96c7a", accent2: "#8c2f4b", surface: "#fffafa", panel: "#2b1a1f" },
    dark: { bg: "#1a1114", alt: "#24171b", text: "#f8e9e6", soft: "#c4a4aa", line: "#3a2429", accent: "#e58593", accent2: "#f0a8b6", surface: "#2a1b20", panel: "#34222a" },
  },
  ocean: {
    name: "Ocean",
    light: { bg: "#f3f8fb", alt: "#dcebf3", text: "#10253a", soft: "#55697c", line: "#cfe0ea", accent: "#2a9d8f", accent2: "#1d4e89", surface: "#fbfdfe", panel: "#10253a" },
    dark: { bg: "#0b1520", alt: "#101e2d", text: "#e6f1f7", soft: "#94aabb", line: "#1f3347", accent: "#3dbdae", accent2: "#8cc4f5", surface: "#132336", panel: "#172b42" },
  },
  forest: {
    name: "Forest",
    light: { bg: "#f6f7f0", alt: "#e4e9d6", text: "#1c2a1e", soft: "#5d6b5b", line: "#d6dcc4", accent: "#c8963e", accent2: "#2f5d3a", surface: "#fbfcf7", panel: "#1c2a1e" },
    dark: { bg: "#101811", alt: "#162119", text: "#e9efe2", soft: "#9fb09b", line: "#26362a", accent: "#d9a954", accent2: "#9bd3a2", surface: "#1a261c", panel: "#1f3023" },
  },
  mono: {
    name: "Black and white",
    light: { bg: "#fafafa", alt: "#eeeeee", text: "#141414", soft: "#666666", line: "#dddddd", accent: "#141414", accent2: "#444444", surface: "#ffffff", panel: "#141414" },
    dark: { bg: "#0e0e0e", alt: "#161616", text: "#f2f2f2", soft: "#a0a0a0", line: "#2a2a2a", accent: "#f2f2f2", accent2: "#cfcfcf", surface: "#181818", panel: "#202020" },
  },
};

// Fonts the admin can choose from (loaded from Google Fonts only when picked).
export const FONT_OPTIONS = {
  heading: ["Poppins", "Montserrat", "Raleway", "Outfit", "Space Grotesk"],
  body: ["DM Sans", "Inter", "Nunito", "Work Sans"],
  accent: ["Lora", "Playfair Display", "Cormorant Garamond", "Fraunces"],
};
export const DEFAULT_FONTS = { heading: "Poppins", body: "DM Sans", accent: "Lora" }; // already loaded in index.html
const FALLBACKS = { heading: "system-ui, sans-serif", body: "system-ui, sans-serif", accent: "Georgia, serif" };
const FONT_WEIGHTS = { heading: "wght@500;600", body: "wght@400;500;600", accent: "ital,wght@0,500;0,600;1,500" };

const isHex = (value) => /^#[0-9a-f]{6}$/i.test(value || "");

// Dark text on light colors, white text on dark colors
function readableOn(hex) {
  if (!isHex(hex)) return "#231c33";
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#231c33" : "#ffffff";
}

// Dark mode follows the visitor's local time: 6pm through 5:59am.
export function getScheduledMode(date = new Date()) {
  const hour = date.getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

export function getThemeMode(theme, date = new Date()) {
  if (theme?.autoMode !== false) return getScheduledMode(date);
  return theme?.mode === "dark" ? "dark" : "light";
}

export function getNextModeChangeDelay(now = new Date()) {
  const next = new Date(now);
  next.setHours(getScheduledMode(now) === "dark" ? 6 : 18, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return Math.max(1000, next.getTime() - now.getTime());
}

// ---- Fonts ----
export function loadFont(role, name) {
  if (!name || name === DEFAULT_FONTS[role]) return;
  const id = `font-${role}-${name}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, "+")}:${FONT_WEIGHTS[role]}&display=swap`;
  document.head.appendChild(link);
}
export function loadThemeFonts(theme) {
  const fonts = { ...DEFAULT_FONTS, ...theme?.fonts };
  Object.keys(DEFAULT_FONTS).forEach((role) => loadFont(role, fonts[role]));
}

// ---- Turning the settings into CSS variables ----
export function themeVariables(theme, mode) {
  const palette = PALETTES[theme?.palette] ?? PALETTES.dusk;
  const c = { ...palette[mode === "dark" ? "dark" : "light"] };
  if (isHex(theme?.accent)) c.accent = theme.accent;
  if (isHex(theme?.highlight)) c.accent2 = theme.highlight;
  const fonts = { ...DEFAULT_FONTS, ...theme?.fonts };

  return {
    "--cream": c.bg,
    "--sand": c.alt,
    "--ink": c.text,
    "--mute": c.soft,
    "--line": c.line,
    "--amber": c.accent,
    "--dusk": c.accent2,
    "--surface": c.surface,
    "--panel": c.panel,
    "--on-accent": readableOn(c.accent),
    "--font-heading": `"${fonts.heading}", ${FALLBACKS.heading}`,
    "--font-body": `"${fonts.body}", ${FALLBACKS.body}`,
    "--font-accent": `"${fonts.accent}", ${FALLBACKS.accent}`,
  };
}

// Applies the look to the whole page.
export function applyTheme(theme, mode) {
  const root = document.documentElement;
  Object.entries(themeVariables(theme, mode)).forEach(([name, value]) => root.style.setProperty(name, value));
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
  loadThemeFonts(theme);
}