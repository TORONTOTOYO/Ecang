import { Panel, TextField, TextArea, ImageField, ListEditor } from "../fields.jsx";

export default function HomeSection({ content, update }) {
  const { profile, about, background } = content;

  return (
    <>
      <Panel title="Top of the page" hint="The greeting, your role, and your portrait.">
        <TextField label="Your name" value={profile.name} onChange={(v) => update(["profile", "name"], v)} />
        <TextField label="Role" value={profile.role} onChange={(v) => update(["profile", "role"], v)} />
        <TextArea label="Short intro" rows={3} value={profile.intro} onChange={(v) => update(["profile", "intro"], v)} />
        <ImageField label="Portrait" folder="portrait" value={profile.portrait} onChange={(v) => update(["profile", "portrait"], v)} />
      </Panel>

      <Panel title="Who am I?" hint="A few sentences about you.">
        <TextField label="Heading" value={about.title} onChange={(v) => update(["about", "title"], v)} />
        <TextArea label="Text" rows={5} value={about.text} onChange={(v) => update(["about", "text"], v)} />
      </Panel>

      <Panel title="Education" hint="Shown as the timeline in My background, and in your CV.">
        <ListEditor
          items={background}
          onChange={(v) => update(["background"], v)}
          newItem={() => ({ title: "", place: "", year: "" })}
          addLabel="Add education"
          itemTitle={(item) => item.title}
        >
          {(item, patch) => (
            <>
              <TextField label="Degree or level" value={item.title} onChange={(v) => patch({ title: v })} />
              <TextField label="School and place" value={item.place} onChange={(v) => patch({ place: v })} />
              <TextField label="Year" value={item.year} onChange={(v) => patch({ year: v })} />
            </>
          )}
        </ListEditor>
      </Panel>
    </>
  );
}
