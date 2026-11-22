import { Panel, TextField, TextArea, TagsField, ListEditor, StringListEditor } from "../fields.jsx";

export default function CvSection({ content, update }) {
  const { cv } = content;

  return (
    <>
      <Panel title="CV basics" hint="Add an email address to show on the public CV. This is separate from the private contact-form recipient.">
        <TextField label="Email for CV" type="email" value={cv.email} onChange={(v) => update(["cv", "email"], v)} />
        <TextField label="Headline" value={cv.headline} onChange={(v) => update(["cv", "headline"], v)} />
        <TextArea label="Professional summary" rows={5} value={cv.summary} onChange={(v) => update(["cv", "summary"], v)} />
        <TextField label="PDF file name" value={cv.fileName} onChange={(v) => update(["cv", "fileName"], v)} hint="The name of the PDF when it is saved, without .pdf" />
      </Panel>

      <Panel title="Experience">
        <ListEditor
          items={cv.experience}
          onChange={(v) => update(["cv", "experience"], v)}
          addLabel="Add experience"
          itemTitle={(item) => [item.role, item.org].filter(Boolean).join(" at ")}
          newItem={() => ({ role: "", org: "", location: "", period: "", bullets: [""] })}
        >
          {(job, patch) => (
            <>
              <TextField label="Job title or role" value={job.role} onChange={(v) => patch({ role: v })} />
              <TextField label="Project or organization" value={job.org} onChange={(v) => patch({ org: v })} />
              <div className="adm-grid-2">
                <TextField label="Location" value={job.location} onChange={(v) => patch({ location: v })} />
                <TextField label="Dates" value={job.period} onChange={(v) => patch({ period: v })} />
              </div>
              <StringListEditor
                label="What you did (bullet points)"
                addLabel="Add bullet point"
                rows={2}
                items={job.bullets}
                onChange={(v) => patch({ bullets: v })}
              />
            </>
          )}
        </ListEditor>
      </Panel>

      <Panel title="Skills and languages">
        <ListEditor
          items={cv.skills}
          onChange={(v) => update(["cv", "skills"], v)}
          addLabel="Add skill group"
          itemTitle={(item) => item.group}
          newItem={() => ({ group: "", items: [] })}
        >
          {(skill, patch) => (
            <>
              <TextField label="Group name" value={skill.group} onChange={(v) => patch({ group: v })} />
              <TagsField label="Skills" value={skill.items} onChange={(v) => patch({ items: v })} />
            </>
          )}
        </ListEditor>
        <TagsField label="Languages" value={cv.languages} onChange={(v) => update(["cv", "languages"], v)} />
      </Panel>
    </>
  );
}
