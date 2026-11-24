import { useRef, useState } from "react";
import { formatDuration, getProjectCover, isCloudinaryVideoUrl } from "../content/reel.js";
import SafeImage from "./SafeImage.jsx";
import Gallery from "./Gallery.jsx";

export default function ProjectDetail({ project, featured }) {
  const images = project.images || [];
  const reelUrl = project.reelUrl?.trim();
  const hasReel = isCloudinaryVideoUrl(reelUrl);
  const [tab, setTab] = useState(hasReel ? "reel" : "photos");
  const [photo, setPhoto] = useState(null);
  const [duration, setDuration] = useState("");
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const videoRef = useRef(null);

  const selectTab = (next) => {
    if (next !== "reel") videoRef.current?.pause();
    setPhoto(null);
    setTab(next);
  };

  return (
    <div className="project-detail">
      <header className="project-detail-header">
        <span className="project-detail-label">{featured ? "Featured project" : "Project"}</span>
        <h2>{project.title}</h2>
        {project.subtitle && <p className="project-detail-subtitle">{project.subtitle}</p>}
        <div className="project-detail-meta">
          {project.role && <span className="pill">{project.role}</span>}
          {project.year && <span className="pill">{project.year}</span>}
        </div>
        {(hasReel || images.length > 0) && (
          <div className="project-detail-tabs" aria-label="Project media">
            {hasReel && <button type="button" className={tab === "reel" ? "active" : ""} aria-pressed={tab === "reel"} onClick={() => selectTab("reel")}>Video <span>1</span></button>}
            {images.length > 0 && <button type="button" className={tab === "photos" ? "active" : ""} aria-pressed={tab === "photos"} onClick={() => selectTab("photos")}>Photos <span>{images.length}</span></button>}
          </div>
        )}
      </header>

      {hasReel && (
        <section className="project-reel" hidden={tab !== "reel"} aria-label="Project video">
          <div className="project-reel-stage">
            <div className="project-reel-player">
              <video
                ref={videoRef}
                src={reelUrl}
                poster={getProjectCover(project) || undefined}
                controls={started}
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => setDuration(formatDuration(event.currentTarget.duration))}
                onDurationChange={(event) => setDuration(formatDuration(event.currentTarget.duration))}
                onPlay={() => setStarted(true)}
                onError={() => setFailed(true)}
              />
              {!started && !failed && (
                <button className="project-reel-play" type="button" aria-label="Play video" onClick={() => {
                  videoRef.current?.play().catch(() => setFailed(true));
                }}>▶</button>
              )}
              {duration && !started && <span className="project-reel-duration">{duration}</span>}
            </div>
          </div>
          {failed ? <p className="project-reel-error" role="alert">This video could not be played. Please check the Cloudinary video URL.</p> : (
            <div className="project-reel-caption">
              <h3>{project.title}</h3>
              <p>{[project.subtitle, duration].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        </section>
      )}

      {tab === "photos" && images.length > 0 && (
        <section className="project-photos" aria-label="Project photos">
          {photo === null ? (
            <div className="project-photo-grid">
              {images.map((image, index) => (
                <button type="button" key={index} onClick={() => setPhoto(index)} aria-label={`View ${image.caption || `photo ${index + 1}`}`}>
                  <SafeImage src={image.src} alt={image.caption || `${project.title} photo ${index + 1}`} index={index} />
                </button>
              ))}
            </div>
          ) : (
            <>
              <button type="button" className="project-photos-back" onClick={() => setPhoto(null)}>← All photos</button>
              <Gallery images={images} title={project.title} initialIndex={photo} />
            </>
          )}
        </section>
      )}

      <div className="project-detail-bottom">
        <div className="project-detail-description">
          {(project.description || []).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        {(project.role || project.year || project.location || duration) && (
          <dl className="project-detail-facts">
            {project.role && <><dt>Role</dt><dd>{project.role}</dd></>}
            {project.year && <><dt>Year</dt><dd>{project.year}</dd></>}
            {project.location && <><dt>Location</dt><dd>{project.location}</dd></>}
            {duration && <><dt>Runtime</dt><dd>{duration}</dd></>}
          </dl>
        )}
      </div>
    </div>
  );
}
