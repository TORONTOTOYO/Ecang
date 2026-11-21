import { Panel, TextField, TextArea } from "../fields.jsx";

export default function ContactSection({ content, update }) {
  const { contact } = content;

  return (
    <Panel title="Contact" hint="Shown in the Let's work together section and at the top of your CV.">
      <TextField label="Heading" value={contact.title} onChange={(v) => update(["contact", "title"], v)} />
      <TextArea label="Message" rows={3} value={contact.text} onChange={(v) => update(["contact", "text"], v)} />
      <TextField label="Email" type="email" value={contact.email} onChange={(v) => update(["contact", "email"], v)} />
      <TextField label="Phone" value={contact.phone} onChange={(v) => update(["contact", "phone"], v)} />
      <TextField label="Location" value={contact.location} onChange={(v) => update(["contact", "location"], v)} />
    </Panel>
  );
}
