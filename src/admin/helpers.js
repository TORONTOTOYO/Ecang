// Returns a copy of obj with the value at "path" replaced.
//   setIn(content, ["profile", "name"], "Erica")
export function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[key] = setIn(obj?.[key], rest, value);
  return copy;
}

// A simple unique id for new projects
export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}`;
