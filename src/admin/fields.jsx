import { useEffect, useState } from "react";
import { uploadImage } from "./firebaseAdmin.js";

// Small form pieces used by every admin section.

export function Panel({ title, hint, children }) {
  return (
    <section className="adm-panel">
      <h2>{title}</h2>
      {hint && <p className="adm-hint">{hint}</p>}
      <div className="adm-stack">{children}</div>
    </section>
  );
}

export function TextField({ label, value, onChange, hint, type = "text", ...rest }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function TextArea({ label, value, onChange, hint, rows = 4 }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

// A list of words typed with commas, saved as an array.
export function TagsField({ label, value = [], onChange, hint }) {
  const joined = value.join(", ");
  const [text, setText] = useState(joined);
  useEffect(() => setText(joined), [joined]);

  const commit = () => onChange(text.split(",").map((item) => item.trim()).filter(Boolean));

  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <input value={text} onChange={(e) => setText(e.target.value)} onBlur={commit} />
      <small>{hint || "Separate each item with a comma."}</small>
    </label>
  );
}

// Image link + upload button + preview.
export function ImageField({ label, value, onChange, folder }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(
        err.code === "storage/unauthorized"
          ? "Upload not allowed. Check the Storage rules and that you are logged in as the admin."
          : "Upload failed. If Firebase Storage is not set up yet, paste an image link instead."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image">
        {value ? (
          <img key={value} className="adm-thumb" src={value} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        ) : (
          <div className="adm-thumb adm-thumb-empty">No photo</div>
        )}
        <div className="adm-image-controls">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image link, or upload a photo" />
          <div className="adm-row">
            <label className="btn btn-sm btn-outline">
              {busy ? "Uploading..." : "Upload photo"}
              <input type="file" accept="image/*" hidden onChange={handleFile} disabled={busy} />
            </label>
            {value && (
              <button type="button" className="adm-link" onClick={() => onChange("")}>Remove photo</button>
            )}
          </div>
        </div>
      </div>
      {error && <small className="adm-error">{error}</small>}
    </div>
  );
}

// A list of text boxes (for example, paragraphs or bullet points).
export function StringListEditor({ label, items = [], onChange, addLabel = "Add", rows = 3 }) {
  const change = (i, text) => onChange(items.map((item, k) => (k === i ? text : item)));
  const remove = (i) => onChange(items.filter((_, k) => k !== i));

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      {items.map((text, i) => (
        <div className="adm-string" key={i}>
          <textarea rows={rows} value={text} onChange={(e) => change(i, e.target.value)} />
          <button type="button" className="adm-danger" onClick={() => remove(i)} aria-label="Delete">×</button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => onChange([...items, ""])}>{addLabel}</button>
      </div>
    </div>
  );
}

// A list of items the admin can add, delete, reorder, and edit.
//   <ListEditor items={...} onChange={...} newItem={() => ({...})} itemTitle={(item) => item.title}>
//     {(item, patch) => <TextField value={item.title} onChange={(v) => patch({ title: v })} />}
//   </ListEditor>
export function ListEditor({ items = [], onChange, newItem, addLabel = "Add", itemTitle, children }) {
  const [open, setOpen] = useState(null); // which item is expanded

  const patchAt = (i) => (changes) =>
    onChange(items.map((item, k) => (k === i ? { ...item, ...changes } : item)));

  const add = () => {
    onChange([...items, newItem()]);
    setOpen(items.length);
  };

  const remove = (i) => {
    if (!window.confirm(`Delete "${itemTitle(items[i], i)}"?`)) return;
    onChange(items.filter((_, k) => k !== i));
    setOpen(null);
  };

  const move = (i, step) => {
    const j = i + step;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (open === i) setOpen(j);
    else if (open === j) setOpen(i);
  };

  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">Nothing here yet.</p>}

      {items.map((item, i) => (
        <div className={open === i ? "adm-item open" : "adm-item"} key={i}>
          <div className="adm-item-head">
            <button type="button" className="adm-item-toggle" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span aria-hidden="true">{open === i ? "▾" : "▸"}</span> {itemTitle(item, i) || "Untitled"}
            </button>
            <div className="adm-item-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="adm-danger" onClick={() => remove(i)}>Delete</button>
            </div>
          </div>
          {open === i && <div className="adm-item-body adm-stack">{children(item, patchAt(i), i)}</div>}
        </div>
      ))}

      <div>
        <button type="button" className="btn btn-sm btn-outline" onClick={add}>{addLabel}</button>
      </div>
    </div>
  );
}
