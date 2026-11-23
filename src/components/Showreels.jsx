import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "../content/ContentContext.jsx";

const FACEBOOK_HOSTS = new Set(["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "fb.watch"]);

function facebookEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (!FACEBOOK_HOSTS.has(host) && !host.endsWith(".facebook.com"))) return "";
    const embed = new URL("https://www.facebook.com/plugins/video.php");
    embed.searchParams.set("href", url.toString());
    embed.searchParams.set("show_text", "false");
    embed.searchParams.set("width", "500");
    return embed.toString();
  } catch {
    return "";
  }
}

export default function Showreels() {
  const { showreels } = useContent();
  const { items = [] } = showreels;
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const sectionRef = useRef(null);
  const active = items[activeIndex];
  const embedUrl = useMemo(() => facebookEmbedUrl(active?.facebookUrl), [active?.facebookUrl]);
  const intervalSeconds = Math.min(30, Math.max(4, Number(showreels.intervalSeconds) || 8));

  const selectReel = useCallback((index) => {
    setActiveIndex((index + items.length) % items.length);
  }, [items.length]);

  useEffect(() => setEmbedFailed(false), [active?.facebookUrl]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !items.length) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      setInView(visible);
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
    if (items.length < 2 || showreels.autoPlay === false || reducedMotion || !inView || !pageVisible) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, intervalSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, inView, intervalSeconds, items.length, pageVisible, reducedMotion, showreels.autoPlay]);

  if (!items.length) return null;

  const previous = items[(activeIndex - 1 + items.length) % items.length];
  const next = items[(activeIndex + 1) % items.length];

  return (
    <section className="showreels" ref={sectionRef} aria-label="Featured video reels">
      <div className={items.length > 1 ? "showreel-stage has-neighbors" : "showreel-stage"} aria-roledescription="carousel">
        {items.length > 1 && (
          <button type="button" className="showreel-side showreel-side-previous" key={previous.id || `previous-${activeIndex}`} onClick={() => selectReel(activeIndex - 1)} aria-label={`Show ${previous.title}`}>
            <span>{previous.title}</span>
          </button>
        )}

        <article className="showreel-current" key={active.id || activeIndex} aria-live="polite">
          <div className="showreel-media">
            {inView && embedUrl && !embedFailed ? (
              <iframe
                className="showreel-player"
                src={embedUrl}
                title={active.title || "Facebook showreel"}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                onError={() => setEmbedFailed(true)}
              />
            ) : (
              <div className="showreel-unavailable">
                <span>{!embedUrl ? "Add a valid Facebook video link in the admin." : !inView ? "Scroll to view this reel" : "The Facebook player could not load."}</span>
                {embedUrl && inView && <a href={active.facebookUrl} target="_blank" rel="noopener noreferrer">Watch on Facebook</a>}
              </div>
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