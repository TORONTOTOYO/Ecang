import { Panel, TextField, TextArea } from "../fields.jsx";

export default function ContactSection({ content, update }) {
  const { contact } = content;

  return (
    <Panel title="Contact" hint="Shown in the Let's work together section.">
      <TextField label="Heading" value={contact.title} onChange={(v) => update(["contact", "title"], v)} />
      <TextArea label="Message" rows={3} value={contact.text} onChange={(v) => update(["contact", "text"], v)} />
    </Panel>
  );
}
