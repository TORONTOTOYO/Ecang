export function isCloudinaryVideoUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" &&
      !url.port && !url.username && !url.password && /^\/[^/]+\/video\/upload\/.+/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function getProjectCover(project) {
  const cover = project.cover?.trim();
  if (cover) return cover;
  const videoUrl = project.reelUrl?.trim();
  if (!isCloudinaryVideoUrl(videoUrl)) return "";

  const url = new URL(videoUrl);
  url.pathname = url.pathname
    .replace(/(\/video\/upload\/)/i, "$1so_0/")
    .replace(/(\.[^./]+)?$/, ".jpg");
  return url.toString();
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = String(total % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}` : `${minutes}:${remainder}`;
}
