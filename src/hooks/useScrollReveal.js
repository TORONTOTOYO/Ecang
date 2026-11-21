import { useLayoutEffect } from "react";

// Parts of the page that fade in when they scroll into view
const TARGETS = ".about > div, .section-head, .card-row > .card, .carousel, .contact";

// Adds a soft fade-up to each target the first time it appears on screen.
// "active" turns it on, and "refreshKey" re-checks when the content changes.
export default function useScrollReveal(active, refreshKey) {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!active || reduceMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          el.dataset.revealed = "1";
          observer.unobserve(el);
          // After the animation, hand control back to the element's own styles (like the card hover)
          setTimeout(() => el.classList.remove("reveal", "is-visible"), 1100);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    [...document.querySelectorAll(TARGETS)]
      .filter((el) => !el.dataset.revealed)
      .forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-delay", `${(i % 3) * 90}ms`);
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [active, refreshKey]);
}