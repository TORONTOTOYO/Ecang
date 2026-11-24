import { Panel, TextField, TextArea, ImageField, ListEditor, StringListEditor } from "../fields.jsx";
import { newId } from "../helpers.js";
import { isCloudinaryVideoUrl } from "../../content/reel.js";

export default function ProjectsSection({ content, update }) {
  const { work, projects } = content;

  return (
    <>
      <Panel title="Featured work heading">
        <TextField label="Title" value={work.title} onChange={(v) => update(["work", "title"], v)} />
        <TextArea label="Short line under the title" rows={2} value={work.blurb} onChange={(v) => update(["work", "blurb"], v)} />
      </Panel>

      {content.showreels?.items?.length > 0 && (
        <Panel title="Previous videos" hint="Existing videos are not assigned automatically. Copy a Cloudinary video URL into the appropriate project below. Facebook links are no longer supported.">
          {content.showreels.items.map((reel, index) => (
            <p key={reel.id || index}>{reel.title || `Video ${index + 1}`}: {reel.videoUrl || reel.facebookUrl || "No URL"}</p>
          ))}
        </Panel>
      )}

      <Panel title="Projects" hint="Each project can have one Cloudinary video, plus photos and details.">
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
            location: "",
            reelUrl: "",
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
              <TextField label="Location (optional)" value={project.location} onChange={(v) => patch({ location: v })} />
              <TextField
                label="Video URL (Cloudinary only)"
                type="url"
                value={project.reelUrl}
                onChange={(v) => patch({ reelUrl: v })}
                placeholder="https://res.cloudinary.com/.../video/upload/..."
                hint={project.reelUrl && !isCloudinaryVideoUrl(project.reelUrl.trim())
                  ? "Enter a valid HTTPS Cloudinary video delivery URL before saving."
                  : "Paste one public Cloudinary video delivery URL. Duration is detected automatically."}
                aria-invalid={Boolean(project.reelUrl && !isCloudinaryVideoUrl(project.reelUrl.trim()))}
              />
              <TextArea label="Short summary (shown on the card)" rows={2} value={project.summary} onChange={(v) => patch({ summary: v })} />
              <StringListEditor
                label="Description (shown after See more)"
                addLabel="Add paragraph"
                items={project.description}
                onChange={(v) => patch({ description: v })}
              />
              <ImageField label="Cover photo (card image)" value={project.cover} onChange={(v) => patch({ cover: v })} />
              <p className="adm-hint">If no cover photo is set, the first frame of the Cloudinary video is used.</p>

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
                      <ImageField label="Photo" value={image.src} onChange={(v) => patchImage({ src: v })} />
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
