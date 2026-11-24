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

  try {
    const url = new URL(videoUrl);
    // Insert so_0 transformation after /video/upload/
    // This extracts the first frame of the video
    const pathname = url.pathname;
    const uploadIndex = pathname.search(/\/video\/upload\//i);
    
    if (uploadIndex === -1) return "";
    
    const beforeUpload = pathname.substring(0, uploadIndex + "/video/upload/".length);
    const afterUpload = pathname.substring(uploadIndex + "/video/upload/".length);
    
    // Replace video extension with .jpg and add so_0 transformation
    const newPath = beforeUpload + "so_0/" + afterUpload.replace(/\.[^.]+$/, ".jpg");
    url.pathname = newPath;
    
    return url.toString();
  } catch {
    return "";
  }
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = String(total % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}` : `${minutes}:${remainder}`;
}
