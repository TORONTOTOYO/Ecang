import { Panel, TextField, TextArea, ImageField, ListEditor } from "../fields.jsx";

export default function CertificationsSection({ content, update }) {
  const { certifications } = content;

  return (
    <>
      <Panel title="Certifications heading">
        <TextField label="Title" value={certifications.title} onChange={(v) => update(["certifications", "title"], v)} />
        <TextArea label="Short line under the title" rows={2} value={certifications.blurb} onChange={(v) => update(["certifications", "blurb"], v)} />
      </Panel>

      <Panel title="Certificates" hint="Also listed in your CV.">
        <ListEditor
          items={certifications.items}
          onChange={(v) => update(["certifications", "items"], v)}
          addLabel="Add certificate"
          itemTitle={(item) => item.title}
          newItem={() => ({ title: "", issuer: "", date: "", image: "" })}
        >
          {(item, patch) => (
            <>
              <TextField label="Certificate title" value={item.title} onChange={(v) => patch({ title: v })} />
              <TextField label="Issued by" value={item.issuer} onChange={(v) => patch({ issuer: v })} />
              <TextField label="Date" value={item.date} onChange={(v) => patch({ date: v })} />
              <ImageField label="Photo or scan of the certificate" value={item.image} onChange={(v) => patch({ image: v })} />
            </>
          )}
        </ListEditor>
      </Panel>
    </>
  );
}
