import { Panel, TextField, TextArea, ImageField, ListEditor, StringListEditor } from "../fields.jsx";
import { newId } from "../helpers.js";

export default function ProjectsSection({ content, update }) {
  const { work, projects } = content;

  return (
    <>
      <Panel title="Featured work heading">
        <TextField label="Title" value={work.title} onChange={(v) => update(["work", "title"], v)} />
        <TextArea label="Short line under the title" rows={2} value={work.blurb} onChange={(v) => update(["work", "blurb"], v)} />
      </Panel>

      <Panel title="Projects" hint="Each project becomes a card. Visitors press See more to open its photos and details.">
        <ListEditor
          items={projects}
          onChange={(v) => update(["projects"], v)}
          addLabel="Add project"
          itemTitle={(item) => item.title}
          newItem={() => ({
            id: newId("project"),
            title: "New project",
            subtitle: "",
            role: "",
            year: "",
            summary: "",
            description: [""],
            cover: "",
            images: [],
          })}
        >
          {(project, patch) => (
            <>
              <TextField label="Title" value={project.title} onChange={(v) => patch({ title: v })} />
              <TextField label="Subtitle" value={project.subtitle} onChange={(v) => patch({ subtitle: v })} />
              <div className="adm-grid-2">
                <TextField label="Your role" value={project.role} onChange={(v) => patch({ role: v })} />
                <TextField label="Year" value={project.year} onChange={(v) => patch({ year: v })} />
              </div>
              <TextArea label="Short summary (shown on the card)" rows={2} value={project.summary} onChange={(v) => patch({ summary: v })} />
              <StringListEditor
                label="Description (shown after See more)"
                addLabel="Add paragraph"
                items={project.description}
                onChange={(v) => patch({ description: v })}
              />
              <ImageField label="Cover photo (card image)" folder="projects" value={project.cover} onChange={(v) => patch({ cover: v })} />

              <div className="adm-field">
                <span className="adm-label">Gallery photos</span>
                <ListEditor
                  items={project.images}
                  onChange={(v) => patch({ images: v })}
                  addLabel="Add photo"
                  itemTitle={(item, i) => item.caption || `Photo ${i + 1}`}
                  newItem={() => ({ src: "", caption: "" })}
                >
                  {(image, patchImage) => (
                    <>
                      <ImageField label="Photo" folder="projects" value={image.src} onChange={(v) => patchImage({ src: v })} />
                      <TextField label="Caption" value={image.caption} onChange={(v) => patchImage({ caption: v })} />
                    </>
                  )}
                </ListEditor>
              </div>
            </>
          )}
        </ListEditor>
      </Panel>
    </>
  );
}
