import { Panel, TextField, ToggleField } from "../fields.jsx";

export default function SettingsSection({ content, update, onReset }) {
  return (
    <>
      <Panel title="Website sections" hint="Turn sections on or off. Hidden sections are removed from the portfolio and its navigation.">
        <ToggleField label="Home introduction" checked={content.sections.home} onChange={(value) => update(["sections", "home"], value)} />
        <ToggleField label="About me" checked={content.sections.about} onChange={(value) => update(["sections", "about"], value)} />
        <ToggleField label="Projects" checked={content.sections.work} onChange={(value) => update(["sections", "work"], value)} />
        <ToggleField label="Erica's skill" checked={content.sections.offCamera} onChange={(value) => update(["sections", "offCamera"], value)} />
        <ToggleField label="Certifications" checked={content.sections.certifications} onChange={(value) => update(["sections", "certifications"], value)} />
        <ToggleField label="Contact" checked={content.sections.contact} onChange={(value) => update(["sections", "contact"], value)} />
      </Panel>
      <Panel title="Display">
        <TextField
          label="Show a carousel after this many cards"
          type="number"
          min="1"
          max="12"
          value={content.settings.carouselAfter}
          onChange={(v) => update(["settings", "carouselAfter"], Math.max(1, Number(v) || 3))}
          hint="Projects and certificates use a swipeable carousel when there are more cards than this."
        />
      </Panel>

      <Panel title="Start over" hint="Replaces everything in the editor with the original sample content. Nothing changes on the live site until you press Save.">
        <div>
          <button type="button" className="btn btn-sm btn-outline adm-danger-btn" onClick={onReset}>
            Load sample content
          </button>
        </div>
      </Panel>
    </>
  );
}
