import { Panel, TextField, ImageField, ListEditor } from "../fields.jsx";
import { newId } from "../helpers.js";

export default function OffCameraSection({ content, update }) {
  const { offCamera } = content;

  return (
    <>
      <Panel title="Erica's skill" hint="Customize the optional center image and its description.">
        <ImageField label="Center image" value={offCamera.bagImage} onChange={(value) => update(["offCamera", "bagImage"], value)} />
        <TextField label="Center image description" value={offCamera.bagTitle} onChange={(value) => update(["offCamera", "bagTitle"], value)} />
      </Panel>
      <Panel title="Skills" hint="Add, reorder, or remove skills. Paste an image URL for each skill; its label appears when visitors hover, focus, or tap.">
        <ListEditor
          items={offCamera.items}
          onChange={(items) => update(["offCamera", "items"], items)}
          addLabel="Add skill"
          itemTitle={(item) => item.label}
          newItem={() => ({ id: newId("skill"), label: "", image: "", symbol: "✦" })}
        >
          {(item, patch) => (
            <>
              <TextField label="Skill label" value={item.label} onChange={(value) => patch({ label: value })} />
              <ImageField label="Skill image" value={item.image} onChange={(value) => patch({ image: value })} />
            </>
          )}
        </ListEditor>
      </Panel>
    </>
  );
}
