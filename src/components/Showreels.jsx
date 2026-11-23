import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "../content/ContentContext.jsx";

const FACEBOOK_HOSTS = new Set(["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "fb.watch"]);

function getReelSource(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return null;

    if (FACEBOOK_HOSTS.has(host) || host.endsWith(".facebook.com")) {
      const embed = new URL("https://www.facebook.com/plugins/video.php");
      embed.searchParams.set("href", url.toString());
      embed.searchParams.set("show_text", "false");
      embed.searchParams.set("width", "500");
      return { type: "facebook", src: embed.toString(), openUrl: url.toString() };
    }

    if (host === "res.cloudinary.com" && /\/video\/upload\//i.test(url.pathname)) {
      return { type: "video", src: url.toString(), openUrl: url.toString() };
    }

    return null;
  } catch {
    return null;
  }
}

export default function Showreels() {
  const { showreels } = useContent();
  const { items = [] } = showreels;
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [mediaInteracted, setMediaInteracted] = useState(false);
  const sectionRef = useRef(null);
  const pointerStartX = useRef(null);
  const active = items[activeIndex];
  const rawVideoUrl = active?.videoUrl || active?.facebookUrl;
  const media = useMemo(() => getReelSource(rawVideoUrl), [rawVideoUrl]);
  const intervalSeconds = Math.min(30, Math.max(4, Number(showreels.intervalSeconds) || 8));

  const selectReel = useCallback((index) => {
    setActiveIndex((index + items.length) % items.length);
    setMediaPlaying(false);
    setMediaInteracted(false);
  }, [items.length]);

  const handlePointerDown = (event) => {
    if (event.target.closest("button, a, iframe, video")) return;
    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) >= 48) selectReel(activeIndex + (distance < 0 ? 1 : -1));
  };

  const clearPointer = () => { pointerStartX.current = null; };

  useEffect(() => {
    setMediaFailed(false);
    setMediaPlaying(false);
  }, [media?.src]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !items.length) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      setInView(visible);
      if (!visible) {
        setMediaPlaying(false);
        setMediaInteracted(false);
      }
    }, { threshold: [0, 0.15] });
    observer.observe(section);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.("change", updatePreference);
    return () => preference.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (items.length < 2 || showreels.autoPlay === false || reducedMotion || !inView || !pageVisible || mediaPlaying || mediaInteracted) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, intervalSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, inView, intervalSeconds, items.length, mediaInteracted, mediaPlaying, pageVisible, reducedMotion, showreels.autoPlay]);

  if (!items.length) return null;

  const previous = items[(activeIndex - 1 + items.length) % items.length];
  const next = items[(activeIndex + 1) % items.length];

  return (
    <section className="showreels" ref={sectionRef} aria-label="Featured video reels">
      <div
        className={items.length > 1 ? "showreel-stage has-neighbors" : "showreel-stage"}
        aria-roledescription="carousel"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearPointer}
      >
        {items.length > 1 && (
          <button type="button" className="showreel-side showreel-side-previous" key={previous.id || `previous-${activeIndex}`} onClick={() => selectReel(activeIndex - 1)} aria-label={`Show ${previous.title}`}>
            <span>{previous.title}</span>
          </button>
        )}

        <article className="showreel-current" key={active.id || activeIndex} aria-live="polite">
          <div className="showreel-media">
            {inView && media && !mediaFailed ? (
              media.type === "facebook" ? (
                <iframe
                  className="showreel-player"
                  src={media.src}
                  title={active.title || "Facebook showreel"}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onFocus={() => setMediaInteracted(true)}
                  onPointerDown={() => setMediaInteracted(true)}
                  onError={() => setMediaFailed(true)}
                />
              ) : (
                <video
                  className="showreel-player"
                  src={media.src}
                  title={active.title || "Showreel"}
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => { setMediaPlaying(true); setMediaInteracted(true); }}
                  onPause={() => { setMediaPlaying(false); setMediaInteracted(true); }}
                  onEnded={() => { setMediaPlaying(false); setMediaInteracted(false); }}
                  onError={() => setMediaFailed(true)}
                />
              )
            ) : (
              <div className="showreel-unavailable" aria-hidden="true" />
            )}
            <span className="showreel-count">Reel {activeIndex + 1} of {items.length}</span>
            {active.duration && <span className="showreel-duration">{active.duration}</span>}
          </div>
          <div className="showreel-caption">
            <h3>{active.title}</h3>
            {active.description && <p>{active.description}</p>}
          </div>
        </article>

        {items.length > 1 && (
          <button type="button" className="showreel-side showreel-side-next" key={next.id || `next-${activeIndex}`} onClick={() => selectReel(activeIndex + 1)} aria-label={`Show ${next.title}`}>
            <span>{next.title}</span>
          </button>
        )}
      </div>

      {items.length > 1 && (
        <div className="showreel-controls" aria-label="Showreel controls">
          <div className="showreel-dots">
            {items.map((item, index) => (
              <button
                key={item.id || index}
                className={index === activeIndex ? "showreel-dot active" : "showreel-dot"}
                onClick={() => selectReel(index)}
                aria-label={`Show reel ${index + 1}: ${item.title}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}