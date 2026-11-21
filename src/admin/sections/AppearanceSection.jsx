import { useEffect } from "react";
import { Panel, TextField, ImageField, SelectField, ColorField, ToggleField } from "../fields.jsx";
import { PALETTES, FONT_OPTIONS, DEFAULT_FONTS, themeVariables, loadThemeFonts, getThemeMode } from "../../theme.js";

export default function AppearanceSection({ content, update }) {
  const { theme } = content;
  const fonts = { ...DEFAULT_FONTS, ...theme.fonts };
  const palette = PALETTES[theme.palette] ?? PALETTES.dusk;
  const mode = getThemeMode(theme);

  // Load the chosen fonts so the preview can show them
  useEffect(() => loadThemeFonts(theme), [fonts.heading, fonts.body, fonts.accent]); // eslint-disable-line

  return (
    <>
      <Panel title="Preview" hint="This is how your choices will look. Press Save changes to publish them.">
        <div className="adm-preview" style={themeVariables(theme, mode)}>
          <h3>Hello, I'm <em>Erica.</em></h3>
          <p className="pv-role">Actress and communication graduate</p>
          <p className="pv-text">Stories brought to life, on screen and behind the scenes.</p>
          <div className="adm-row">
            <span className="pv-btn">See my work</span>
            <span className="pv-btn pv-outline">CV</span>
            <span className="pv-pill">Pill label</span>
          </div>
        </div>
      </Panel>

      <Panel title="Day and night">
        <ToggleField
          label="Automatic day/night mode"
          checked={theme.autoMode !== false}
          onChange={(value) => update(["theme", "autoMode"], value)}
          hint="Day mode is 6am–6pm; night mode is 6pm–6am, based on the visitor's local time."
        />
        {theme.autoMode === false && (
          <div className="adm-field">
            <span className="adm-label">Fixed mode while automatic switching is off</span>
            <div className="adm-segment" role="group" aria-label="Fixed color mode">
              {[ ["light", "Light"], ["dark", "Dark"] ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={mode === value ? "active" : ""}
                  onClick={() => update(["theme", "mode"], value)}
                  aria-pressed={mode === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Colors" hint="Pick a palette. Day mode runs from 6am to 6pm; night mode runs from 6pm to 6am, using local time.">
        <div className="adm-swatches">
          {Object.entries(PALETTES).map(([id, p]) => (
            <button
              key={id}
              type="button"
              className={theme.palette === id ? "adm-swatch active" : "adm-swatch"}
              onClick={() => update(["theme", "palette"], id)}
              aria-pressed={theme.palette === id}
            >
              <span className="adm-dots" aria-hidden="true">
                {[p.light.bg, p.light.accent, p.light.accent2, p.dark.bg].map((color, i) => (
                  <i key={i} style={{ background: color }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        <div className="adm-grid-2">
          <ColorField label="Accent color (buttons, logo)" value={theme.accent} fallback={palette[mode].accent} onChange={(v) => update(["theme", "accent"], v)} />
          <ColorField label="Highlight color (your name, links)" value={theme.highlight} fallback={palette[mode].accent2} onChange={(v) => update(["theme", "highlight"], v)} />
        </div>
        <small className="adm-note">Custom colors apply to both light and dark mode, so pick ones that are readable on both.</small>
      </Panel>

      <Panel title="Logo and loading">
        <TextField
          label="Logo text"
          value={theme.logoText}
          maxLength={3}
          onChange={(value) => update(["theme", "logoText"], value)}
          hint="Used when no logo image is set. Keep it to 1–3 characters."
        />
        <ImageField
          label="Logo image URL (optional)"
          value={theme.logoImage}
          onChange={(value) => update(["theme", "logoImage"], value)}
        />
        <SelectField
          label="Loading spinner"
          value={theme.loaderStyle || "ring"}
          options={[
            { value: "ring", label: "Rotating ring" },
            { value: "dots", label: "Animated dots" },
            { value: "pulse", label: "Pulsing logo" },
          ]}
          onChange={(value) => update(["theme", "loaderStyle"], value)}
        />
      </Panel>

      <Panel title="Fonts" hint="Fonts are loaded from Google Fonts when you pick them.">
        <SelectField label="Headings and buttons" value={fonts.heading} options={FONT_OPTIONS.heading} onChange={(v) => update(["theme", "fonts", "heading"], v)} />
        <SelectField label="Body text" value={fonts.body} options={FONT_OPTIONS.body} onChange={(v) => update(["theme", "fonts", "body"], v)} />
        <SelectField label="Your name and project subtitles (serif)" value={fonts.accent} options={FONT_OPTIONS.accent} onChange={(v) => update(["theme", "fonts", "accent"], v)} />
      </Panel>
    </>
  );
}