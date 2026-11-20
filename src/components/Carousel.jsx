import { useRef, useState, useEffect, useCallback } from "react";

// Swipeable carousel. Children become slides.
// Shows 3 per view on desktop, 2 on tablet, and 1 on phones (see cards.css and carousel.css).
export default function Carousel({ label, children }) {
  const trackRef = useRef(null);
  const frame = useRef(0); // pending animation frame, so we measure at most once per frame
  const [state, setState] = useState({ index: 0, max: 0, step: 1 });

  // Works out which slide is showing. Only updates state when something changed,
  // so scrolling does not re-render the carousel on every pixel.
  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t || !t.children.length) return;
    const first = t.children[0];
    const step = t.children[1] ? t.children[1].offsetLeft - first.offsetLeft : first.offsetWidth;
    const visible = Math.max(1, Math.round(t.clientWidth / step));
    const max = Math.max(0, t.children.length - visible);
    const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    const index = atEnd ? max : Math.min(max, Math.round(t.scrollLeft / step));
    setState((prev) => (prev.index === index && prev.max === max && prev.step === step ? prev : { index, max, step }));
  }, []);

  const onScroll = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      measure();
    });
  }, [measure]);

  // Measure on load, and again whenever the carousel changes size (rotating a phone, resizing a window)
  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  const goTo = (i) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    trackRef.current.scrollTo({ left: i * state.step, behavior: reduce ? "auto" : "smooth" });
  };

  const { index, max } = state;

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel-track" ref={trackRef} onScroll={onScroll}>{children}</div>
      <div className="carousel-controls">
        <button className="arrow-btn" onClick={() => goTo(Math.max(0, index - 1))} disabled={index <= 0} aria-label="Previous">
          ‹
        </button>
        <div className="dots">
          {Array.from({ length: max + 1 }, (_, i) => (
            <button
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button className="arrow-btn" onClick={() => goTo(Math.min(max, index + 1))} disabled={index >= max} aria-label="Next">
          ›
        </button>
      </div>
    </div>
  );
}
