import { useState } from "react";
import { useContent } from "../content/ContentContext.jsx";
import BrandLogo from "./BrandLogo.jsx";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About me", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Off camera", href: "#off-camera" },
  { label: "Certifications", href: "#certifications" },
];

export default function Nav() {
  const { projects, certifications, sections, offCamera } = useContent();
  const [open, setOpen] = useState(false); // is the mobile menu open?
  const close = () => setOpen(false);

  // Links are hidden for sections that are switched off or empty
  const hidden = {
    "#about": !sections.about,
    "#work": !sections.work || projects.length === 0,
    "#off-camera": !sections.offCamera || (!offCamera.bagImage && !offCamera.items?.length),
    "#certifications": !sections.certifications || certifications.items.length === 0,
  };

  return (
    <header className="nav">
      <a href="#home" className="logo" aria-label="Home"><BrandLogo className="brand-content" /></a>

      <ul id="menu" className={open ? "nav-links open" : "nav-links"}>
        {LINKS.filter((link) => !hidden[link.href]).map((link) => (
          <li key={link.label}>
            <a href={link.href} onClick={close}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        {/* Hamburger button, only visible on tablets and phones */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}