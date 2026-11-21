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

// Makes photos smaller before uploading (max 1600px wide, JPG), so the site stays fast.
export async function compressImage(file, maxWidth = 1600, quality = 0.85) {
  const canCompress = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!canCompress) return { blob: file, ext: file.type.split("/")[1] || "jpg" };

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  context.fillStyle = "#fff"; // so transparent PNGs do not turn black
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (blob && blob.size < file.size) return { blob, ext: "jpg" };
  return { blob: file, ext: file.type.split("/")[1] || "jpg" };
}
