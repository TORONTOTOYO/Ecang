import { Panel, TextField, TextArea, ToggleField, ListEditor } from "../fields.jsx";
import { newId } from "../helpers.js";

export default function ShowreelsSection({ content, update }) {
  const { showreels } = content;

  return (
    <>
      <Panel title="Showreels heading">
        <TextField label="Title" value={showreels.title} onChange={(value) => update(["showreels", "title"], value)} />
        <TextArea label="Description" rows={2} value={showreels.blurb} onChange={(value) => update(["showreels", "blurb"], value)} />
        <ToggleField
          label="Automatically advance reels"
          checked={showreels.autoPlay !== false}
          onChange={(value) => update(["showreels", "autoPlay"], value)}
          hint="Advances while this section is visible and stops when visitors scroll away."
        />
        <TextField
          label="Seconds between reels"
          type="number"
          min="4"
          max="30"
          value={showreels.intervalSeconds || 8}
          onChange={(value) => update(["showreels", "intervalSeconds"], Math.min(30, Math.max(4, Number(value) || 8)))}
        />
      </Panel>

      <Panel title="Reels" hint="Add a public Facebook video or reel link. Private or restricted videos cannot be embedded.">
        <ListEditor
          items={showreels.items}
          onChange={(items) => update(["showreels", "items"], items)}
          addLabel="Add reel"
          itemTitle={(item) => item.title}
          newItem={() => ({ id: newId("reel"), title: "", description: "", duration: "", facebookUrl: "" })}
        >
          {(reel, patch) => (
            <>
              <TextField label="Reel title" value={reel.title} onChange={(value) => patch({ title: value })} />
              <TextArea label="Short description" rows={2} value={reel.description} onChange={(value) => patch({ description: value })} />
              <div className="adm-grid-2">
                <TextField label="Duration (optional)" value={reel.duration} onChange={(value) => patch({ duration: value })} placeholder="2:14" />
                <TextField
                  label="Facebook video or reel URL"
                  type="url"
                  value={reel.facebookUrl}
                  onChange={(value) => patch({ facebookUrl: value })}
                  placeholder="https://www.facebook.com/..."
                />
              </div>
            </>
          )}
        </ListEditor>
      </Panel>
    </>
  );
}