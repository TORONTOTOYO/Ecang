import { Panel, TextField, ToggleField } from "../fields.jsx";
import { SECTION_DEFINITIONS } from "../../content/sections.js";

export default function SettingsSection({ content, update, onReset }) {
  const moveSection = (index, step) => {
    const next = [...content.sectionOrder];
    const target = index + step;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(["sectionOrder"], next);
  };

  return (
    <>
      <Panel title="Sections" hint="Turn sections on or off and use the arrows to change their order. Hidden sections are removed from the portfolio and its navigation.">
        {content.sectionOrder.map((id, index) => {
          const section = SECTION_DEFINITIONS.find((item) => item.id === id);
          return (
            <div className="adm-section-order" key={id}>
              <ToggleField label={section.label} checked={content.sections[id]} onChange={(value) => update(["sections", id], value)} />
              <div className="adm-item-tools">
                <button type="button" onClick={() => moveSection(index, -1)} disabled={index === 0} aria-label={`Move ${section.label} up`}>↑</button>
                <button type="button" onClick={() => moveSection(index, 1)} disabled={index === content.sectionOrder.length - 1} aria-label={`Move ${section.label} down`}>↓</button>
              </div>
            </div>
          );
        })}
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
