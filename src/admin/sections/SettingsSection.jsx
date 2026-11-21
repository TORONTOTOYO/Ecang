import { Panel, TextField } from "../fields.jsx";

export default function SettingsSection({ content, update, onReset }) {
  return (
    <>
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
